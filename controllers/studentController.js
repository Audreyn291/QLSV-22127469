import { Student } from '../Database/dbstudents.js';
import mongoose from 'mongoose';
// Trang chủ
export const getHome = (req, res) => {
  res.render('home');
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
    const newStudent = new Student(req.body); // Tạo sinh viên mới từ dữ liệu form
    await newStudent.save(); // Lưu vào database
    res.redirect('/list'); // Chuyển hướng về trang danh sách sinh viên
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

