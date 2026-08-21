/**
 * i18n — giao diện song ngữ Việt / Anh (Vietnamese / English UI).
 * Biểu mẫu Word/Excel xuất ra KHÔNG bị ảnh hưởng — luôn giữ nguyên tiếng Việt
 * theo đúng thể thức hành chính Việt Nam.
 */
const I18N = {
  vi: {
    "brand.subtitle": "Quản lý công việc Hành chính",
    "nav.dashboard": "Bảng điều khiển",
    "nav.tasks": "Công việc",
    "nav.forms": "Biểu mẫu",
    "nav.settings": "Cài đặt",

    "conn.none": "⚪ Chưa kết nối",
    "conn.none_goto_settings": "⚪ Chưa kết nối — vào Cài đặt",
    "conn.connecting": "🟡 Đang kết nối...",
    "conn.connected": "🟢 Đã kết nối: {repo}",
    "conn.error": "🔴 Lỗi kết nối",

    "dash.title": "Bảng điều khiển",
    "dash.refresh": "🔄 Làm mới",
    "dash.bySop": "Theo nhóm quy trình (SOP)",
    "dash.dueSoon": "Sắp đến hạn / Quá hạn",
    "dash.noDue": "Không có công việc nào có hạn.",
    "dash.stat.total": "Tổng công việc",
    "dash.stat.open": "Đang xử lý",
    "dash.stat.done": "Hoàn thành",
    "dash.stat.overdue": "Quá hạn",
    "dash.sopCount": "việc đang xử lý",

    "col.no": "#",
    "col.title": "Tiêu đề",
    "col.group": "Nhóm",
    "col.assignee": "Người phụ trách",
    "col.due": "Hạn",
    "col.status": "Trạng thái",
    "col.action": "Thao tác",

    "tasks.title": "Công việc (đồng bộ qua GitHub Issues)",
    "tasks.newBtn": "+ Giao việc mới",
    "tasks.filterAllSop": "Tất cả nhóm SOP",
    "tasks.filterAllAssignee": "Tất cả người phụ trách",
    "tasks.filterAllState": "Tất cả trạng thái",
    "tasks.filterOpen": "Đang xử lý",
    "tasks.filterClosed": "Hoàn thành",
    "tasks.filterOverdue": "Quá hạn",
    "tasks.filterBtn": "Lọc",
    "tasks.notConnected": "Chưa kết nối GitHub — vào tab Cài đặt.",
    "tasks.empty": "Không có công việc phù hợp.",
    "tasks.markDone": "✅ Hoàn thành",
    "tasks.reopen": "↩️ Mở lại",

    "status.done": "Hoàn thành",
    "status.overdue": "Quá hạn",
    "status.open": "Đang xử lý",

    "modal.newTask.title": "Giao việc mới",
    "modal.newTask.taskTitle": "Tiêu đề công việc",
    "modal.newTask.sop": "Nhóm SOP",
    "modal.newTask.assignee": "Người phụ trách",
    "modal.newTask.noAssignee": "— Không gán —",
    "modal.newTask.due": "Hạn hoàn thành",
    "modal.newTask.desc": "Mô tả",
    "modal.cancel": "Huỷ",
    "modal.newTask.submit": "Tạo công việc",

    "forms.title": "Xuất biểu mẫu Word / Excel",
    "forms.desc": "Biểu mẫu theo thể thức hành chính Việt Nam (quốc hiệu tiêu ngữ, chữ ký 3 bên). Có thể nạp nhanh dữ liệu từ 1 công việc đã tạo. Nội dung biểu mẫu luôn bằng tiếng Việt theo quy định.",
    "forms.typeLabel": "Loại biểu mẫu",
    "forms.prefillLabel": "Nạp dữ liệu từ công việc (tuỳ chọn)",
    "forms.noPrefill": "— Không nạp —",
    "forms.download": "⬇️ Tải xuống",

    "settings.title": "Cài đặt kết nối GitHub",
    "settings.desc": "Dữ liệu công việc được lưu dưới dạng GitHub Issues trên repo của công ty. Mỗi người dùng tự nhập Access Token của mình — token chỉ lưu trong trình duyệt của bạn (localStorage), không gửi đi đâu khác ngoài api.github.com.",
    "settings.company": "Tên công ty (hiển thị trên biểu mẫu)",
    "settings.owner": "Chủ repo (owner)",
    "settings.repo": "Tên repo",
    "settings.token": "Personal Access Token (fine-grained, quyền Issues: Read & Write)",
    "settings.save": "💾 Lưu & Kết nối",
    "settings.test": "🔌 Kiểm tra kết nối",
    "settings.clear": "🗑️ Xoá token khỏi trình duyệt",
    "settings.help.summary": "Hướng dẫn tạo Personal Access Token (1 lần)",
    "settings.help.1": "Vào GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token.",
    "settings.help.2": "Repository access: chọn đúng repo này (không chọn \"All repositories\").",
    "settings.help.3": "Permissions → Issues: chọn \"Read and write\". (Không cần quyền nào khác.)",
    "settings.help.4": "Tạo token, copy và dán vào ô trên. Token chỉ hoạt động cho riêng repo này.",

    "alert.connectFail": "Không kết nối được GitHub:\n{msg}",
    "alert.connectOk": "Kết nối thành công!",
    "alert.confirmClearToken": "Xoá token khỏi trình duyệt này?",
    "alert.needConnect": "Vui lòng kết nối GitHub ở tab Cài đặt trước.",
    "alert.needTitle": "Vui lòng nhập tiêu đề.",
    "alert.createFail": "Không tạo được công việc:\n{msg}",
    "alert.missingFields": "Vui lòng nhập: {fields}",

    "sop.1": "SOP #1 — Văn phòng & Cơ sở vật chất",
    "sop.2": "SOP #2 — Tài sản & Mua sắm",
    "sop.3": "SOP #3 — Văn thư, Con dấu & Lưu trữ",
    "sop.4": "SOP #4 — Xe đưa đón & Công tác",
    "sop.5": "SOP #5 — An toàn Lao động & PCCC",
    "sop.6": "SOP #6 — Phối hợp Hành chính - Nhân sự",
    "sop.7": "SOP #7 — Lễ tân & Sự kiện",
    "sop.8": "SOP #8 — Nhà cung cấp, Ngân sách & Báo cáo",
  },
  en: {
    "brand.subtitle": "Administrative Work Management",
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Tasks",
    "nav.forms": "Forms",
    "nav.settings": "Settings",

    "conn.none": "⚪ Not connected",
    "conn.none_goto_settings": "⚪ Not connected — go to Settings",
    "conn.connecting": "🟡 Connecting...",
    "conn.connected": "🟢 Connected: {repo}",
    "conn.error": "🔴 Connection error",

    "dash.title": "Dashboard",
    "dash.refresh": "🔄 Refresh",
    "dash.bySop": "By Process Group (SOP)",
    "dash.dueSoon": "Due Soon / Overdue",
    "dash.noDue": "No tasks with a due date.",
    "dash.stat.total": "Total Tasks",
    "dash.stat.open": "In Progress",
    "dash.stat.done": "Completed",
    "dash.stat.overdue": "Overdue",
    "dash.sopCount": "task(s) in progress",

    "col.no": "#",
    "col.title": "Title",
    "col.group": "Group",
    "col.assignee": "Assignee",
    "col.due": "Due",
    "col.status": "Status",
    "col.action": "Action",

    "tasks.title": "Tasks (synced via GitHub Issues)",
    "tasks.newBtn": "+ New Task",
    "tasks.filterAllSop": "All SOP groups",
    "tasks.filterAllAssignee": "All assignees",
    "tasks.filterAllState": "All statuses",
    "tasks.filterOpen": "In progress",
    "tasks.filterClosed": "Completed",
    "tasks.filterOverdue": "Overdue",
    "tasks.filterBtn": "Filter",
    "tasks.notConnected": "Not connected to GitHub — go to the Settings tab.",
    "tasks.empty": "No matching tasks.",
    "tasks.markDone": "✅ Complete",
    "tasks.reopen": "↩️ Reopen",

    "status.done": "Completed",
    "status.overdue": "Overdue",
    "status.open": "In progress",

    "modal.newTask.title": "New Task",
    "modal.newTask.taskTitle": "Task title",
    "modal.newTask.sop": "SOP group",
    "modal.newTask.assignee": "Assignee",
    "modal.newTask.noAssignee": "— Unassigned —",
    "modal.newTask.due": "Due date",
    "modal.newTask.desc": "Description",
    "modal.cancel": "Cancel",
    "modal.newTask.submit": "Create Task",

    "forms.title": "Export Word / Excel Forms",
    "forms.desc": "Forms follow Vietnamese administrative format (national header, 3-party signatures). You can quick-fill from an existing task. Form content always stays in Vietnamese as required by regulation.",
    "forms.typeLabel": "Form type",
    "forms.prefillLabel": "Prefill from a task (optional)",
    "forms.noPrefill": "— None —",
    "forms.download": "⬇️ Download",

    "settings.title": "GitHub Connection Settings",
    "settings.desc": "Task data is stored as GitHub Issues on the company's repo. Each user enters their own Access Token — it is only stored in your own browser (localStorage) and never sent anywhere except api.github.com.",
    "settings.company": "Company name (shown on forms)",
    "settings.owner": "Repo owner",
    "settings.repo": "Repo name",
    "settings.token": "Personal Access Token (fine-grained, Issues: Read & Write)",
    "settings.save": "💾 Save & Connect",
    "settings.test": "🔌 Test Connection",
    "settings.clear": "🗑️ Remove token from this browser",
    "settings.help.summary": "How to create a Personal Access Token (one-time)",
    "settings.help.1": "Go to GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token.",
    "settings.help.2": "Repository access: select this exact repo (not \"All repositories\").",
    "settings.help.3": "Permissions → Issues: set to \"Read and write\". (No other permission needed.)",
    "settings.help.4": "Generate the token, copy it, and paste it above. It only works for this repo.",

    "alert.connectFail": "Could not connect to GitHub:\n{msg}",
    "alert.connectOk": "Connected successfully!",
    "alert.confirmClearToken": "Remove the token from this browser?",
    "alert.needConnect": "Please connect to GitHub in the Settings tab first.",
    "alert.needTitle": "Please enter a title.",
    "alert.createFail": "Could not create the task:\n{msg}",
    "alert.missingFields": "Please fill in: {fields}",

    "sop.1": "SOP #1 — Office & Facility Management",
    "sop.2": "SOP #2 — Asset Management & Procurement",
    "sop.3": "SOP #3 — Document Control, Seal & Records",
    "sop.4": "SOP #4 — Vehicle Management & Business Travel",
    "sop.5": "SOP #5 — Workplace Safety & Fire Prevention",
    "sop.6": "SOP #6 — Admin-HR Coordination",
    "sop.7": "SOP #7 — Reception & Events",
    "sop.8": "SOP #8 — Vendor, Budget & Reporting",
  },
};

const LANG_KEY = "adminops_lang";

function getLang() {
  return localStorage.getItem(LANG_KEY) || "vi";
}
function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyStaticTranslations();
  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
  if (typeof onLangChange === "function") onLangChange();
}
function t(key, vars) {
  const dict = I18N[getLang()] || I18N.vi;
  let s = dict[key] ?? I18N.vi[key] ?? key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
  return s;
}
function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.title = getLang() === "en" ? "AdminOps — Administrative Work Management" : "AdminOps — Quản lý Công việc Hành chính";
}
document.addEventListener("DOMContentLoaded", applyStaticTranslations);
