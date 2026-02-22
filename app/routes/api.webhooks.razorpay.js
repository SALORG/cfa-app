import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "~/lib/firebase";

function emailToKey(email) {
  return email.toLowerCase().replace(/[.]/g, "_");
}

async function verifySignature(secret, body, signatureHeader) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expectedSig === signatureHeader;
}

export async function action({ request, context }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const secret = context.cloudflare.env.RAZORPAY_WEBHOOK_SECRET;

  // Verify signature if secret is configured
  if (secret && signature) {
    const valid = await verifySignature(secret, body, signature);
    if (!valid) {
      console.error("Razorpay webhook: invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }
  }

  const event = JSON.parse(body);
  const eventType = event.event;
  const payment = event.payload?.payment?.entity;

  console.log(`Razorpay webhook: event=${eventType}, payment_id=${payment?.id}, email=${payment?.email}, amount=${payment?.amount}, status=${payment?.status}`);

  // Only process successful payments
  if (eventType !== "payment.captured") {
    console.log(`Razorpay webhook: skipping event ${eventType}`);
    return new Response("OK", { status: 200 });
  }

  const customerEmail = payment?.email;

  if (!customerEmail) {
    console.error("Razorpay webhook: no email in payment");
    return new Response("OK", { status: 200 });
  }

  // Look up user by email
  const emailKey = emailToKey(customerEmail);
  const emailDoc = await getDoc(doc(db, "usersByEmail", emailKey));

  if (!emailDoc.exists()) {
    console.error(`Razorpay webhook: no user found for email: ${customerEmail}`);
    return new Response("OK", { status: 200 });
  }

  const uid = emailDoc.data().uid;
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    "subscription.plan": "premium",
    "subscription.status": "active",
    "subscription.razorpayPaymentId": payment.id || null,
    "subscription.updatedAt": new Date().toISOString(),
  });

  console.log(`Razorpay webhook: activated premium for ${customerEmail} (uid: ${uid})`);
  return new Response("OK", { status: 200 });
}
