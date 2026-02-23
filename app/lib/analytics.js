/**
 * Unified analytics helper — fires events to all configured providers.
 * Currently supports: Meta Pixel (fbq)
 * Add Google Analytics (gtag), etc. here in the future.
 */

function getFbq() {
  if (typeof window !== "undefined" && window.fbq) return window.fbq;
  return null;
}

/** Fire a standard event (e.g. Purchase, Lead, ViewContent) */
export function trackEvent(eventName, params = {}) {
  const fbq = getFbq();
  if (fbq) fbq("track", eventName, params);
}

/** Fire a custom event (e.g. QuizSubmitted, ModuleCompleted) */
export function trackCustomEvent(eventName, params = {}) {
  const fbq = getFbq();
  if (fbq) fbq("trackCustom", eventName, params);
}
