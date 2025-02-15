# Quản Lý Sinh Viên - C++

## Mô Tả Chương Trình

Chương trình Quản Lý Sinh Viên được viết bằng ngôn ngữ C++ và chạy trên Windows. Chương trình hỗ trợ thêm, xóa, tìm kiếm, hiển thị danh sách sinh viên, và cập nhật thông tin sinh viên.

## Cấu Trúc Mã Nguồn

- **SinhVien**: Lớp để quản lý thông tin sinh viên (MSSV, họ tên, ngày sinh, giới tính, khoa, chương trình, email, số điện thoại,...).
- **QuanLySinhVien**: Lớp quản lý danh sách sinh viên, bao gồm các hàm:
  - `themSinhVien()`: Thêm một sinh viên mới.
  - `xoaSinhVien()`: Xóa sinh viên theo MSSV.
  - `timKiemSinhVien()`: Tìm kiếm sinh viên theo MSSV hoặc họ tên.
  - `hienThiDanhSach()`: Hiển thị danh sách tất cả sinh viên.
  - `capNhatSinhVien()`: Cập nhật thông tin sinh viên.
- **menu()**: Giao diện menu tương tác với người dùng.
- **main()**: Gọi menu để chạy chương trình.

## Hướng Dẫn Cài Đặt & Biên Dịch

### 1. Cài Đặt Trên Windows

Yêu cầu:

- Hệ điều hành: Windows 10/11
- Trình biên dịch: MinGW/GCC hoặc MSVC
- Trình soạn thảo: Visual Studio Code

### 2. Biên Dịch Chương Trình

#### Sử dụng MinGW/GCC:

1. Cài đặt MinGW/GCC nếu chưa có.
2. Mở terminal tại thư mục chứa mã nguồn.
3. Nhập lệnh sau để biên dịch:
   ```sh
   g++ -o quan_ly_sinh_vien Ex1.cpp
   ```
4. Chạy chương trình:
   ```sh
   ./quan_ly_sinh_vien
   ```

#### Sử dụng Visual Studio Code:

1. Cài đặt VS Code và tiện ích C++ (C/C++ Extension by Microsoft).
2. Mở file `Ex1.cpp` trong VS Code.
3. Nhấn `Ctrl + Shift + B` để build chương trình.
4. Nhấn `F5` để chạy chương trình.

## Cách Sử Dụng Chương Trình

Sau khi chạy, chương trình sẽ hiển thị menu:

```
--- Quản lý Sinh viên ---
1. Thêm sinh viên
2. Xóa sinh viên
3. Tìm kiếm sinh viên
4. Hiển thị danh sách sinh viên
5. Cập nhật thông tin sinh viên
6. Thoát
Nhập lựa chọn:
```

Người dùng nhập số tương ứng để chọn chức năng mong muốn.
