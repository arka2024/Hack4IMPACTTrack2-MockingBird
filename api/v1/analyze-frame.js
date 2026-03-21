function analyzeSignalText(signalText = "") {
  const text = String(signalText).toLowerCase();
  if (!text.trim()) {
    return { score: 0, type: "No Linguistic Threat", block: false, flags: [] };
  }

  const manipulation = [
    "act now",
    "limited time",
    "keep this secret",
    "you have no choice",
    "urgent transfer",
    "bypass",
    "or else",
  ];

  const objection = [
    "i don't agree",
    "i do not agree",
    "i refuse",
    "this is unsafe",
    "reject",
  ];

  let score = 0;
  const flags = [];
  let hasManipulation = false;

  for (const p of manipulation) {
    if (text.includes(p)) {
      score += 24;
      hasManipulation = true;
      flags.push(`manipulation:${p}`);
    }
  }

  for (const p of objection) {
    if (text.includes(p)) {
      score += 10;
      flags.push(`objection:${p}`);
    }
  }

  if (text.includes("!!")) {
    score += 8;
    flags.push("pressure:exclamation");
  }

  score = Math.min(100, score);
  return {
    score,
    type: hasManipulation ? "Manipulative Prompting" : (score > 0 ? "User Objection Signal" : "No Linguistic Threat"),
    block: hasManipulation && score >= 45,
    flags,
  };
}

function mapAction(score, blocked) {
  if (blocked) {
    return { action: "BLOCKED", message: "Manipulation/coercion pattern detected. Request blocked for safety review." };
  }
  if (score <= 20) return { action: "MONITOR", message: "Silent logging active. System operating normally." };
  if (score <= 40) return { action: "RESTRICT", message: "High stakes decisions blocked pending validation." };
  if (score <= 60) return { action: "DEGRADE", message: "Confidence mathematically reduced. Maintenance scheduled." };
  if (score <= 80) return { action: "TRANSFER", message: "Camera disabled. System transferred to failover path." };
  return { action: "EM_STOP", message: "CRITICAL ATTACK: Physical system locked down!" };
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const signalText = body.signal_text || "";
  const lang = analyzeSignalText(signalText);

  // Lightweight deployment-safe threat estimate (no heavy ML dependencies on Vercel).
  const hasImage = Boolean(body.image_b64);
  const baseScore = hasImage ? 12 : 35;
  const fused = Math.max(baseScore, lang.score);
  const mapped = mapAction(fused, lang.block);

  res.status(200).json({
    threat_score: fused,
    attack_type: lang.score > baseScore ? lang.type : "Normal Scene",
    action: mapped.action,
    message: mapped.message,
    detection_flags: ["api_source:vercel", ...(lang.flags || [])],
  });
}
