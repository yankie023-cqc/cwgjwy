import { json } from "../../_lib/http.js";

const FALLBACK = {
  CNY: 1,
  HKD: 0.9,
  USD: 7
};

export async function onRequestGet() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/CNY", { method: "GET" });
    if (!response.ok) {
      return json({ ok: true, data: FALLBACK });
    }

    const data = await response.json();
    const rates = data?.rates || {};

    return json({
      ok: true,
      data: {
        CNY: 1,
        HKD: rates.HKD ? Number(1 / Number(rates.HKD)) : FALLBACK.HKD,
        USD: rates.USD ? Number(1 / Number(rates.USD)) : FALLBACK.USD
      }
    });
  } catch {
    return json({ ok: true, data: FALLBACK });
  }
}
