
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { reference } = req.body || {};

  if (!reference || typeof reference !== "string") {
    return res.status(400).json({
      success: false,
      message: "Payment reference is required"
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({
      success: false,
      message: "Payment verification is not configured"
    });
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/verify/" +
        encodeURIComponent(reference),
      {
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      }
    );

    const result = await response.json();
    const transaction = result.data;

    const verified =
      response.ok &&
      result.status === true &&
      transaction?.status === "success" &&
      transaction?.currency === "GHS" &&
      transaction?.amount === 500000;

    return res.status(200).json({
      success: verified,
      message: verified
        ? "Payment verified"
        : "Payment could not be verified"
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again."
    });
  }
}
