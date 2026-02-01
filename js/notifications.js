import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl, showToast } from "./utils.js";

const session = requireAuth(); // any role can view notifications
if (session) {
  initShell("notifications");
  initNotificationsPage();
}

async function initNotificationsPage() {
  const form = $("#notificationForm");
  // Admin and faculty can broadcast; students only see inbox
  if (session.role === "admin" || session.role === "faculty") {
    form.addEventListener("submit", onNotificationSubmit);
  } else {
    form.classList.add("hidden");
  }
  await renderInbox();
}

async function getNotifications() {
  const res = await fetchAPI("/api/notifications", "GET");
  return res.data || [];
}

async function onNotificationSubmit(e) {
  e.preventDefault();
  const title = $("#notifTitle").value.trim();
  const audience = $("#notifAudience").value;
  const body = $("#notifBody").value.trim();

  if (!title || !body) {
    showToast("Title and message are required", "error");
    return;
  }

  const id = `N_${Date.now()}`;
  await fetchAPI("/api/notifications", "POST", {
    id,
    title,
    audience,
    body,
    createdAt: new Date().toISOString(),
  });

  showToast("Notification sent (demo only)", "success");
  $("#notificationForm").reset();
  await renderInbox();
}

async function renderInbox() {
  const list = await getNotifications();
  const inbox = $("#inboxList");
  inbox.innerHTML = "";

  const role = session.role;
  const forMe = list.filter(
    (n) =>
      n.audience === "all" ||
      (n.audience === "students" && role === "student") ||
      (n.audience === "faculty" && role === "faculty")
  );

  if (!forMe.length) {
    const li = createEl("li", {}, ["No notifications yet."]);
    inbox.appendChild(li);
    return;
  }

  forMe
    .slice()
    .reverse()
    .forEach((n) => {
      const li = createEl("li", {}, [
        createEl("strong", { text: n.title }),
        createEl("span", { class: "text-muted", text: ` (${n.audience})` }),
        document.createElement("br"),
        n.body,
      ]);
      inbox.appendChild(li);
    });
}

