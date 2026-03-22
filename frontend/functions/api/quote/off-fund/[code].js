import { error, json } from "../../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const code = String(context.params?.code || "").trim();
    if (!code) {
      return error("code is required", 400);
    }

    const response = await fetch(`https://fundgz.1234567.com.cn/js/${encodeURIComponent(code)}.js`, { method: "GET" });
    if (!response.ok) {
      return error(`off-fund request failed: ${response.status}`, 502);
    }

    const text = await response.text();
    const match = text.match(/jsonpgz\((.*)\);?/);
    if (!match?.[1]) {
      return error("off-fund parse failed", 502);
    }

    const obj = JSON.parse(match[1]);
    const price = Number(obj?.gsz || obj?.dwjz || 0);
    if (!obj?.name || !price) {
      return error("off-fund invalid data", 502);
    }

    return json({
      ok: true,
      data: {
        name: obj.name,
        rawPrice: price,
        currency: "CNY"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return error(message, 500);
  }
}
