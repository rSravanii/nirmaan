import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

dotenv.config();

import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';
import { setSocketIO } from './services/notifications/index.js';
import { seedDatabaseIfEmpty } from '../scripts/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
void __dirname;

const app = express();
const server = http.createServer(app);

const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  if (!origin || configuredOrigins.includes('*') || configuredOrigins.includes(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error('Origin not allowed by Nirmaan CORS policy'));
};

const io = new SocketIOServer(server, {
  cors: {
    origin: configuredOrigins.includes('*') ? '*' : configuredOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

setSocketIO(io);

io.on('connection', (socket) => {
  socket.on('join_user', (userId: string) => socket.join(`user_${userId}`));
  socket.on('join_project', (projectId: string) => socket.join(`project_${projectId}`));
  socket.on('project_message', (data: { projectId: string; message: any }) => {
    if (!data?.projectId) return;
    io.to(`project_${data.projectId}`).emit('new_project_message', data.message);
  });
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});
app.use('/api', apiLimiter);

const uploadsPath = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));
app.use('/uploads', express.static(uploadsPath, { maxAge: '1d' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    name: 'Nirmaan API Service',
    ministry: 'Government of Jharkhand',
    problemStatement: 'SIH26043',
    databaseMode: process.env.MONGODB_URI ? 'external-mongodb' : 'in-memory-demo',
    aiProvider: process.env.AI_PROVIDER || 'auto',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server Internal Error:', err);
  const status = Number(err?.status || err?.statusCode) || 500;
  res.status(status).json({
    success: false,
    message: err?.message || 'An unexpected error occurred on the server.',
  });
});

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be configured in production.');
    }

    await connectDB();
    await seedDatabaseIfEmpty();

    server.listen(PORT, () => {
      console.log('=======================================================');
      console.log(`🚀 Nirmaan API running on port ${PORT}`);
      console.log('🇮🇳 SIH26043 — Government of Jharkhand');
      console.log(`🤖 AI provider: ${process.env.AI_PROVIDER || 'auto'}`);
      console.log(`🗄️ Database: ${process.env.MONGODB_URI ? 'external MongoDB' : 'embedded demo MongoDB'}`);
      console.log('=======================================================');
    });
  } catch (error) {
    console.error('Failed to start Nirmaan server:', error);
    process.exit(1);
  }
}

startServer();
