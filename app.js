const SOP_GROUPS = [
  { key: "SOP1-VanPhong", tkey: "sop.1" },
  { key: "SOP2-TaiSan", tkey: "sop.2" },
  { key: "SOP3-VanThu", tkey: "sop.3" },
  { key: "SOP4-Xe", tkey: "sop.4" },
  { key: "SOP5-ATLD", tkey: "sop.5" },
  { key: "SOP6-NhanSu", tkey: "sop.6" },
  { key: "SOP7-LeTan", tkey: "sop.7" },
  { key: "SOP8-NCC", tkey: "sop.8" },
];
function sopName(key) {
  const g = SOP_GROUPS.find((g) => g.key === key);
  return g ? t(g.tkey) : key;
}

let api = null;
let currentUser = null;
let allIssues = [];
let allAssignees = [];

// ---------------- tabs ----------------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));
  if (tab === "dashboard") renderDashboard();
  if (tab === "tasks") renderTasks();
  if (tab === "forms") renderFormsTab();
}

// called by i18n.js whenever the language toggle changes
function onLangChange() {
  populateFilterOptions();
  renderDashboard();
  if (document.getElementById("tab-tasks").classList.contains("active")) renderTasks();
  if (document.getElementById("tab-forms").classList.contains("active")) renderFormsTab();
}

// ---------------- init / connection ----------------
function initApi() {
  const cfg = GitHubStore.getConfig();
  if (cfg.owner && cfg.repo && cfg.token) {
    api = new GitHubAPI(cfg.owner, cfg.repo, cfg.token);
    return true;
  }
  api = null;
  return false;
}

async function tryConnect(showAlert) {
  const statusEl = document.getElementById("connStatus");
  if (!initApi()) {
    statusEl.textContent = t("conn.none_goto_settings");
    return false;
  }
  statusEl.textContent = t("conn.connecting");
  try {
    const repoInfo = await api.testConnection();
    currentUser = repoInfo.owner ? repoInfo.owner.login : null;
    statusEl.textContent = t("conn.connected", { repo: repoInfo.full_name });
    await loadAll();
    return true;
  } catch (e) {
    statusEl.textContent = t("conn.error");
    if (showAlert) alert(t("alert.connectFail", { msg: e.message }));
    return false;
  }
}

async function loadAll() {
  try {
    [allIssues, allAssignees] = await Promise.all([api.listIssues({ state: "all" }), api.listAssignees()]);
  } catch (e) {
    console.error(e);
  }
  populateFilterOptions();
  renderDashboard();
  if (document.getElementById("tab-tasks").classList.contains("active")) renderTasks();
}

function populateFilterOptions() {
  const sopSel = document.getElementById("filterSop");
  sopSel.innerHTML = `<option value="">${t("tasks.filterAllSop")}</option>` + SOP_GROUPS.map((g) => `<option value="${g.key}">${sopName(g.key)}</option>`).join("");
  const asSel = document.getElementById("filterAssignee");
  asSel.innerHTML = `<option value="">${t("tasks.filterAllAssignee")}</option>` + allAssignees.map((a) => `<option value="${a.login}">${a.login}</option>`).join("");
}

// ---------------- dashboard ----------------
function renderDashboard() {
  const total = allIssues.length;
  const done = allIssues.filter((i) => i.state === "closed").length;
  const overdue = allIssues.filter((i) => taskStatus(i) === "overdue").length;
  const open = total - done;
  document.getElementById("statGrid").innerHTML = [
    [t("dash.stat.total"), total],
    [t("dash.stat.open"), open],
    [t("dash.stat.done"), done],
    [t("dash.stat.overdue"), overdue],
  ].map(([lbl, num]) => `<div class="stat-card"><div class="num">${num}</div><div class="lbl">${lbl}</div></div>`).join("");

  document.getElementById("sopGrid").innerHTML = SOP_GROUPS.map((g) => {
    const count = allIssues.filter((i) => i.labels.some((l) => (l.name || l) === g.key) && i.state === "open").length;
    return `<div class="sop-card"><div class="name">${sopName(g.key)}</div><div class="count">${count} ${t("dash.sopCount")}</div></div>`;
  }).join("");

  const dueSoon = allIssues
    .filter((i) => i.state === "open")
    .map((i) => ({ issue: i, ...parseIssueBody(i.body) }))
    .filter((x) => x.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 10);
  document.querySelector("#dueTable tbody").innerHTML = dueSoon.map((x) => taskRow(x.issue)).join("") || `<tr><td colspan="6" class="muted">${t("dash.noDue")}</td></tr>`;
}

// ---------------- tasks ----------------
function sopLabelOf(issue) {
  const l = issue.labels.find((l) => SOP_GROUPS.some((g) => g.key === (l.name || l)));
  return l ? (l.name || l) : "";
}
function statusBadge(issue) {
  const st = taskStatus(issue);
  if (st === "done") return `<span class="badge badge-done">${t("status.done")}</span>`;
  if (st === "overdue") return `<span class="badge badge-overdue">${t("status.overdue")}</span>`;
  return `<span class="badge badge-open">${t("status.open")}</span>`;
}
function taskRow(issue, withActions) {
  const { dueDate } = parseIssueBody(issue.body);
  const assignee = issue.assignees && issue.assignees.length ? issue.assignees.map((a) => a.login).join(", ") : "—";
  return `<tr>
    <td>#${issue.number}</td>
    <td><a href="${issue.html_url}" target="_blank" rel="noopener">${escapeHtml(issue.title)}</a></td>
    <td>${escapeHtml(sopName(sopLabelOf(issue)))}</td>
    <td>${escapeHtml(assignee)}</td>
    <td>${dueDate || "—"}</td>
    <td>${statusBadge(issue)}</td>
    ${withActions ? `<td>${issue.state === "open" ? `<button class="btn" onclick="markDone(${issue.number})">${t("tasks.markDone")}</button>` : `<button class="btn" onclick="reopenTask(${issue.number})">${t("tasks.reopen")}</button>`}</td>` : ""}
  </tr>`;
}

function renderTasks() {
  if (!api) { document.querySelector("#taskTable tbody").innerHTML = `<tr><td colspan="7" class="muted">${t("tasks.notConnected")}</td></tr>`; return; }
  const sopFilter = document.getElementById("filterSop").value;
  const assigneeFilter = document.getElementById("filterAssignee").value;
  const stateFilter = document.getElementById("filterState").value;
  let list = allIssues.slice();
  if (sopFilter) list = list.filter((i) => sopLabelOf(i) === sopFilter);
  if (assigneeFilter) list = list.filter((i) => (i.assignees || []).some((a) => a.login === assigneeFilter));
  if (stateFilter === "open") list = list.filter((i) => i.state === "open" && taskStatus(i) !== "overdue");
  if (stateFilter === "closed") list = list.filter((i) => i.state === "closed");
  if (stateFilter === "overdue") list = list.filter((i) => taskStatus(i) === "overdue");
  list.sort((a, b) => b.number - a.number);
  document.querySelector("#taskTable tbody").innerHTML = list.map((i) => taskRow(i, true)).join("") || `<tr><td colspan="7" class="muted">${t("tasks.empty")}</td></tr>`;
}
document.getElementById("btnApplyFilter").addEventListener("click", renderTasks);

async function markDone(number) {
  await api.updateIssue(number, { state: "closed" });
  await loadAll();
  renderTasks();
}
async function reopenTask(number) {
  await api.updateIssue(number, { state: "open" });
  await loadAll();
  renderTasks();
}

// ---- new task modal ----
document.getElementById("btnNewTask").addEventListener("click", openNewTaskModal);
function openNewTaskModal() {
  if (!api) { alert(t("alert.needConnect")); return; }
  const root = document.getElementById("modalRoot");
  root.innerHTML = `
  <div class="modal-backdrop" id="backdrop">
    <div class="modal">
      <h2>${t("modal.newTask.title")}</h2>
      <div class="form-fields">
        <label class="full">${t("modal.newTask.taskTitle")}
          <input id="ntTitle" type="text" required />
        </label>
        <label>${t("modal.newTask.sop")}
          <select id="ntSop">${SOP_GROUPS.map((g) => `<option value="${g.key}">${sopName(g.key)}</option>`).join("")}</select>
        </label>
        <label>${t("modal.newTask.assignee")}
          <select id="ntAssignee">
            <option value="">${t("modal.newTask.noAssignee")}</option>
            ${allAssignees.map((a) => `<option value="${a.login}">${a.login}</option>`).join("")}
          </select>
        </label>
        <label>${t("modal.newTask.due")}
          <input id="ntDue" type="date" />
        </label>
        <label class="full">${t("modal.newTask.desc")}
          <textarea id="ntDesc" rows="3"></textarea>
        </label>
      </div>
      <div class="modal-actions">
        <button class="btn" id="ntCancel">${t("modal.cancel")}</button>
        <button class="btn btn-primary" id="ntSubmit">${t("modal.newTask.submit")}</button>
      </div>
    </div>
  </div>`;
  document.getElementById("ntCancel").onclick = () => (root.innerHTML = "");
  document.getElementById("backdrop").addEventListener("click", (e) => { if (e.target.id === "backdrop") root.innerHTML = ""; });
  document.getElementById("ntSubmit").onclick = async () => {
    const title = document.getElementById("ntTitle").value.trim();
    if (!title) { alert(t("alert.needTitle")); return; }
    const sop = document.getElementById("ntSop").value;
    const assignee = document.getElementById("ntAssignee").value;
    const due = document.getElementById("ntDue").value;
    const desc = document.getElementById("ntDesc").value.trim();
    const body = buildIssueBody({ description: desc, dueDate: due, assignedBy: currentUser });
    try {
      await api.createIssue({ title, body, labels: [sop], assignees: assignee ? [assignee] : [] });
      root.innerHTML = "";
      await loadAll();
      renderTasks();
    } catch (e) {
      alert(t("alert.createFail", { msg: e.message }));
    }
  };
}

// ---------------- forms tab ----------------
function renderFormsTab() {
  const sel = document.getElementById("formType");
  const prevVal = sel.value;
  sel.innerHTML = FORM_DEFS.map((f) => `<option value="${f.id}">${formLabel(f)}</option>`).join("");
  if (prevVal) sel.value = prevVal;
  sel.onchange = renderFormFields;
  const prefillSel = document.getElementById("formPrefillTask");
  prefillSel.innerHTML = `<option value="">${t("forms.noPrefill")}</option>` + allIssues.filter((i) => i.state === "open").map((i) => `<option value="${i.number}">#${i.number} ${escapeHtml(i.title)}</option>`).join("");
  renderFormFields();
}
function formLabel(def) {
  return getLang() === "en" && def.labelEn ? def.labelEn : def.label;
}
function fieldLabel(f) {
  return getLang() === "en" && f.labelEn ? f.labelEn : f.label;
}

function renderFormFields() {
  const def = FORM_DEFS.find((f) => f.id === document.getElementById("formType").value) || FORM_DEFS[0];
  const container = document.getElementById("formFieldsContainer");
  container.innerHTML = def.fields.map((f) => {
    const fullCls = f.full ? "full" : "";
    const lbl = fieldLabel(f);
    if (f.type === "textarea") return `<label class="${fullCls}">${lbl}<textarea id="ff_${f.key}" rows="3"></textarea></label>`;
    if (f.type === "select") return `<label class="${fullCls}">${lbl}<select id="ff_${f.key}">${f.options.map((o) => `<option>${o}</option>`).join("")}</select></label>`;
    return `<label class="${fullCls}">${lbl}<input id="ff_${f.key}" type="${f.type === "date" ? "date" : "text"}" placeholder="${f.placeholder || ""}" /></label>`;
  }).join("");
}

document.getElementById("formPrefillTask").addEventListener("change", (e) => {
  const num = e.target.value;
  if (!num) return;
  const issue = allIssues.find((i) => String(i.number) === num);
  if (!issue) return;
  const { description, dueDate } = parseIssueBody(issue.body);
  const guesses = { requester: currentUser, employee: currentUser, reason: description, purpose: description, issue: description, content: description, itemName: issue.title, topic: issue.title, fromDate: dueDate, toDate: dueDate };
  Object.entries(guesses).forEach(([k, v]) => {
    const el = document.getElementById("ff_" + k);
    if (el && v) el.value = v;
  });
});

document.getElementById("btnGenerateForm").addEventListener("click", () => {
  const def = FORM_DEFS.find((f) => f.id === document.getElementById("formType").value);
  const data = {};
  let missing = [];
  def.fields.forEach((f) => {
    const el = document.getElementById("ff_" + f.key);
    data[f.key] = el ? el.value : "";
    if (f.required && !data[f.key]) missing.push(fieldLabel(f));
  });
  if (missing.length) { alert(t("alert.missingFields", { fields: missing.join(", ") })); return; }
  const cfg = GitHubStore.getConfig();
  def.generate(data, { company: cfg.company || "", formCode: "" });
});

// ---------------- settings ----------------
function loadSettingsForm() {
  const cfg = GitHubStore.getConfig();
  document.getElementById("cfgCompany").value = cfg.company || "";
  document.getElementById("cfgOwner").value = cfg.owner || "";
  document.getElementById("cfgRepo").value = cfg.repo || "";
  document.getElementById("cfgToken").value = cfg.token || "";
}
document.getElementById("settingsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const cfg = {
    company: document.getElementById("cfgCompany").value.trim(),
    owner: document.getElementById("cfgOwner").value.trim(),
    repo: document.getElementById("cfgRepo").value.trim(),
    token: document.getElementById("cfgToken").value.trim(),
  };
  GitHubStore.saveConfig(cfg);
  await tryConnect(true);
});
document.getElementById("btnTestConn").addEventListener("click", async () => {
  const cfg = {
    company: document.getElementById("cfgCompany").value.trim(),
    owner: document.getElementById("cfgOwner").value.trim(),
    repo: document.getElementById("cfgRepo").value.trim(),
    token: document.getElementById("cfgToken").value.trim(),
  };
  GitHubStore.saveConfig(cfg);
  const ok = await tryConnect(true);
  if (ok) alert(t("alert.connectOk"));
});
document.getElementById("btnClearToken").addEventListener("click", () => {
  if (!confirm(t("alert.confirmClearToken"))) return;
  GitHubStore.clearToken();
  document.getElementById("cfgToken").value = "";
  api = null;
  document.getElementById("connStatus").textContent = t("conn.none");
});
document.getElementById("btnRefreshDash").addEventListener("click", loadAll);

// ---------------- boot ----------------
(function boot() {
  applyStaticTranslations();
  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === getLang()));
  loadSettingsForm();
  renderDashboard();
  tryConnect(false);
})();
