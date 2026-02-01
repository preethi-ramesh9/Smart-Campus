// utils.js
// Shared helpers (DOM, toasts, simple validation, etc.)

export function $(selector) {
  return document.querySelector(selector);
}

export function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

export function createEl(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "class") el.className = value;
    else if (key === "text") el.textContent = value;
    else el.setAttribute(key, value);
  });
  children.forEach((child) => {
    if (typeof child === "string") el.appendChild(document.createTextNode(child));
    else el.appendChild(child);
  });
  return el;
}

// Toasts
let toastContainer = null;

export function showToast(message, type = "info", duration = 2500) {
  if (!toastContainer) {
    toastContainer = createEl("div", { class: "toast-container" });
    document.body.appendChild(toastContainer);
  }
  const toast = createEl("div", { class: `toast ${type === "success" ? "success" : type === "error" ? "error" : ""}` }, [
    createEl("div", { class: "toast-message", text: message }),
    createEl(
      "button",
      { class: "toast-close", type: "button", "aria-label": "Close" },
      ["×"]
    ),
  ]);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

export function setActiveNav(currentPageId) {
  $all(".nav-item").forEach((btn) => {
    if (btn.dataset.page === currentPageId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

