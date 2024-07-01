import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// Endpoint to fetch jobs from local JSON file
app.get('/api/jobs', (req, res) => {
    fs.readFile(path.join(__dirname, 'jobs.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading jobs file:', err);
            res.status(500).json({ error: 'Failed to fetch jobs' });
            return;
        }
        const jobs = JSON.parse(data);
        res.json(jobs);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
