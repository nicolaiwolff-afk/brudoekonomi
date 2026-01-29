const Stripe = require("stripe");

module.exports = async (req, res) => {
  try {
    const session_id = req.query.session_id;

    if (!session_id) {
      return res.status(400).json({ ok: false, error: "Missing session_id" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const paid = session && session.payment_status === "paid";

    return res.status(200).json({
      ok: true,
      paid,
      amount_total: session.amount_total,
      currency: session.currency
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
};