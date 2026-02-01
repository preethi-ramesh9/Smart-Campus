import { requireAuth } from "./auth.js";
import { initShell } from "./app.js";
import { fetchAPI } from "./api.js";
import { $, createEl } from "./utils.js";

const session = requireAuth(["student"]);
if (session) {
  initShell("materials");
  initMaterialsPage();
}

async function initMaterialsPage() {
  await renderMaterials();
}

async function renderMaterials() {
  const res = await fetchAPI("/api/notifications", "GET");
  const list = res.data || [];
  const ul = $("#materialsList");
  ul.innerHTML = "";

  // Treat notifications targeted to students or all as "materials & notes"
  const materials = list.filter(
    (n) =>
      n.audience === "students" ||
      n.audience === "all"
  );

  if (!materials.length) {
    const li = createEl("li", {}, ["No materials have been posted yet."]);
    ul.appendChild(li);
    return;
  }

  materials
    .slice()
    .reverse()
    .forEach((m) => {
      const li = createEl("li", {}, [
        createEl("strong", { text: m.title }),
        createEl("span", { class: "text-muted", text: m.createdAt ? ` — ${new Date(m.createdAt).toLocaleString()}` : "" }),
        document.createElement("br"),
        m.body,
      ]);
      ul.appendChild(li);
    });
}

