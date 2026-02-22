import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore/lite";
import { db } from "~/lib/firebase";

function emailToKey(email) {
  return email.toLowerCase().replace(/[.]/g, "_");
}

export async function action({ request, context }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } =
    await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !email) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const keySecret = context.cloudflare.env.RZPY_SECRET;

  // Verify signature: HMAC-SHA256 of "order_id|payment_id" using key_secret
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = `${razorpay_order_id}|${razorpay_payment_id}`;
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expectedSig !== razorpay_signature) {
    console.error("Razorpay verify: invalid signature");
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Activate premium for the user
  const emailKey = emailToKey(email);
  const emailDoc = await getDoc(doc(db, "usersByEmail", emailKey));

  if (!emailDoc.exists()) {
    console.error(`Razorpay verify: no user found for email: ${email}`);
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const uid = emailDoc.data().uid;

  await updateDoc(doc(db, "users", uid), {
    "subscription.plan": "premium",
    "subscription.status": "active",
    "subscription.razorpayPaymentId": razorpay_payment_id,
    "subscription.updatedAt": new Date().toISOString(),
  });

  await setDoc(doc(db, "payments", razorpay_payment_id), {
    uid,
    email,
    amount: 299900,
    currency: "INR",
    razorpayPaymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    paidAt: new Date().toISOString(),
  });

  console.log(`Razorpay verify: activated premium for ${email} (uid: ${uid})`);
  return Response.json({ success: true });
}
