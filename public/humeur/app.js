// Humeur du boss — client commun (vote, statut, device hash)
// Apollon-Marketing 2026-05-21

export const SUPABASE_URL = "https://xjlpttrziisldlclhsth.supabase.co";
export const SUPABASE_KEY = "sb_publishable_qG5XGinXYpNpGbmUyjej-Q_-eADJKcW";
// URL courte client-facing (encodée dans QR + posts).
// Cloudflare redirige humeur.labrassee.cafe → labrassee.cafe/humeur/
export const VOTE_URL = "https://humeur.labrassee.cafe/";

export const SLIDES = [
  { lvl: 0, e: "🐻", t: "Mode ours",    m: "Approchez en silence. Café déjà prêt. Bonne chance." },
  { lvl: 1, e: "😤", t: "Pas parlable", m: "Sourire poli, paiement rapide. À demain." },
  { lvl: 2, e: "⚡", t: "Trop speed",   m: "Soyez bref. Soyez précis. Il déborde." },
  { lvl: 3, e: "😎", t: "Cool",         m: "Conditions normales d'exploitation. Profitez." },
  { lvl: 4, e: "🤩", t: "Euphorique",   m: "Demandez-lui n'importe quoi. C'est le jour." }
];

export const ABSENT_SLIDES = [
  { e: "🎉", t: "Il est pas là.",     m: "Vous pouvez venir !!" },
  { e: "☀️", t: "Bulletin du jour",   m: "Risque d'humeur : 0 %. Profitez du soleil intérieur." },
  { e: "📣", t: "Communiqué spécial", m: "Le patron a pris congé. La fête commence à votre arrivée." }
];

export const PENDING_SLIDE = {
  e: "🤔", t: "En attente du premier vote", m: "Soyez le premier à juger l'humeur du boss aujourd'hui."
};

export async function getDeviceHash() {
  let id = localStorage.getItem("lb_humeur_device");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || (Math.random().toString(36).slice(2) + Date.now());
    localStorage.setItem("lb_humeur_device", id);
  }
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("lb-maia-" + id));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export function votedToday() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
  return localStorage.getItem("lb_humeur_voted_" + today);
}

export function markVoted(vote) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
  localStorage.setItem("lb_humeur_voted_" + today, String(vote));
}

export async function postVote(vote) {
  const device_hash = await getDeviceHash();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/humeur-vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
    body: JSON.stringify({ vote, device_hash })
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function getStatus() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/humeur-statut`, {
    headers: { "apikey": SUPABASE_KEY },
    cache: "no-store"
  });
  return await res.json().catch(() => ({ ok: false }));
}

export function currentSlide(status) {
  if (status?.etat?.absent) {
    const idx = Math.floor(Date.now() / 8000) % ABSENT_SLIDES.length;
    return { kind: "absent", ...ABSENT_SLIDES[idx], votes: null };
  }
  const nb = status?.stats?.nb_votes || 0;
  if (nb < 1) {
    return { kind: "pending", ...PENDING_SLIDE, votes: nb };
  }
  const median = Number(status?.stats?.median_vote);
  const lvl = Math.max(0, Math.min(4, Math.round(median)));
  return { kind: "humeur", lvl, ...SLIDES[lvl], votes: nb };
}

export function qrImgUrl(target, size) {
  const url = encodeURIComponent(target || VOTE_URL);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${url}&color=1a1a1a&bgcolor=ffffff&margin=10&qzone=1`;
}
