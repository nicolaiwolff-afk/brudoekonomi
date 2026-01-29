export default async function handler(req, res) {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ ok: false, error: "missing_session_id" });
    }

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return res.status(500).json({ ok: false, error: "missing_stripe_secret_key" });
    }

    const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`, {
      headers: {
        "Authorization": `Bearer ${key}`
      }
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ ok: false, error: data });
    }

    const paid = data.payment_status === "paid";
    return res.status(200).json({ ok: true, paid });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
