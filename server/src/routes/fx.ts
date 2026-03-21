import { Router } from 'express';
import { fetchFxToCnyMap } from '../services/fx.js';

const router = Router();

router.get('/cny', async (_req, res, next) => {
  try {
    const data = await fetchFxToCnyMap();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
