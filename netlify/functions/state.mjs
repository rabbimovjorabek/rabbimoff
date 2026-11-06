// Kredit to'lovlari — ma'lumotlarni Netlify Blobs'da saqlaydigan funksiya
import { getStore } from "@netlify/blobs";

const EMPTY = { paid: {}, credits: {} };
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

function applyOp(state, b) {
  if (b.op === "paid") {
    if (typeof b.id !== "string" || b.id.length > 200) throw new Error("bad id");
    if (b.on) state.paid[b.id] = /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : new Date().toISOString().slice(0, 10);
    else delete state.paid[b.id];
  } else if (b.op === "addCredit") {
    const c = b.credit || {};
    if (!/^[A-Za-z0-9]{1,40}$/.test(b.cid || "")) throw new Error("bad cid");
    if (!c.bank || !(c.amount > 0) || !(c.day >= 1 && c.day <= 31) || !/^\d{4}-\d{2}$/.test(c.start) || !(c.months >= 1 && c.months <= 120)) throw new Error("bad credit");
    state.credits[b.cid] = { bank: String(c.bank).slice(0, 40), amount: Math.round(c.amount), day: Math.round(c.day), start: c.start, months: Math.round(c.months), note: String(c.note || "").slice(0, 60), created: c.created || "" };
  } else if (b.op === "delCredit") {
    delete state.credits[b.cid];
    const prefix = "c:" + b.cid + "|";
    for (const id of Object.keys(state.paid)) if (id.startsWith(prefix)) delete state.paid[id];
  } else throw new Error("bad op");
  return state;
}

export default async (req) => {
  const key = Netlify.env.get("ACCESS_KEY");
  if (!key) return json({ error: "ACCESS_KEY sozlanmagan" }, 500);
  if (req.headers.get("x-access-key") !== key) return json({ error: "unauthorized" }, 401);

  const store = getStore({ name: "kredit", consistency: "strong" });
  const load = async () => ({ ...EMPTY, ...((await store.get("state", { type: "json" })) || {}) });

  if (req.method === "GET") return json(await load());
  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    try {
      const state = applyOp(await load(), body);
      await store.setJSON("state", state);
      return json(state);
    } catch (e) { return json({ error: e.message }, 400); }
  }
  return json({ error: "method" }, 405);
};

export const config = { path: "/api/state" };
