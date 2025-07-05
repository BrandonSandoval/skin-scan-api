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

        // Create a temporary path for the buffer
        const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${req.file.originalname}`);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        // Detect if inside Docker by checking a known Docker file
        const isDocker = fs.existsSync('/.dockerenv');

        // Set path to predict.py
        const pythonScriptPath = isDocker
            ? path.join(__dirname, '..', 'model', 'predict.py') // inside Docker
            : path.join(__dirname, '..', '..', 'model', 'predict.py'); // local
        const python = spawn('python', [pythonScriptPath, tempFilePath]);

        let result = '';
        python.stdout.on('data', (data) => result += data.toString());
        python.stderr.on('data', (err) => console.error("Python error:", err.toString()));

        python.on('close', async (code) => {
            fs.unlinkSync(tempFilePath); // delete after prediction

            if (code !== 0) return res.status(500).json({ message: "Prediction failed" });

            try {
                const { label, confidence } = JSON.parse(result);

                // Create a proper history entry with all required fields
                await History.create({
                    userId: req.user.userId,
                    imagePath: req.file.originalname,
                    prediction: label,
                    confidence: parseFloat(confidence) // Ensure this is a number
                });

                res.json({ label, confidence });
            } catch (err) {
                console.error("Parse error:", err);
                res.status(500).json({ message: "Failed to parse prediction result" }); 
            }
        });
    } catch (err) {
        console.error("Prediction error:", err);
        res.status(500).json({ message: "Prediction failed" });
    }
};