/**
 * Xuất biểu mẫu Word (.doc) / Excel (.xls) theo thể thức hành chính Việt Nam.
 * Kỹ thuật: HTML được Word/Excel nhận diện qua namespace "mso" — không cần thư viện ngoài,
 * chạy được 100% trên trình duyệt / GitHub Pages tĩnh.
 */

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function nl2br(s) {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

function downloadBlob(filename, mime, content) {
  const blob = new Blob(["﻿" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function downloadDoc(filename, bodyHtml) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Document</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
  @page { size: 21cm 29.7cm; margin: 2cm 2cm 2cm 2.5cm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.35; }
  table { border-collapse: collapse; width: 100%; }
  td, th { padding: 4px 6px; vertical-align: top; }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .small { font-size: 11pt; }
  .qh { font-weight: bold; font-size: 13pt; text-align:center; }
  .title { font-weight: bold; font-size: 16pt; text-align: center; text-transform: uppercase; margin: 18px 0 6px; }
  .sig-table td { text-align: center; width: 33%; }
</style>
</head>
<body>${bodyHtml}</body></html>`;
  downloadBlob(filename, "application/msword", html);
}

function downloadXls(filename, sheetName, bodyHtml) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>${escapeHtml(sheetName)}</x:Name>
<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
  table { border-collapse: collapse; }
  td, th { border: 1px solid #999; padding: 4px 8px; }
  th { background: #2f6fa5; color: #fff; }
  .title { font-weight: bold; font-size: 14pt; }
  .center { text-align: center; }
</style>
</head>
<body>${bodyHtml}</body></html>`;
  downloadBlob(filename, "application/vnd.ms-excel", html);
}

function vnHeader(companyName, formCode) {
  return `
  <table style="border:none;">
    <tr>
      <td style="border:none; width:50%;">
        <div class="bold">${escapeHtml(companyName || "[TÊN CÔNG TY]")}</div>
        <div class="small">Số: ${escapeHtml(formCode || "..........")}</div>
      </td>
      <td style="border:none; width:50%; text-align:center;">
        <div class="qh">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="bold">Độc lập - Tự do - Hạnh phúc</div>
        <div class="small italic">-----------------</div>
      </td>
    </tr>
  </table>`;
}

function vnDateLine(city) {
  const d = new Date();
  return `<p class="right italic">${escapeHtml(city || "......")}, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}</p>`;
}

function signatureBlock(roles) {
  const tds = roles.map((r) => `<td><div class="bold">${escapeHtml(r)}</div><div class="italic small">(Ký, ghi rõ họ tên)</div><br/><br/><br/></td>`).join("");
  return `<table class="sig-table" style="margin-top:24px;"><tr>${tds}</tr></table>`;
}

function fieldLine(label, value, unit) {
  return `<p><span class="bold">${escapeHtml(label)}:</span> ${escapeHtml(value)}${unit ? " " + escapeHtml(unit) : ""}</p>`;
}

// ---------------------------------------------------------------------------
// FORM DEFINITIONS
// ---------------------------------------------------------------------------
const FORM_DEFS = [
  {
    id: "purchase_request",
    label: "Phiếu đề nghị mua sắm (SOP #2)",
    labelEn: "Purchase Request Form (SOP #2)",
    kind: "doc",
    fields: [
      { key: "department", label: "Phòng ban đề nghị", labelEn: "Requesting department", type: "text", required: true },
      { key: "requester", label: "Người đề nghị", labelEn: "Requester", type: "text", required: true },
      { key: "itemName", label: "Tên hàng hoá / dịch vụ", labelEn: "Item / service name", type: "text", required: true },
      { key: "quantity", label: "Số lượng", labelEn: "Quantity", type: "text" },
      { key: "estCost", label: "Chi phí dự kiến (VNĐ)", labelEn: "Estimated cost (VND)", type: "text" },
      { key: "reason", label: "Lý do đề nghị", labelEn: "Reason", type: "textarea", full: true },
    ],
    generate(d, ctx) {
      const body = `
        ${vnHeader(ctx.company, ctx.formCode)}
        <div class="title">Phiếu đề nghị mua sắm</div>
        ${fieldLine("Phòng ban đề nghị", d.department)}
        ${fieldLine("Người đề nghị", d.requester)}
        ${fieldLine("Tên hàng hoá / dịch vụ", d.itemName)}
        ${fieldLine("Số lượng", d.quantity)}
        ${fieldLine("Chi phí dự kiến", d.estCost, "VNĐ")}
        <p class="bold">Lý do đề nghị:</p>
        <p>${nl2br(d.reason)}</p>
        ${vnDateLine()}
        ${signatureBlock(["Người đề nghị", "Trưởng phòng liên quan", "Trưởng phòng Hành chính"])}
      `;
      downloadDoc(`PhieuDeNghiMuaSam_${dstamp()}.doc`, body);
    },
  },
  {
    id: "repair_request",
    label: "Phiếu yêu cầu sửa chữa (SOP #1)",
    labelEn: "Repair Request Form (SOP #1)",
    kind: "doc",
    fields: [
      { key: "location", label: "Vị trí / khu vực", labelEn: "Location / area", type: "text", required: true },
      { key: "requester", label: "Người báo hỏng", labelEn: "Reported by", type: "text", required: true },
      { key: "issue", label: "Mô tả sự cố / hư hỏng", labelEn: "Issue description", type: "textarea", full: true, required: true },
      { key: "priority", label: "Mức ưu tiên", labelEn: "Priority", type: "select", options: ["Bình thường", "Khẩn cấp"] },
    ],
    generate(d, ctx) {
      const body = `
        ${vnHeader(ctx.company, ctx.formCode)}
        <div class="title">Phiếu yêu cầu sửa chữa</div>
        ${fieldLine("Vị trí / khu vực", d.location)}
        ${fieldLine("Người báo hỏng", d.requester)}
        ${fieldLine("Mức ưu tiên", d.priority)}
        <p class="bold">Mô tả sự cố / hư hỏng:</p>
        <p>${nl2br(d.issue)}</p>
        ${vnDateLine()}
        ${signatureBlock(["Người báo hỏng", "Nhân viên Hành chính", "Trưởng phòng Hành chính"])}
      `;
      downloadDoc(`PhieuYeuCauSuaChua_${dstamp()}.doc`, body);
    },
  },
  {
    id: "travel_request",
    label: "Đề nghị đi công tác (SOP #4)",
    labelEn: "Business Travel Request (SOP #4)",
    kind: "doc",
    fields: [
      { key: "employee", label: "Họ tên nhân viên", labelEn: "Employee name", type: "text", required: true },
      { key: "destination", label: "Nơi công tác", labelEn: "Destination", type: "text", required: true },
      { key: "fromDate", label: "Từ ngày", labelEn: "From date", type: "date", required: true },
      { key: "toDate", label: "Đến ngày", labelEn: "To date", type: "date", required: true },
      { key: "purpose", label: "Mục đích công tác", labelEn: "Purpose", type: "textarea", full: true },
      { key: "budget", label: "Ngân sách dự kiến (VNĐ)", labelEn: "Estimated budget (VND)", type: "text" },
    ],
    generate(d, ctx) {
      const body = `
        ${vnHeader(ctx.company, ctx.formCode)}
        <div class="title">Đề nghị đi công tác</div>
        ${fieldLine("Họ tên nhân viên", d.employee)}
        ${fieldLine("Nơi công tác", d.destination)}
        ${fieldLine("Thời gian", `${d.fromDate || "..."} đến ${d.toDate || "..."}`)}
        ${fieldLine("Ngân sách dự kiến", d.budget, "VNĐ")}
        <p class="bold">Mục đích công tác:</p>
        <p>${nl2br(d.purpose)}</p>
        ${vnDateLine()}
        ${signatureBlock(["Người đề nghị", "Quản lý trực tiếp", "Trưởng phòng Hành chính"])}
      `;
      downloadDoc(`DeNghiCongTac_${dstamp()}.doc`, body);
    },
  },
  {
    id: "advance_request",
    label: "Giấy đề nghị tạm ứng",
    labelEn: "Cash Advance Request",
    kind: "doc",
    fields: [
      { key: "employee", label: "Họ tên người đề nghị", labelEn: "Requester name", type: "text", required: true },
      { key: "department", label: "Bộ phận", labelEn: "Department", type: "text" },
      { key: "amount", label: "Số tiền đề nghị tạm ứng (VNĐ)", labelEn: "Advance amount (VND)", type: "text", required: true },
      { key: "amountWords", label: "Số tiền bằng chữ", labelEn: "Amount in words", type: "text" },
      { key: "reason", label: "Lý do tạm ứng", labelEn: "Reason", type: "textarea", full: true },
    ],
    generate(d, ctx) {
      const body = `
        ${vnHeader(ctx.company, ctx.formCode)}
        <div class="title">Giấy đề nghị tạm ứng</div>
        ${fieldLine("Họ tên người đề nghị", d.employee)}
        ${fieldLine("Bộ phận", d.department)}
        ${fieldLine("Số tiền đề nghị tạm ứng", d.amount, "VNĐ")}
        ${fieldLine("Số tiền bằng chữ", d.amountWords)}
        <p class="bold">Lý do tạm ứng:</p>
        <p>${nl2br(d.reason)}</p>
        ${vnDateLine()}
        ${signatureBlock(["Người đề nghị", "Kế toán", "Trưởng phòng Hành chính / Giám đốc"])}
      `;
      downloadDoc(`GiayDeNghiTamUng_${dstamp()}.doc`, body);
    },
  },
  {
    id: "handover_minutes",
    label: "Biên bản bàn giao",
    labelEn: "Handover Minutes",
    kind: "doc",
    fields: [
      { key: "partyA", label: "Bên giao", labelEn: "Handing-over party", type: "text", required: true },
      { key: "partyB", label: "Bên nhận", labelEn: "Receiving party", type: "text", required: true },
      { key: "content", label: "Nội dung bàn giao", labelEn: "Handover content", type: "textarea", full: true, required: true },
      { key: "location", label: "Địa điểm bàn giao", labelEn: "Location", type: "text" },
    ],
    generate(d, ctx) {
      const body = `
        ${vnHeader(ctx.company, ctx.formCode)}
        <div class="title">Biên bản bàn giao</div>
        ${fieldLine("Bên giao", d.partyA)}
        ${fieldLine("Bên nhận", d.partyB)}
        ${fieldLine("Địa điểm", d.location)}
        <p class="bold">Nội dung bàn giao:</p>
        <p>${nl2br(d.content)}</p>
        <p>Hai bên xác nhận đã bàn giao đầy đủ nội dung nêu trên.</p>
        ${vnDateLine()}
        ${signatureBlock(["Bên giao", "Bên nhận", "Trưởng phòng Hành chính (chứng kiến)"])}
      `;
      downloadDoc(`BienBanBanGiao_${dstamp()}.doc`, body);
    },
  },
  {
    id: "meeting_minutes",
    label: "Biên bản họp / làm việc",
    labelEn: "Meeting Minutes",
    kind: "doc",
    fields: [
      { key: "topic", label: "Nội dung cuộc họp", labelEn: "Meeting topic", type: "text", required: true },
      { key: "attendees", label: "Thành phần tham dự", labelEn: "Attendees", type: "textarea", full: true },
      { key: "content", label: "Nội dung / Kết luận", labelEn: "Content / Conclusion", type: "textarea", full: true, required: true },
    ],
    generate(d, ctx) {
      const body = `
        ${vnHeader(ctx.company, ctx.formCode)}
        <div class="title">Biên bản họp</div>
        ${fieldLine("Nội dung cuộc họp", d.topic)}
        <p class="bold">Thành phần tham dự:</p>
        <p>${nl2br(d.attendees)}</p>
        <p class="bold">Nội dung / Kết luận:</p>
        <p>${nl2br(d.content)}</p>
        ${vnDateLine()}
        ${signatureBlock(["Người ghi biên bản", "Chủ trì cuộc họp"])}
      `;
      downloadDoc(`BienBanHop_${dstamp()}.doc`, body);
    },
  },
  {
    id: "timekeeping_sheet",
    label: "Bảng chấm công tháng (Excel)",
    labelEn: "Monthly Timekeeping Sheet (Excel)",
    kind: "xls",
    fields: [
      { key: "employee", label: "Họ tên nhân viên", labelEn: "Employee name", type: "text", required: true },
      { key: "department", label: "Bộ phận", labelEn: "Department", type: "text" },
      { key: "month", label: "Tháng", labelEn: "Month", type: "text", placeholder: "vd: 08/2026", required: true },
    ],
    generate(d, ctx) {
      const [mm, yyyy] = (d.month || "").split("/");
      const daysInMonth = mm && yyyy ? new Date(Number(yyyy), Number(mm), 0).getDate() : 31;
      let dayHeaders = "", dayCells = "";
      for (let i = 1; i <= daysInMonth; i++) { dayHeaders += `<th>${i}</th>`; dayCells += `<td></td>`; }
      const body = `
        <p class="title">${escapeHtml(ctx.company)}</p>
        <p class="title">BẢNG CHẤM CÔNG THÁNG ${escapeHtml(d.month || "")}</p>
        <p>Họ tên: <b>${escapeHtml(d.employee)}</b> &nbsp;&nbsp; Bộ phận: <b>${escapeHtml(d.department)}</b></p>
        <table>
          <tr><th>Ngày</th>${dayHeaders}<th>Tổng công</th></tr>
          <tr><td>Ký hiệu</td>${dayCells}<td></td></tr>
        </table>
        <p class="small">Ký hiệu: X = đi làm, P = nghỉ phép, K = nghỉ không lương, L = nghỉ lễ, CT = công tác</p>
      `;
      downloadXls(`BangChamCong_${(d.employee || "").replace(/\s+/g, "")}_${dstamp()}.xls`, "ChamCong", body);
    },
  },
  {
    id: "inventory_count",
    label: "Biên bản kiểm kê tài sản (Excel)",
    labelEn: "Asset Inventory Count Sheet (Excel)",
    kind: "xls",
    fields: [
      { key: "team", label: "Tổ kiểm kê", labelEn: "Inventory team", type: "text" },
      { key: "department", label: "Bộ phận / khu vực", labelEn: "Department / area", type: "text", required: true },
      { key: "items", label: "Danh sách tài sản (mỗi dòng: Tên, Mã, SL sổ sách, SL thực tế)", labelEn: "Asset list (one per line: Name, Code, Book qty, Actual qty)", type: "textarea", full: true },
    ],
    generate(d, ctx) {
      const rows = (d.items || "").split("\n").filter((l) => l.trim()).map((line) => {
        const parts = line.split(",").map((s) => s.trim());
        return `<tr>${[0, 1, 2, 3].map((i) => `<td>${escapeHtml(parts[i] || "")}</td>`).join("")}<td></td></tr>`;
      }).join("");
      const body = `
        <p class="title">${escapeHtml(ctx.company)}</p>
        <p class="title">BIÊN BẢN KIỂM KÊ TÀI SẢN</p>
        <p>Tổ kiểm kê: <b>${escapeHtml(d.team)}</b> &nbsp;&nbsp; Bộ phận / khu vực: <b>${escapeHtml(d.department)}</b></p>
        <table>
          <tr><th>Tên tài sản</th><th>Mã tài sản</th><th>SL sổ sách</th><th>SL thực tế</th><th>Chênh lệch / Ghi chú</th></tr>
          ${rows}
        </table>
      `;
      downloadXls(`BienBanKiemKe_${dstamp()}.xls`, "KiemKe", body);
    },
  },
];

function dstamp() {
  return new Date().toISOString().slice(0, 10);
}
