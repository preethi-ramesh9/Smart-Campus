// router.js
// Lightweight helper for page identification and future client-side routing.

export function getCurrentPageId() {
  const html = document.documentElement;
  return html.dataset.page || null;
}

