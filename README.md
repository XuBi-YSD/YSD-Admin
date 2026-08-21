# AdminOps — Quản lý Công việc & Biểu mẫu Hành chính

App tĩnh (không backend, không cần cài đặt), chạy trực tiếp trên GitHub Pages, dùng để:

1. **Giao việc & theo dõi tiến độ** cho 8 nhóm quy trình của Trưởng phòng Hành chính (xem bộ SOP đầy đủ đi kèm) — dữ liệu lưu dưới dạng **GitHub Issues** của repo này, nên nhiều người (Trưởng phòng + nhân viên) đều thấy và cập nhật được, miễn là có quyền truy cập repo.
2. **Xuất nhanh biểu mẫu Word (.doc) / Excel (.xls)** theo đúng thể thức hành chính Việt Nam (quốc hiệu tiêu ngữ, chữ ký các bên) — chạy hoàn toàn trong trình duyệt, không cần thư viện ngoài, không cần internet sau khi tải trang xong.
3. **Danh mục dùng chung (Droplist)**: Nhân sự, Công ty, Đối tác, Dự án — chọn nhanh khi điền biểu mẫu thay vì gõ tay, dùng chung cho mọi người qua repo.
4. **Lịch sử xuất biểu mẫu**: ghi lại ai xuất file gì, khi nào — dùng chung qua repo.

Giao diện hỗ trợ song ngữ **VI / EN** (nút chuyển ở góc trên bên phải). Nội dung biểu mẫu Word/Excel xuất ra luôn giữ nguyên **tiếng Việt** dù đang chọn giao diện tiếng Anh, vì đây là văn bản hành chính phải tuân theo thể thức quy định của Việt Nam.

## Cách dùng nhanh

### Bước 1 — Thêm người dùng vào repo
Vào Settings → Collaborators của repo GitHub này, mời từng nhân viên cần được giao việc (họ cần tài khoản GitHub, miễn phí).

### Bước 2 — Mỗi người tự tạo Access Token (1 lần, riêng cho từng người)
1. GitHub → Settings (cá nhân) → Developer settings → Fine-grained tokens → Generate new token.
2. Repository access: chọn **đúng repo này** (không chọn "All repositories").
3. Permissions → chọn **Read and write** cho cả **Issues** và **Contents**. (Contents dùng để lưu Danh mục & Lịch sử xuất — không cần quyền nào khác.)
4. Tạo token, copy lại (chỉ hiện 1 lần).

> Token chỉ được lưu trong `localStorage` của trình duyệt người dùng đó — không commit vào repo, không gửi lên đâu khác ngoài `api.github.com`. Mỗi máy/trình duyệt cần nhập token riêng.

### Bước 3 — Mở app, vào tab "Cài đặt"
Nhập: Tên công ty, chủ repo (owner), tên repo, token → bấm "Lưu & Kết nối".

### Bước 4 — Dùng
- **Bảng điều khiển**: tổng quan số việc theo từng nhóm SOP, việc sắp/đã quá hạn.
- **Công việc**: xem/lọc danh sách, tạo việc mới (giao cho 1 nhân viên cụ thể), đánh dấu hoàn thành.
- **Biểu mẫu**: chọn loại biểu mẫu, có thể nạp nhanh dữ liệu từ 1 công việc đã tạo, các trường tên người/công ty/đối tác/dự án chọn từ Danh mục (hoặc bấm "+ Thêm mới..." để nhập giá trị chưa có — tự động thêm vào Danh mục). Bấm Tải xuống.
- **Danh mục**: quản lý 4 danh sách dùng chung (Nhân sự, Công ty, Đối tác, Dự án) — thêm/xoá rồi bấm "Lưu danh mục".
- **Lịch sử xuất**: xem lại toàn bộ biểu mẫu đã xuất (ai, khi nào, tên file).

## Quy ước đặt tên file xuất ra

`YYYYMMDD-TenNoiDung_vN.ext` — ví dụ `20260821-PhieuDeNghiMuaSam_v1.doc`.
- `YYYYMMDD`: ngày xuất file.
- `TenNoiDung`: tên loại biểu mẫu (không dấu, không khoảng trắng).
- `vN`: số thứ tự tăng dần nếu xuất trùng loại biểu mẫu trong cùng 1 ngày (v1, v2, v3...), tính dựa trên Lịch sử xuất dùng chung — nên nếu 2 người cùng xuất "Phiếu đề nghị mua sắm" trong cùng ngày, người xuất sau sẽ tự động là `_v2`.

## Lưu ý kỹ thuật quan trọng

- File `.doc`/`.xls` xuất ra thực chất là HTML được đánh dấu namespace của Word/Excel (kỹ thuật "Mso HTML export" — cách làm phổ biến, không cần thư viện, được Microsoft Word/Excel nhận diện và mở đúng định dạng dù đuôi file là .doc/.xls). **Nên mở bằng Microsoft Word/Excel thật** (Windows hoặc Mac) để đảm bảo hiển thị đúng — một số trình đọc khác (Google Docs import, Apple Pages/Numbers) có thể xử lý kém chính xác hơn.
- App không có backend/database riêng:
  - Công việc/giao việc = GitHub Issues thật của repo. Xoá Issue trên GitHub thì mất luôn.
  - Danh mục (Droplist) = file `data/masterdata.json` trong repo.
  - Lịch sử xuất = file `data/export_log.json` trong repo (tự động giới hạn 500 dòng gần nhất).
  - Cả 2 file JSON trên đọc/ghi qua GitHub Contents API — nếu 2 người lưu Danh mục cùng lúc, app tự thử lại tối đa 3 lần khi gặp xung đột (409); nếu vẫn lỗi, tải lại trang và thử lưu lại.
- 8 nhãn (label) nhóm SOP (`SOP1-VanPhong` … `SOP8-NCC`) cần được tạo sẵn trên repo (đã tạo sẵn khi khởi tạo repo này qua `gh` CLI).

## Biểu mẫu hiện có (bộ cốt lõi, có thể bổ sung thêm sau)

| Biểu mẫu | Định dạng | Thuộc SOP | Có droplist |
|---|---|---|---|
| Phiếu đề nghị mua sắm | Word | SOP #2 | Người đề nghị (Nhân sự), Nhà cung cấp (Đối tác) |
| Phiếu yêu cầu sửa chữa | Word | SOP #1 | Người báo hỏng (Nhân sự) |
| Đề nghị đi công tác | Word | SOP #4 | Nhân viên (Nhân sự), Dự án |
| Giấy đề nghị tạm ứng | Word | Tài chính chung | Người đề nghị (Nhân sự) |
| Biên bản bàn giao | Word | SOP #2/#6 | Bên giao/nhận (Nhân sự), Công ty liên quan |
| Biên bản họp / làm việc | Word | Chung | Dự án |
| Bảng chấm công tháng | Excel | SOP #6 | Nhân viên (Nhân sự) |
| Biên bản kiểm kê tài sản | Excel | SOP #2 | — |

Muốn thêm biểu mẫu mới: sửa file `templates.js`, thêm 1 mục vào mảng `FORM_DEFS` theo mẫu có sẵn (đặt `slug` ASCII cho tên file, dùng `type: "droplist", source: "employees"|"companies"|"partners"|"projects"` cho các trường cần chọn từ Danh mục).

## Cấu trúc mã nguồn

```
index.html     — giao diện (6 tab: Bảng điều khiển / Công việc / Biểu mẫu / Danh mục / Lịch sử xuất / Cài đặt)
style.css      — giao diện
i18n.js        — từ điển song ngữ VI/EN + logic chuyển ngôn ngữ
github.js      — gọi GitHub Issues API + Contents API (đọc/ghi file JSON dùng chung)
masterdata.js  — quản lý Danh mục (Droplist): Nhân sự, Công ty, Đối tác, Dự án
exportlog.js   — Lịch sử xuất biểu mẫu + tính số version theo ngày
templates.js   — sinh file Word/Excel theo thể thức hành chính Việt Nam
app.js         — điều phối chung
```

Không có bước build — sửa file rồi refresh trình duyệt là thấy ngay. Deploy: GitHub Pages, nguồn = nhánh `main`, thư mục gốc (`/`).

---
*Bản nháp nội bộ — công cụ hỗ trợ vận hành, không phải phần mềm kế toán/pháp lý chính thức. Biểu mẫu cần công ty tự rà soát trước khi ban hành chính thức.*
