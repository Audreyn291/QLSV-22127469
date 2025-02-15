#include <iostream>
#include <vector>
#include <string>
#include <regex>
#include <windows.h>
#undef max  // Hủy macro max() của Windows
using namespace std;

class SinhVien
{
private:
    string mssv;
    string hoTen;
    string ngaySinh;
    string gioiTinh;
    string khoa;
    string khoaHoc;
    string chuongTrinh;
    string diaChi;
    string email;
    string soDienThoai;
    string tinhTrang;

public:
    SinhVien(string mssv, string hoTen, string ngaySinh, string gioiTinh, string khoa, string khoaHoc,
             string chuongTrinh, string diaChi, string email, string soDienThoai, string tinhTrang)
        : mssv(mssv), hoTen(hoTen), ngaySinh(ngaySinh), gioiTinh(gioiTinh), khoa(khoa),
          khoaHoc(khoaHoc), chuongTrinh(chuongTrinh), diaChi(diaChi), email(email),
          soDienThoai(soDienThoai), tinhTrang(tinhTrang) {}

    string getMSSV() const { return mssv; }
    string getHoTen() const { return hoTen; }
    string getNgaySinh() const { return ngaySinh; }
    string getGioiTinh() const { return gioiTinh; }
    string getKhoa() const { return khoa; }
    string getKhoaHoc() const { return khoaHoc; }
    string getChuongTrinh() const { return chuongTrinh; }
    string getDiaChi() const { return diaChi; }
    string getEmail() const { return email; }
    string getSoDienThoai() const { return soDienThoai; }
    string getTinhTrang() const { return tinhTrang; }

    void setHoTen(const string &value) { hoTen = value; }
    void setNgaySinh(const string &value) { ngaySinh = value; }
    void setGioiTinh(const string &value) { gioiTinh = value; }
    void setKhoa(const string &value) { khoa = value; }
    void setKhoaHoc(const string &value) { khoaHoc = value; }
    void setChuongTrinh(const string &value) { chuongTrinh = value; }
    void setDiaChi(const string &value) { diaChi = value; }
    void setEmail(const string &value) { email = value; }
    void setSoDienThoai(const string &value) { soDienThoai = value; }
    void setTinhTrang(const string &value) { tinhTrang = value; }

    void hienThiThongTin() const
    {
        cout << "\n--- Thông tin sinh viên ---\n";
        cout << "MSSV: " << mssv << "\nHọ tên: " << hoTen << "\nNgày sinh: " << ngaySinh
             << "\nGiới tính: " << gioiTinh << "\nKhoa: " << khoa << "\nKhóa học: " << khoaHoc
             << "\nChương trình: " << chuongTrinh << "\nĐịa chỉ: " << diaChi
             << "\nEmail: " << email << "\nSố điện thoại: " << soDienThoai
             << "\nTình trạng: " << tinhTrang << endl;
    }
};

class QuanLySinhVien
{
private:
    vector<SinhVien> danhSachSinhVien;

    bool kiemTraEmail(const string &email) const
    {
        const regex pattern("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$");
        return regex_match(email, pattern);
    }

    bool kiemTraSoDienThoai(const string &soDienThoai) const
    {
        const regex pattern("^\\d{10,11}$");
        return regex_match(soDienThoai, pattern);
    }

public:
    void themSinhVien()
    {
        string mssv, hoTen, ngaySinh, gioiTinh, khoa, chuongTrinh, diaChi, email, soDienThoai, tinhTrang;
        string khoaHoc;

        cout << "Nhập Mã số sinh viên: ";
        cin >> mssv;
        cout << "Nhập Họ tên: ";
        cin.ignore();
        getline(cin, hoTen);
        cout << "Nhập Ngày sinh (dd/mm/yyyy): ";
        cin >> ngaySinh;
        cout << "Nhập Giới tính: ";
        cin >> gioiTinh;

        // Chọn khoa
        cout << "Chọn Khoa:\n";
        cout << "1. Khoa Luật\n";
        cout << "2. Khoa Tiếng Anh Thương mại\n";
        cout << "3. Khoa Tiếng Nhật\n";
        cout << "4. Khoa Tiếng Pháp\n";

        int luaChonKhoa;
        while (true)
        {
            cout << "Nhập số tương ứng với Khoa (1-4): ";
            cin >> luaChonKhoa;

            if (cin.fail())
            {
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "Lựa chọn không hợp lệ. Vui lòng nhập lại.\n";
                continue;
            }

            switch (luaChonKhoa)
            {
            case 1:
                khoa = "Khoa Luật";
                break;
            case 2:
                khoa = "Khoa Tiếng Anh Thương mại";
                break;
            case 3:
                khoa = "Khoa Tiếng Nhật";
                break;
            case 4:
                khoa = "Khoa Tiếng Pháp";
                break;
            default:
                cout << "Lựa chọn không hợp lệ. Vui lòng nhập lại.\n";
                continue;
            }
            break;
        }

        cout << "Nhập Khóa học (ví dụ: K22): ";
        cin.ignore();
        getline(cin, khoaHoc);

        cout << "Nhập Chương trình (ví dụ: CLC): ";
        getline(cin, chuongTrinh);
        cout << "Nhập Địa chỉ: ";
        getline(cin, diaChi);
        do
        {
            cout << "Nhập Email: ";
            cin >> email;
            if (!kiemTraEmail(email))
                cout << "Email không hợp lệ! Vui lòng nhập lại." << endl;
        } while (!kiemTraEmail(email));

        do
        {
            cout << "Nhập Số điện thoại: ";
            cin >> soDienThoai;
            if (!kiemTraSoDienThoai(soDienThoai))
                cout << "Số điện thoại không hợp lệ! Vui lòng nhập lại." << endl;
        } while (!kiemTraSoDienThoai(soDienThoai));

        // Chọn tình trạng sinh viên
        cout << "Chọn Tình trạng sinh viên:\n";
        cout << "1. Đang học\n";
        cout << "2. Đã tốt nghiệp\n";
        cout << "3. Đã thôi học\n";
        cout << "4. Tạm dừng học\n";

        int luaChonTinhTrang;
        while (true)
        {
            cout << "Nhập số tương ứng với Tình trạng (1-4): ";
            cin >> luaChonTinhTrang;

            switch (luaChonTinhTrang)
            {
            case 1:
                tinhTrang = "Đang học";
                break;
            case 2:
                tinhTrang = "Đã tốt nghiệp";
                break;
            case 3:
                tinhTrang = "Đã thôi học";
                break;
            case 4:
                tinhTrang = "Tạm dừng học";
                break;
            default:
                cout << "Lựa chọn không hợp lệ. Vui lòng nhập lại.\n";
                continue;
            }
            break;
        }

        SinhVien sv(mssv, hoTen, ngaySinh, gioiTinh, khoa, khoaHoc, chuongTrinh, diaChi, email, soDienThoai, tinhTrang);
        danhSachSinhVien.push_back(sv);
        cout << "Thêm sinh viên thành công!" << endl;
    }

    void capNhatSinhVien()
    {
        string mssv;
        cout << "Nhập MSSV của sinh viên cần cập nhật: ";
        cin >> mssv;

        for (auto &sv : danhSachSinhVien)
        {
            if (sv.getMSSV() == mssv)
            {
                cout << "\n--- Thông tin hiện tại ---\n";
                sv.hienThiThongTin();

                cout << "\nNhập thông tin mới (bỏ trống nếu không thay đổi):\n";
                cin.ignore();

                string input;
                cout << "Nhập Họ tên mới: ";
                getline(cin, input);
                if (!input.empty())
                    sv.setHoTen(input);

                cout << "Nhập Ngày sinh mới: ";
                getline(cin, input);
                if (!input.empty())
                    sv.setNgaySinh(input);

                cout << "Nhập Giới tính mới: ";
                getline(cin, input);
                if (!input.empty())
                    sv.setGioiTinh(input);

                cout << "Nhập Email mới: ";
                getline(cin, input);
                if (!input.empty())
                    sv.setEmail(input);

                cout << "Nhập Số điện thoại mới: ";
                getline(cin, input);
                if (!input.empty())
                    sv.setSoDienThoai(input);

                cout << "\nCập nhật thành công!\n\n";
                sv.hienThiThongTin();
                return;
            }
        }
        cout << "Không tìm thấy sinh viên!\n";
    }

    void xoaSinhVien()
    {
        string mssv;
        cout << "Nhập Mã số sinh viên cần xóa: ";
        cin >> mssv;

        for (size_t i = 0; i < danhSachSinhVien.size(); i++)
        {
            if (danhSachSinhVien[i].getMSSV() == mssv)
            {
                danhSachSinhVien.erase(danhSachSinhVien.begin() + i);
                cout << "Xóa sinh viên thành công!" << endl;
                return;
            }
        }
        cout << "Không tìm thấy sinh viên với MSSV đã nhập!" << endl;
    }

    void timKiemSinhVien()
    {
        string keyword;
        cout << "Nhập Họ tên hoặc MSSV cần tìm: ";
        cin.ignore();
        getline(cin, keyword);

        for (size_t i = 0; i < danhSachSinhVien.size(); i++)
        {
            if (danhSachSinhVien[i].getMSSV() == keyword ||
                danhSachSinhVien[i].getHoTen().find(keyword) != string::npos)
            {
                danhSachSinhVien[i].hienThiThongTin();
                return;
            }
        }
        cout << "Không tìm thấy sinh viên!" << endl;
    }

    void hienThiDanhSach()
    {
        if (danhSachSinhVien.empty())
        {
            cout << "Danh sách sinh viên trống!" << endl;
            return;
        }
        for (size_t i = 0; i < danhSachSinhVien.size(); i++)
        {
            danhSachSinhVien[i].hienThiThongTin();
        }
    }
};

void menu()
{
    QuanLySinhVien qlsv;
    while (true)
    {
        cout << "\n--- Quản lý Sinh viên ---\n";
        cout << "1. Thêm sinh viên\n";
        cout << "2. Xóa sinh viên\n";
        cout << "3. Tìm kiếm sinh viên\n";
        cout << "4. Hiển thị danh sách sinh viên\n";
        cout << "5. Cập nhật thông tin sinh viên\n";
        cout << "6. Thoát\n";
        cout << "Nhập lựa chọn: ";
        int choice;
        cin >> choice;

        switch (choice)
        {
        case 1:
            qlsv.themSinhVien();
            break;
        case 2:
            qlsv.xoaSinhVien();
            break;
        case 3:
            qlsv.timKiemSinhVien();
            break;
        case 4:
            qlsv.hienThiDanhSach();
            break;
        case 5:
            qlsv.capNhatSinhVien();
            break;
        case 6:
            cout << "Thoát chương trình!" << endl;
            return;
        default:
            cout << "Lựa chọn không hợp lệ!" << endl;
        }
    }
}

int main()
{
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
    menu();
    return 0;
}
