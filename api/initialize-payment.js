
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({
      message: "Payment service is not configured"
    });
  }

  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    return res.status(500).json({
      message: "Site URL is not configured"
    });
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: req.body?.email,
          amount: 50000,
          currency: "GHS",
          callback_url: `${siteUrl}/vip.html`
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status || !result.data?.authorization_url) {
      return res.status(400).json({
        message: "Could not start payment"
      });
    }

    return res.status(200).json({
      authorization_url: result.data.authorization_url
    });
  } catch {
    return res.status(500).json({
      message: "Payment service error"
    });
  }
}
