import { json } from "../_lib/http.js";

export async function onRequestGet() {
  return json({ ok: true, now: new Date().toISOString() });
}
