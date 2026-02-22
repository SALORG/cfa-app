export async function action({ request, context }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { uid, email } = await request.json();

  if (!uid || !email) {
    return Response.json({ error: "Missing uid or email" }, { status: 400 });
  }

  const keyId = context.cloudflare.env.RZPY_KEY;
  const keySecret = context.cloudflare.env.RZPY_SECRET;

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${keyId}:${keySecret}`),
    },
    body: JSON.stringify({
      amount: 299900, // INR 2,999.00 in paise
      currency: "INR",
      receipt: `cfa_${uid.slice(0, 20)}_${Date.now()}`,
      notes: { uid, email },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Razorpay order creation failed:", res.status, err);
    return Response.json(
      { error: "Failed to create order", details: err },
      { status: 500 }
    );
  }

  const order = await res.json();

  return Response.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: keyId,
  });
}
