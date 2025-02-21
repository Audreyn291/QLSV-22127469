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

## Phiên bản version 1.0

### a. Thêm sinh viên
- Truy cập trang home hoặc thanh phía trên chọn **"Thêm sinh viên"**
![Trang home](/screenshots/1.png)
- Nhập thông tin đầy đủ vào form
- Chương trình sẽ kiểm tra email, SĐT có nhập đúng format hay không và thông báo để người dùng chỉnh sửa.
![Kiểm tra email](/screenshots/10.png)
![Kiểm tra SĐT](/screenshots/11.png)
- Nhấn **"Thêm sinh viên"** để lưu
![Trang thêm sinh viên ](/screenshots/2.png)

### b. Tìm kiếm sinh viên
- Truy cập trang home hoặc thanh phía trên chọn **"Tìm kiếm sinh viên"**
![Trang home](/screenshots/1.png)
- Nhập **MSSV** hoặc **Họ và Tên** để tìm kiếm
- Kết quả sẽ hiển thị danh sách sinh viên phù hợp
![Trang tìm kiếm](/screenshots/7.png)

### c. Danh sách sinh viên
- Truy cập trang home hoặc thanh phía trên chọn **"Danh sách sinh viên"**
![Trang home](/screenshots/1.png)
- Xem danh sách các sinh viên đã lưu
![Trang danh sách](/screenshots/3.png)
- Nhấn **"Sửa"** để chỉnh sửa thông tin sinh viên
![Sửa sinh viên](/screenshots/4.png)
- Nhấn **"Xóa"** để xóa sinh viên khỏi danh sách

## Phiên bản version 2.0 (Bổ sung thêm chức năng mới)

### a. Lưu trữ dữ liệu
- Dữ liệu thông tin của sinh viên được lưu trữ vào Database cụ thể là MongoDB.
![Lưu trữ dữ liệu](/screenshots/25.png)

### b. Cho phép đổi tên & thêm mới
- Bổ sung thêm chức năng thêm/xóa Khoa/Chương trình/Tình trạng của sinh viên: 
![Giao diên mới](/screenshots/12.png)
+ Nhấn nút **"Thêm Khoa"** và nhập tên khoa muốn thêm vào.
![Chức năng thêm Khoa](/screenshots/13.png)
![Thêm Khoa thành công](/screenshots/14.png)
+ Nhấn chọn khoa và nhấn nút **"Xóa Khoa"** để xóa. 
![Chức năng xóa Khoa](/screenshots/15.png)

### c. Thêm chức năng tìm kiếm
- Bổ sung thêm chức năng tìm kiếm theo khoa và theo khoa kèm MSSV/Họ và tên của sinh viên.
![Giao diện mới](/screenshots/16.png)
+ Chọn **Khoa** mong muốn và nhấn **"Tìm kiếm** và kết quả sẽ hiển thị danh sách sinh viên phù hợp
![Tìm kiếm theo khoa](/screenshots/17.png)
+ Chọn **Khoa** mong muốn và nhập **MSSV**/**Họ và tên** của sinh viên rồi nhấn nút **"Tìm kiếm**.
![Tìm kiếm theo khoa + MSSV](/screenshots/18.png)
![Tìm kiếm theo khoa + họ và tên](/screenshots/19.png)

### d. Hỗ trợ import/export dữ liệu
- Chỉnh lại layout khi nhấn nút **"Sửa"** trong danh sách sinh viên.
![Sửa sinh viên](/screenshots/24.png)
- Bổ sung thêm chức năng xuất file JSON/Excel và Nhập dữ liệu từ file bên ngoài.
![Giao diện mới](/screenshots/20.png)
- Nhấn nút **"Xuất JSON"** hoặc **"Xuất Excel"** để nhận được file tương ứng.
![Xuất JSON](/screenshots/22.png)
![Xuất Excel](/screenshots/21.png)
- Nhấn nút **"Nhập dữ liệu"** để chọn file bên ngoài vào rồi import vào danh sách sinh viên hiện có.
![Nhập dữ liệu](/screenshots/23.png)

### e. Thêm logging mechanism:
- Thêm chức năng mechanism xem lại lịch sử thao tác trên ứng dụng.
- Vào /logs/app.log để xem lịch sử thao tác.
![Logging](/screenshots/27.png)

### f. Chức năng show version và ngày buid ứng dụng
- Phiên bản và ngày buid ứng dụng được hiện thị trên trang home.
![Show version, ngày build](/screenshots/26.png)

