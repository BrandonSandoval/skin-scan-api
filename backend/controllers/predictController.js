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

        // Fix path resolution for Docker environment
        let pythonScriptPath;
        if (isDocker) {
            // In Docker, model directory is at the project root
            pythonScriptPath = path.join(process.cwd(), 'model', 'predict.py');
            // Alternative path if the above doesn't work
            if (!fs.existsSync(pythonScriptPath)) {
                pythonScriptPath = '/app/model/predict.py';
            }
        } else {
            // Local development - go up from controllers directory
            pythonScriptPath = path.join(__dirname, '..', '..', 'model', 'predict.py');
        }

        // Log the path for debugging
        console.log("Looking for Python script at:", pythonScriptPath);
        
        if (!fs.existsSync(pythonScriptPath)) {
            console.error("Python script not found at:", pythonScriptPath);
            
            // Additional debugging for Docker environment
            if (isDocker) {
                console.error("Directory listing for /app/model:");
                try {
                    const files = fs.readdirSync('/app/model');
                    console.error(files);
                } catch (err) {
                    console.error("Failed to list directory:", err);
                }
            }
            
            return res.status(500).json({ message: "Prediction script missing" });
        }
        
        // Determine which Python command to use based on environment
        const pythonCommand = isDocker ? 'python3' : 'python';
        
        // Check if we need to use 'py' on Windows
        const isWindows = os.platform() === 'win32';
        const command = isWindows && !isDocker ? 'py' : pythonCommand;
        
        console.log(`Using Python command: ${command}`);
        
        const python = spawn(command, [pythonScriptPath, tempFilePath]);

        let result = '';
        let errorOutput = '';
        
        python.stdout.on('data', (data) => result += data.toString());
        
        python.stderr.on('data', (err) => {
            const errStr = err.toString();
            errorOutput += errStr;
            console.error("Python error:", errStr);
            
            // If Python is not found on Windows, try using 'py' instead
            if (isWindows && !isDocker && errStr.includes('Python was not found') && command !== 'py') {
                console.log("Retrying with 'py' command...");
                const pyProcess = spawn('py', [pythonScriptPath, tempFilePath]);
                
                pyProcess.stdout.on('data', (data) => result += data.toString());
                pyProcess.stderr.on('data', (err) => console.error("py error:", err.toString()));
                
                pyProcess.on('close', handleProcessClose);
            }
        });

        const handleProcessClose = async (code) => {
            // Clean up the temporary file
            try {
                fs.unlinkSync(tempFilePath);
            } catch (err) {
                console.error("Error removing temp file:", err);
            }

            if (code !== 0) {
                console.error(`Python process exited with code ${code}`);
                return res.status(500).json({ 
                    message: "Prediction failed", 
                    details: errorOutput.substring(0, 200) // Send first 200 chars of error 
                });
            }

            try {
                const { label, confidence } = JSON.parse(result);

                // Create a proper history entry with all required fields
                await History.create({
                    userId: req.user.userId,
                    imagePath: req.file.originalname,
                    prediction: label,
                    confidence: parseFloat(confidence || 0) // Ensure this is a number
                });

                res.json({ label, confidence });
            } catch (err) {
                console.error("Parse error:", err);
                res.status(500).json({ 
                    message: "Failed to parse prediction result",
                    details: result.substring(0, 200) // Send first 200 chars of result
                }); 
            }
        };
        
        python.on('close', handleProcessClose);
    } catch (err) {
        console.error("Prediction error:", err);
        res.status(500).json({ message: "Prediction failed" });
    }
};