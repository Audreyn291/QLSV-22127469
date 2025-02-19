import { Student } from '../Database/dbstudents.js';
import Option from '../models/optionsModel.js';
import mongoose from 'mongoose';
import fs from 'fs';
import { parse } from 'json2csv';
import ExcelJS from 'exceljs';
import multer from 'multer';


// Trang chủ
export const getHome = (req, res) => {
  res.render('home');
};

// Thiết lập multer để upload file
const upload = multer({ dest: 'uploads/' });

// Xuất dữ liệu ra JSON
export const exportJSON = async (req, res) => {
  try {
    const students = await Student.find().lean();

    if (students.length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để xuất." });
    }

    res.setHeader('Content-Disposition', 'attachment; filename=sinhvien.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(students);
  } catch (error) {
    console.error("Lỗi xuất JSON:", error);
    res.status(500).send("Lỗi khi xuất JSON.");
  }
};

// Xuất dữ liệu ra Excel
export const exportExcel = async (req, res) => {
  try {
    const students = await Student.find().lean();

    if (students.length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để xuất." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách sinh viên");

    worksheet.columns = [
      { header: "MSSV", key: "mssv", width: 15 },
      { header: "Họ và Tên", key: "họVàTên", width: 20 },
      { header: "Ngày sinh", key: "ngàySinh", width: 15 },
      { header: "Giới tính", key: "giớiTính", width: 10 },
      { header: "Khoa", key: "khoa", width: 20 },
      { header: "Khóa", key: "khóa", width: 10 },
      { header: "Chương trình", key: "chươngTrình", width: 20 },
      { header: "Địa chỉ", key: "địaChỉ", width: 30 },
      { header: "Email", key: "email", width: 25 },
      { header: "Số điện thoại", key: "sốĐiệnThoại", width: 15 },
      { header: "Tình trạng", key: "tìnhTrạng", width: 15 }
    ];

    worksheet.addRows(students);

    res.setHeader('Content-Disposition', 'attachment; filename=sinhvien.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi xuất Excel:", error);
    res.status(500).send("Lỗi khi xuất Excel.");
  }
};

// Import dữ liệu từ JSON hoặc Excel
export const importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file để tải lên." });
    }

    const filePath = req.file.path;
    const students = [];

    if (req.file.mimetype === 'application/json') {
      // Xử lý file JSON
      try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(jsonData);
        students.push(...parsedData);
      } catch (error) {
        console.error("Lỗi đọc file JSON:", error);
        return res.status(400).json({ message: "File JSON không hợp lệ." });
      }
    } else if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      req.file.mimetype === 'application/vnd.ms-excel'
    ) {
      // Xử lý file Excel
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Bỏ qua tiêu đề
            students.push({
              mssv: row.getCell(1).value,
              họVàTên: row.getCell(2).value,
              ngàySinh: row.getCell(3).value,
              giớiTính: row.getCell(4).value,
              khoa: row.getCell(5).value,
              khóa: row.getCell(6).value,
              chươngTrình: row.getCell(7).value,
              địaChỉ: row.getCell(8).value,
              email: row.getCell(9).value,
              sốĐiệnThoại: row.getCell(10).value,
              tìnhTrạng: row.getCell(11).value
            });
          }
        });
      } catch (error) {
        console.error("Lỗi đọc file Excel:", error);
        return res.status(400).json({ message: "File Excel không hợp lệ." });
      }
    } else {
      return res.status(400).json({ message: "Chỉ hỗ trợ file JSON hoặc Excel." });
    }

    // Lưu vào database
    await Student.insertMany(students);
    fs.unlinkSync(filePath); // Xóa file sau khi xử lý xong

    res.json({ message: "Import dữ liệu thành công!", students });
  } catch (error) {
    console.error("Lỗi import dữ liệu:", error);
    res.status(500).json({ message: "Lỗi khi import dữ liệu." });
  }
};

// Lấy danh sách khoa, tình trạng sinh viên, chương trình đào tạo
export const getConfig = async (req, res) => {
  try {
    let config = await Option.findOne();
    if (!config) {
      config = new Option(); // Tạo mới nếu không có dữ liệu
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải danh sách cấu hình." });
  }
};

// Thêm một mục mới vào danh sách
export const addConfigItem = async (req, res) => {
  try {
    const { type, value } = req.body;
    if (!type || !value) return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });

    let config = await Option.findOne();
    if (!config) config = new Option();

    // Kiểm tra type có hợp lệ hay không
    const validTypes = ["departments", "statuses", "programs"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Loại dữ liệu không hợp lệ." });
    }

    if (!config[type].includes(value)) {
      config[type].push(value);
      await config.save();
      return res.json({ message: "Thêm thành công!", config });
    } else {
      return res.status(400).json({ message: "Giá trị đã tồn tại." });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm mục mới." });
  }
};


// Xóa một mục khỏi danh sách
export const deleteConfigItem = async (req, res) => {
  try {
    const { type, value } = req.body;
    if (!type || !value) return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });

    let config = await Option.findOne();
    if (!config) return res.status(404).json({ message: "Không tìm thấy cấu hình." });

    // Kiểm tra type có hợp lệ hay không
    const validTypes = ["departments", "statuses", "programs"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Loại dữ liệu không hợp lệ." });
    }

    if (!config[type].includes(value)) {
      return res.status(400).json({ message: "Không tìm thấy giá trị để xóa." });
    }

    config[type] = config[type].filter(item => item !== value);
    await config.save();
    return res.json({ message: "Xóa thành công!", config });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa mục." });
  }
};


// Hiển thị danh sách sinh viên từ MongoDB
export const getStudentList = async (req, res) => {
  try {
    const students = await Student.find().lean(); // Chuyển đổi thành object thuần túy
    res.render('list', { students });
  } catch (error) {
    console.log(error);
    res.status(500).send('Lỗi khi tải danh sách sinh viên');
  }
};


// Hiển thị trang thêm sinh viên
export const getAddStudent = (req, res) => {
  res.render('add');
};

// Xử lý thêm sinh viên mới vào MongoDB
export const postAddStudent = async (req, res) => {
  try {
    const { khoa } = req.body;
    let config = await Option.findOne();

    if (!config) {
      config = new Option();
    }

    // Nếu khoa chưa tồn tại, thêm vào danh sách
    if (!config.departments.includes(khoa)) {
      config.departments.push(khoa);
      await config.save();
    }

    const newStudent = new Student(req.body);
    await newStudent.save();

    res.redirect('/list');
  } catch (error) {
    console.log(error);
    res.status(500).send('Lỗi khi thêm sinh viên');
  }
};


// Tìm kiếm sinh viên theo MSSV hoặc Họ tên
export const getSearchStudent = async (req, res) => {
  try {
    let query = req.query.q || "";
    query = String(query).trim();

    console.log("Query nhận được:", query); // Kiểm tra dữ liệu đầu vào

    if (!query) {
      return res.json([]); // Nếu không có input, trả về mảng rỗng
    }

    const students = await Student.find({
      $or: [
        { mssv: { $regex: `^${query}`, $options: 'i' } },
        { họVàTên: { $regex: query, $options: 'i' } }
      ]
    }).lean();

    console.log("Kết quả tìm kiếm:", students); // Debug kết quả

    res.json(students);
  } catch (error) {
    console.error("Lỗi tìm kiếm sinh viên:", error);
    res.status(500).send("Lỗi khi tìm kiếm sinh viên");
  }
};
// Xóa sinh viên theo ID
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    res.json({ message: "Xóa sinh viên thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sinh viên." });
  }
};

// Cập nhật thông tin sinh viên
export const updateStudent = async (req, res) => {
  try {
    console.log("Nhận yêu cầu cập nhật ID:", req.params.id);
    console.log("Dữ liệu nhận được từ frontend:", req.body); // Log dữ liệu nhận từ client

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên." });

    // Kiểm tra nếu dữ liệu trống thì không cập nhật
    let hasUpdate = false;
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        student[key] = req.body[key];
        hasUpdate = true;
      }
    });

    if (!hasUpdate) {
      return res.status(400).json({ message: "Không có dữ liệu mới để cập nhật." });
    }

    await student.save();
    console.log("Cập nhật thành công:", student); // Log sau khi cập nhật

    res.json({ message: "Cập nhật thông tin thành công!", student });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin." });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên." });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin sinh viên." });
  }
};

// Tìm kiếm sinh viên theo khoa
export const getStudentsByDepartment = async (req, res) => {
  try {
    const department = req.query.department || "";
    if (!department) {
      return res.json([]);
    }

    const students = await Student.find({ khoa: department }).lean();
    res.json(students);
  } catch (error) {
    console.error("Lỗi tìm kiếm sinh viên theo khoa:", error);
    res.status(500).send("Lỗi khi tìm kiếm sinh viên");
  }
};

// Lấy danh sách khoa từ CSDL
export const getDepartments = async (req, res) => {
  try {
    const config = await Option.findOne();
    if (!config || !config.departments) {
      return res.json([]);
    }
    res.json(config.departments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải danh sách khoa." });
  }
};