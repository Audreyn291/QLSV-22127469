# Hướng Dẫn Cài Đặt và Chạy Hệ Thống Quản Lý Sinh Viên Cơ Bản

---

## 1. Hướng dẫn cách chạy

#### Bước 1: Cài Đặt Node.js
Ứng dụng yêu cầu **Node.js** và **npm**. Nếu chưa có, hãy tải và cài đặt từ:
- [Node.js Download](https://nodejs.org/)

#### Bước 2: Clone Repository Hoặc Giải Nén File ZIP
Nếu sử dụng Git, chạy lệnh:
```sh
git clone https://github.com/Audreyn291/QLSV-22127469
cd QLSV-22127469
```
Hoặc nếu sử dụng file ZIP, giải nén và di chuyển vào thư mục vừa giải nén.

#### Bước 3: Cài Đặt Dependencies
Chạy lệnh:
```sh
npm install
```

#### Bước 4: Chạy Server
Chạy lệnh sau để khởi động ứng dụng:
```sh
node index.js
```
Hoặc sử dụng `nodemon` để tự động reload khi có thay đổi (cần cài trước bằng `npm install -g nodemon`):
```sh
nodemon index.js
```

#### Bước 5: Truy Cập Ứng Dụng
Sau khi server chạy thành công, mở trình duyệt và truy cập:
```
http://localhost:3000
```

---

## 2. Hướng dẫn sử dụng

### a. Thêm sinh viên
- Truy cập trang home hoặc thanh phía trên chọn **"Thêm sinh viên"**
- Nhập thông tin đầy đủ vào form
- Nhấn **"Thêm sinh viên"** để lưu

### b. Tìm kiếm sinh viên
- Truy cập trang home hoặc thanh phía trên chọn **"Tìm kiếm sinh viên"**
- Nhập **MSSV** hoặc **Họ và Tên** để tìm kiếm
- Kết quả sẽ hiển thị danh sách sinh viên phù hợp

### c. Danh sách sinh viên
- Truy cập trang home hoặc thanh phía trên chọn **"Danh sách sinh viên"**
- Xem danh sách các sinh viên đã lưu
- Nhấn **"Sửa"** để chỉnh sửa thông tin sinh viên
- Nhấn **"Xóa"** để xóa sinh viên khỏi danh sách



