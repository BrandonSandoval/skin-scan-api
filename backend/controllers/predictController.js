const path = require('path');
const { spawn } = require('child_process');
const History = require('../models/History');

exports.handlePrediction = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const imagePath = path.join(__dirname, '..', 'static', req.file.filename);
        
        // Fix: provide absolute path to the Python script
        const pythonScriptPath = path.join(__dirname, '..', '..', 'model', 'predict.py');
        
        // Call python script for prediction with correct path
        const python = spawn('python', [pythonScriptPath, imagePath]);

        let result = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (err) => {
            console.error("Python error:", err.toString());
        });
        
        python.on('close', async (code) => {
            if (code !== 0) {
                console.error("Python process exited with code", code);
                return res.status(500).json({ message: "Prediction failed" });
            }
            
            try {
                const { label, confidence } = JSON.parse(result);
                
                await History.create({
                    userId: req.user.userId,
                    imagePath: req.file.filename,
                    prediction: label,
                    confidence
                });
                res.json({ label, confidence });
            } catch (parseError) {
                console.error("Failed to parse prediction result:", parseError);
                return res.status(500).json({ message: "Failed to parse prediction result" });
            }
        }); 

    } catch (error) {
        console.error("Prediction error:", error);
        return res.status(500).json({ message: "Prediction failed" });
    }
}