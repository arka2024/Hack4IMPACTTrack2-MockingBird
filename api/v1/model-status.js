export default function handler(_req, res) {
  res.status(200).json({
    vision_model_loaded: false,
    text_model_loaded: false,
    fallback_active: true,
    deployment_mode: "vercel_serverless",
    note: "Lightweight API active for deployment demo.",
  });
}
