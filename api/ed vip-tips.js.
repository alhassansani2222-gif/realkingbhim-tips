
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const reference = req.body?.reference;

  if (
    typeof reference !== "string" ||
    reference.length < 5 ||
    reference.length > 200
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment reference"
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({
      success: false,
      message: "Payment settings are missing"
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
    const payment = result.data;

    const verified =
      response.ok &&
      result.status === true &&
      payment?.status === "success" &&
      payment?.currency === "GHS" &&
      payment?.amount === 5000;

    if (!verified) {
      return res.status(403).json({
        success: false,
        message: "Payment not verified"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified",
      tips: [
        { match: "Juventus vs Rennes", selection: "Asian Over/Under — Away", odds: "1.29" },
        { match: "Sturm Graz vs Marseille", selection: "Home", odds: "1.89" },
        { match: "GNK Dinamo Zagreb vs NEC Nijmegen", selection: "Away", odds: "1.58" },
        { match: "OFI Crete vs Bayer Leverkusen", selection: "Away (0:2)", odds: "1.21" },
        { match: "Hoffenheim vs Lyon", selection: "Away (0:2)", odds: "1.33" },
        { match: "Bournemouth vs AC Milan", selection: "Away (0:2)", odds: "1.29" },
        { match: "Lillestroem SK vs Real Sociedad", selection: "Away", odds: "1.25" },
        { match: "AC Omonia Nicosia vs Benfica", selection: "Home", odds: "1.37" },
        { match: "Trabzonspor vs Heart of Midlothian FC", selection: "Away", odds: "1.30" }
      ]
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Could not verify payment"
    });
  }
}
