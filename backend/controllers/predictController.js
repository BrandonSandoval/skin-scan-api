const path = require('path');
const { spawn } = require('child_process');
const History = require('../models/History');
const fs = require('fs');
const os = require('os');

exports.handlePrediction = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${req.file.originalname}`);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        const isDocker = fs.existsSync('/.dockerenv');
        const isWindows = os.platform() === 'win32';

        // Try multiple possible locations for predict.py
        let pythonScriptPath = isDocker
            ? path.join(process.cwd(), 'model', 'predict.py')
            : path.join(__dirname, '..', '..', 'model', 'predict.py');

        console.log("Looking for Python script at:", pythonScriptPath);
        console.log("Exists:", fs.existsSync(pythonScriptPath));

        if (!fs.existsSync(pythonScriptPath)) {
            const fallbackPath = '/app/model/predict.py';
            console.log("Trying fallback path:", fallbackPath);
            if (fs.existsSync(fallbackPath)) {
                pythonScriptPath = fallbackPath;
            } else {
                console.error("Python script not found at:", pythonScriptPath);
                if (isDocker) {
                    try {
                        console.error("Directory listing for /app/model:");
                        console.error(fs.readdirSync('/app/model'));
                    } catch (err) {
                        console.error("Failed to list /app/model:", err);
                    }
                }
                return res.status(500).json({ message: "Prediction script missing" });
            }
        }

        const pythonCommand = isDocker ? 'python3' : 'python';
        const command = isWindows && !isDocker ? 'py' : pythonCommand;

        console.log(`Using Python command: ${command}`);

        let result = '';
        let errorOutput = '';

        const python = spawn(command, [pythonScriptPath, tempFilePath]);

        python.stdout.on('data', (data) => result += data.toString());

        python.stderr.on('data', (err) => {
            const errStr = err.toString();
            errorOutput += errStr;
            console.error("Python error:", errStr);
        });

        python.on('close', async (code) => {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (err) {
                console.error("Error removing temp file:", err);
            }

            if (code !== 0) {
                console.error(`Python process exited with code ${code}`);
                return res.status(500).json({
                    message: "Prediction failed",
                    details: errorOutput.substring(0, 200)
                });
            }

            try {
                const { label, confidence } = JSON.parse(result);

                await History.create({
                    userId: req.user.userId,
                    imagePath: req.file.originalname,
                    prediction: label,
                    confidence: parseFloat(confidence || 0)
                });

                res.json({ label, confidence });
            } catch (err) {
                console.error("Parse error:", err);
                res.status(500).json({
                    message: "Failed to parse prediction result",
                    details: result.substring(0, 200)
                });
            }
        });
    } catch (err) {
        console.error("Prediction error:", err);
        res.status(500).json({ message: "Prediction failed" });
    }
};
