import express from 'express';
import cors from 'cors';
import quoteRouter from './routes/quote.js';
import fxRouter from './routes/fx.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

app.use('/api/quote', quoteRouter);
app.use('/api/fx', fxRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown server error';
  res.status(500).json({ ok: false, message });
});

app.listen(port, () => {
  console.log(`[cwgjwy-server] listening on http://localhost:${port}`);
});
