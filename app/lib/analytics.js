/**
 * Unified analytics helper — fires events to all configured providers.
 * Supports: Meta Pixel (fbq) + Google Analytics 4 (gtag)
 */

function getFbq() {
  if (typeof window !== "undefined" && window.fbq) return window.fbq;
  return null;
}

function getGtag() {
  if (typeof window !== "undefined" && window.gtag) return window.gtag;
  return null;
}

// Map Meta standard event names to GA4 recommended event names
const META_TO_GA4 = {
  Purchase: "purchase",
  CompleteRegistration: "sign_up",
  InitiateCheckout: "begin_checkout",
  ViewContent: "view_item",
  Lead: "generate_lead",
};

/** Fire a standard event (e.g. Purchase, Lead, ViewContent) */
export function trackEvent(eventName, params = {}) {
  const fbq = getFbq();
  if (fbq) fbq("track", eventName, params);

  const gtag = getGtag();
  if (gtag) {
    const ga4Event = META_TO_GA4[eventName] || eventName.toLowerCase();
    gtag("event", ga4Event, params);
  }
}

/** Fire a custom event (e.g. QuizSubmitted, ModuleCompleted) */
export function trackCustomEvent(eventName, params = {}) {
  const fbq = getFbq();
  if (fbq) fbq("trackCustom", eventName, params);

  const gtag = getGtag();
  if (gtag) {
    // GA4 custom events use snake_case by convention
    const ga4Event = eventName.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
    gtag("event", ga4Event, params);
  }
}
