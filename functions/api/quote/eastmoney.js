import { error, json } from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const requestUrl = new URL(context.request.url);
    const secid = String(requestUrl.searchParams.get("secid") || "").trim();
    const divisor = Number(requestUrl.searchParams.get("divisor") || 1000);
    if (!secid) {
      return error("secid is required", 400);
    }

    const url = new URL("https://push2.eastmoney.com/api/qt/stock/get");
    url.searchParams.set("secid", secid);
    url.searchParams.set("fields", "f58,f43");

    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      return error(`eastmoney request failed: ${response.status}`, 502);
    }

    const body = await response.json();
    if (body?.rc !== 0 || !body?.data?.f58 || body?.data?.f43 === undefined || body?.data?.f43 === null) {
      return error(`eastmoney no quote: ${secid}`, 404);
    }

    return json({
      ok: true,
      data: {
        name: body.data.f58,
        rawPrice: Number(body.data.f43) / (Number(divisor) || 1000)
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return error(message, 500);
  }
}
