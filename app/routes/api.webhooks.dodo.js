import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "~/lib/firebase";

function emailToKey(email) {
  return email.toLowerCase().replace(/[.]/g, "_");
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

async function verifySignature(secret, webhookId, webhookTimestamp, body) {
  // Standard Webhooks: secret is prefixed with "whsec_"
  const secretBytes = base64ToUint8Array(secret.startsWith("whsec_") ? secret.slice(6) : secret);

  const signedContent = `${webhookId}.${webhookTimestamp}.${body}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedContent));
  return uint8ArrayToBase64(new Uint8Array(sig));
}

export async function action({ request, context }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const webhookId = request.headers.get("webhook-id");
  const webhookTimestamp = request.headers.get("webhook-timestamp");
  const webhookSignature = request.headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return new Response("Missing webhook headers", { status: 401 });
  }

  // Reject timestamps older than 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(webhookTimestamp);
  if (Math.abs(now - ts) > 300) {
    return new Response("Timestamp too old", { status: 401 });
  }

  const body = await request.text();
  const secret = context.cloudflare.env.DODO_WEBHOOK_SECRET;

  const expectedSig = await verifySignature(secret, webhookId, webhookTimestamp, body);

  // Compare against all provided signatures (space-separated, each prefixed with "v1,")
  const signatures = webhookSignature.split(" ");
  const valid = signatures.some((s) => {
    const [version, sigValue] = s.split(",");
    return version === "v1" && sigValue === expectedSig;
  });

  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Parse event and update Firestore
  const event = JSON.parse(body);
  const eventType = event.type;
  const data = event.data;
  const customerEmail = data?.customer?.email;

  if (!customerEmail) {
    return new Response("OK", { status: 200 });
  }

  // Look up user by email
  const emailKey = emailToKey(customerEmail);
  const emailDoc = await getDoc(doc(db, "usersByEmail", emailKey));

  if (!emailDoc.exists()) {
    console.error(`No user found for email: ${customerEmail}`);
    return new Response("OK", { status: 200 });
  }

  const uid = emailDoc.data().uid;
  const userRef = doc(db, "users", uid);

  // Map event type to subscription status
  const statusMap = {
    "subscription.active": "active",
    "subscription.renewed": "active",
    "subscription.on_hold": "on_hold",
    "subscription.failed": "failed",
  };

  const newStatus = statusMap[eventType] ?? data.status ?? "active";
  const isPremiumStatus = newStatus === "active";

  const updateData = {
    "subscription.status": newStatus,
    "subscription.plan": isPremiumStatus ? "premium" : "free",
    "subscription.dodoSubscriptionId": data.subscription_id || data.id || null,
    "subscription.dodoCustomerId": data.customer_id || data.customer?.id || null,
    "subscription.updatedAt": new Date().toISOString(),
  };

  await updateDoc(userRef, updateData);

  return new Response("OK", { status: 200 });
}
