const path = require('path');
const { spawn } = require('child_process');
const History = require('../models/History');

exports.handlePreiction = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const imagePath = path.join(__dirname, '..', 'static', req.file.filename);
        
        // Call python script for prediction
        const python = spawn('python3', ['model/predict.py', imagePath]);

        let result = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (err) => {
            console.error("Python error:", err.toString());
        });
        
        python.on('close', async () => {
            const { label, confidence } = JSON.parse(result);

            await History.create({
                userId: req.user.userId,
                imagePath: req.file.filename,
                prediction: label,
                confidence
            });
            res.json({ label, confidence });
        }); 

    } catch (error) {
        console.error("Prediction error:", error);
        return res.status(500).json({ message: "Prediction failed" });
    }
}