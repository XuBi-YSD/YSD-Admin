# AdminOps — Quản lý Công việc & Biểu mẫu Hành chính

App tĩnh (không backend, không cần cài đặt), chạy trực tiếp trên GitHub Pages, dùng để:

1. **Giao việc & theo dõi tiến độ** cho 8 nhóm quy trình của Trưởng phòng Hành chính (xem bộ SOP đầy đủ đi kèm) — dữ liệu lưu dưới dạng **GitHub Issues** của repo này, nên nhiều người (Trưởng phòng + nhân viên) đều thấy và cập nhật được, miễn là có quyền truy cập repo.
2. **Xuất nhanh biểu mẫu Word (.doc) / Excel (.xls)** theo đúng thể thức hành chính Việt Nam (quốc hiệu tiêu ngữ, chữ ký các bên) — chạy hoàn toàn trong trình duyệt, không cần thư viện ngoài, không cần internet sau khi tải trang xong.

## Cách dùng nhanh

### Bước 1 — Thêm người dùng vào repo
Vào Settings → Collaborators của repo GitHub này, mời từng nhân viên cần được giao việc (họ cần tài khoản GitHub, miễn phí).

### Bước 2 — Mỗi người tự tạo Access Token (1 lần, riêng cho từng người)
1. GitHub → Settings (cá nhân) → Developer settings → Fine-grained tokens → Generate new token.
2. Repository access: chọn **đúng repo này** (không chọn "All repositories").
3. Permissions → **Issues: Read and write**. Không cần quyền nào khác.
4. Tạo token, copy lại (chỉ hiện 1 lần).

> Token chỉ được lưu trong `localStorage` của trình duyệt người dùng đó — không commit vào repo, không gửi lên đâu khác ngoài `api.github.com`. Mỗi máy/trình duyệt cần nhập token riêng.

### Bước 3 — Mở app, vào tab "Cài đặt"
Nhập: Tên công ty, chủ repo (owner), tên repo, token → bấm "Lưu & Kết nối".

### Bước 4 — Dùng
- **Bảng điều khiển**: tổng quan số việc theo từng nhóm SOP, việc sắp/đã quá hạn.
- **Công việc**: xem/lọc danh sách, tạo việc mới (giao cho 1 nhân viên cụ thể), đánh dấu hoàn thành.
- **Biểu mẫu**: chọn loại biểu mẫu, có thể nạp nhanh dữ liệu từ 1 công việc đã tạo, bấm Tải xuống.

## Lưu ý kỹ thuật quan trọng

- File `.doc`/`.xls` xuất ra thực chất là HTML được đánh dấu namespace của Word/Excel (kỹ thuật "Mso HTML export" — cách làm phổ biến, không cần thư viện, được Microsoft Word/Excel nhận diện và mở đúng định dạng dù đuôi file là .doc/.xls). **Nên mở bằng Microsoft Word/Excel thật** (Windows hoặc Mac) để đảm bảo hiển thị đúng — một số trình đọc khác (Google Docs import, Apple Pages/Numbers) có thể xử lý kém chính xác hơn.
- App không có backend/database riêng — toàn bộ dữ liệu công việc là GitHub Issues thật của repo. Xoá Issue trên GitHub thì mất luôn (theo đúng cơ chế Issues).
- 8 nhãn (label) nhóm SOP (`SOP1-VanPhong` … `SOP8-NCC`) cần được tạo sẵn trên repo (đã tạo sẵn khi khởi tạo repo này qua `gh` CLI).

## Biểu mẫu hiện có (bộ cốt lõi, có thể bổ sung thêm sau)

| Biểu mẫu | Định dạng | Thuộc SOP |
|---|---|---|
| Phiếu đề nghị mua sắm | Word | SOP #2 |
| Phiếu yêu cầu sửa chữa | Word | SOP #1 |
| Đề nghị đi công tác | Word | SOP #4 |
| Giấy đề nghị tạm ứng | Word | Tài chính chung |
| Biên bản bàn giao | Word | SOP #2/#6 |
| Biên bản họp / làm việc | Word | Chung |
| Bảng chấm công tháng | Excel | SOP #6 |
| Biên bản kiểm kê tài sản | Excel | SOP #2 |

Muốn thêm biểu mẫu mới: sửa file `templates.js`, thêm 1 mục vào mảng `FORM_DEFS` theo mẫu có sẵn.

## Cấu trúc mã nguồn

```
index.html    — giao diện (4 tab: Bảng điều khiển / Công việc / Biểu mẫu / Cài đặt)
style.css     — giao diện
github.js     — gọi GitHub Issues API, quy ước lưu hạn/mô tả trong nội dung Issue
templates.js  — sinh file Word/Excel theo thể thức hành chính Việt Nam
app.js        — điều phối chung
```

Không có bước build — sửa file rồi refresh trình duyệt là thấy ngay. Deploy: GitHub Pages, nguồn = nhánh `main`, thư mục gốc (`/`).

---
*Bản nháp nội bộ — công cụ hỗ trợ vận hành, không phải phần mềm kế toán/pháp lý chính thức. Biểu mẫu cần công ty tự rà soát trước khi ban hành chính thức.*
