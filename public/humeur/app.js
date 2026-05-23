// Humeur du boss — client commun (vote, statut, device hash, pioche aléatoire stable par jour)
// Apollon-Marketing 2026-05-21

export const SUPABASE_URL = "https://xjlpttrziisldlclhsth.supabase.co";
export const SUPABASE_KEY = "sb_publishable_qG5XGinXYpNpGbmUyjej-Q_-eADJKcW";
// URL courte client-facing (encodée dans QR + posts).
// Cloudflare redirige humeur.labrassee.cafe → labrassee.cafe/humeur/
export const VOTE_URL = "https://humeur.labrassee.cafe/";

// 35 variantes — 7 par niveau, pioche aléatoire stable par jour (cf. pickToday plus bas)
export const VARIANTS = [
  // Niveau 0 — La pire (autodérision crue, ours grognon assumé)
  [
    { e: "🐻",   t: "Mode ours",                m: "Approchez en silence. Café déjà prêt. Bonne chance." },
    { e: "🐻",   t: "Hibernation interrompue",  m: "Il a perdu le sommeil. Vous, gardez le vôtre." },
    { e: "☁️",  t: "Avant le premier café",    m: "Aucun mot prononcé ce matin. C'est intentionnel." },
    { e: "⛈️",  t: "Petite tempête",           m: "Petits cafés, gros nuages. C'est sous contrôle." },
    { e: "🚧",  t: "Code rouge",               m: "L'humain est temporairement hors service. Reprise demain." },
    { e: "😶",  t: "Pas envie",                m: "Lui non plus." },
    { e: "🙈",  t: "Évitez le contact visuel", m: "Survivez, payez, partez. On vous aime quand même." }
  ],
  // Niveau 1 — Pas parlable (sec, fonctionnel, sans cordialité superflue)
  [
    { e: "😤",  t: "Pas parlable",              m: "Sourire poli, paiement rapide. À demain." },
    { e: "😐",  t: "Communication minimale",    m: "Oui. Non. Merci. C'est tout pour aujourd'hui." },
    { e: "📡",  t: "Signal faible",             m: "Le réseau humain est en zone blanche aujourd'hui." },
    { e: "✂️",  t: "Sec et efficace",           m: "Comme une bonne ristretto. Sans les éloges." },
    { e: "💭",  t: "En conférence intérieure",  m: "Il discute avec lui-même. Vous attendez votre tour." },
    { e: "🎯",  t: "Mode autopilote",           m: "Il reconnaît votre commande. Pas votre tête." },
    { e: "🔇",  t: "Muet activé",               m: "Il vous entend très bien. Il préfère ne pas répondre." }
  ],
  // Niveau 2 — Trop speed (énergie haute, exigence implicite)
  [
    { e: "⚡",   t: "Trop speed",                m: "Soyez bref. Soyez précis. Il déborde." },
    { e: "☕",  t: "200 % caféine",             m: "Il a goûté trois espresso ce matin. Pour vérifier." },
    { e: "🚀",  t: "Hyperdrive engagé",         m: "Ne posez pas deux questions à la suite." },
    { e: "🎪",  t: "Multitâche maximal",        m: "Votre café, la commande des deux autres, sa pensée. Tout en parallèle." },
    { e: "🌪️", t: "Tornade contrôlée",         m: "Tout va vite. Tout est bon. Tenez bon." },
    { e: "🏎️", t: "Croisière + 80 km/h",       m: "Restez calme. Lui, non. Mais ça avance." },
    { e: "🔥",  t: "Énergie nucléaire",         m: "Le café est rapide. Lui aussi. Suivez le rythme." }
  ],
  // Niveau 3 — Cool (état nominal, le but de la marque)
  [
    { e: "😎",  t: "Cool",                      m: "Conditions normales d'exploitation. Profitez." },
    { e: "🎼",  t: "Mode classique",            m: "Pas trop, pas trop peu. Juste bien." },
    { e: "🙂",  t: "À l'aise",                  m: "Aujourd'hui, on peut tout demander. Presque." },
    { e: "🧘",  t: "Centre d'équilibre",        m: "Niveau zen atteint. Sans le yoga." },
    { e: "🌊",  t: "Bonne onde",                m: "Café réussi. Humeur idem. Pas plus compliqué." },
    { e: "👋",  t: "Mode disponible",           m: "Il vous reconnaît, vous parle, vous sourit. Trio rare." },
    { e: "✨",  t: "Pleinement présent",        m: "Vous êtes au bon endroit, au bon moment." }
  ],
  // Niveau 4 — Euphorique (bonus rare, célébration)
  [
    { e: "🤩",  t: "Euphorique",                m: "Demandez-lui n'importe quoi. C'est le jour." },
    { e: "🎁",  t: "Mode bonus",                m: "Sourires gratuits avec chaque commande." },
    { e: "🏆",  t: "Conditions exceptionnelles",m: "Profitez tant que ça dure. Stocks limités." },
    { e: "☀️",  t: "Pleine forme",              m: "Le café est bon. Lui aussi. Coïncidence ?" },
    { e: "🎰",  t: "Triple combo",              m: "Bon café, bon karma, bonne humeur. Jackpot." },
    { e: "📈",  t: "Phase ascendante",          m: "Il rit. Il rit fort. Il rit encore." },
    { e: "🌟",  t: "Mode bénédiction",          m: "Tout le monde repart avec un sourire en bonus." }
  ]
];

// Compat : SLIDES exporté en single-variant (1ère de chaque niveau) pour la page de vote (thanks panel)
export const SLIDES = VARIANTS.map((v, lvl) => ({ lvl, ...v[0] }));

export const ABSENT_SLIDES = [
  { e: "🎉", t: "Le boss est en congé", m: "Aujourd'hui, c'est jour de fête !" },
  { e: "🎊", t: "Jour de fête",         m: "Le patron a pris congé. La fête commence à votre arrivée." },
  { e: "☀️", t: "Bulletin du jour",    m: "Risque d'humeur : 0 %. Profitez du soleil intérieur." },
  { e: "📣", t: "Communiqué spécial",  m: "Boss en off. Vous pouvez venir tranquilles." }
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
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("lb-salt-" + id));
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

// Pioche pseudo-aléatoire stable par jour (Mtl) — chaque jour, chaque niveau a sa variante
// Stable durant la journée, change à minuit (heure Mtl)
function pickToday(lvl) {
  const mtl = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const ymd = mtl.getFullYear() * 10000 + (mtl.getMonth() + 1) * 100 + mtl.getDate();
  // LCG avec seed combinant date + niveau (offsets premiers pour décorréler les niveaux)
  let seed = (ymd ^ (lvl * 2654435761)) >>> 0;
  seed = (Math.imul(seed, 1103515245) + 12345 + lvl * 7919) >>> 0;
  return seed % VARIANTS[lvl].length;
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
  const variant = VARIANTS[lvl][pickToday(lvl)];
  return { kind: "humeur", lvl, ...variant, votes: nb };
}

export function qrImgUrl(target, size) {
  const url = encodeURIComponent(target || VOTE_URL);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${url}&color=1a1a1a&bgcolor=ffffff&margin=10&qzone=1`;
}
