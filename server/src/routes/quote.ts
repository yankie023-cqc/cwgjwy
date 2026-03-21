import { Router } from 'express';
import { fetchEastmoneyQuoteBySecid, fetchOffFundQuoteByCode } from '../services/quote.js';

const router = Router();

router.get('/eastmoney', async (req, res, next) => {
  try {
    const secid = String(req.query.secid || '').trim();
    const divisor = Number(req.query.divisor || 1000);
    if (!secid) {
      res.status(400).json({ ok: false, message: 'secid is required' });
      return;
    }

    const data = await fetchEastmoneyQuoteBySecid(secid, divisor);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/off-fund/:code', async (req, res, next) => {
  try {
    const code = String(req.params.code || '').trim();
    if (!code) {
      res.status(400).json({ ok: false, message: 'code is required' });
      return;
    }

    const data = await fetchOffFundQuoteByCode(code);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
