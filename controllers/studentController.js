import { Student } from '../Database/dbstudents.js';
import Option from '../models/optionsModel.js';
import mongoose from 'mongoose';
import fs from 'fs';
import ExcelJS from 'exceljs';
import multer from 'multer';
import logger from "../utils/logger.js";
import path from 'path';
import { fileURLToPath } from 'url';
import pdf from "html-pdf";
import { JSDOM } from "jsdom";
import { convert } from "html-to-text";

// Trang chủ
export const getHome = (req, res) => {
  logger.info("Truy cập trang chủ");
  res.render('home');
};

//EX4
export const getConfirmationPage = async (req, res) => {
  try {
    console.log("ID sinh viên:", req.params.id)

    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      console.log("Không tìm thấy sinh viên!");
      return res.status(404).send("Không tìm thấy sinh viên");
    }

    res.render("confirmation", {
      student,
      purpose: "Xác nhận làm hồ sơ xin việc / thực tập",
      issuedDate: new Date().toLocaleDateString(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sinh viên:", error);
    res.status(500).send("Lỗi khi lấy thông tin sinh viên");
  }
};

export const exportConfirmation = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).send("Không tìm thấy sinh viên");

    const issuedDate = new Date().toLocaleDateString();
    const validUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString();

    // Lấy `purpose` từ database
    const purpose = student.purpose || "Xác nhận làm hồ sơ xin việc / thực tập";

    // Nội dung giấy xác nhận
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h1 style="margin-bottom: 5px;">TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN</h1>
            <h2 style="margin-top: 0;">PHÒNG ĐÀO TẠO</h2>
            <p>📍 Địa chỉ: 227 Nguyễn Văn Cừ, Quận 5, TP.HCM</p>
            <p>📞 (028) 38 354 080 | 📧 contact@hcmus.edu.vn</p>
        </div>
        <hr style="margin: 20px 0;">
        <h2 style="text-align: center;">GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN</h2>
        <p>Trường Đại học Khoa học Tự nhiên xác nhận:</p>
        <h3>1. Thông tin sinh viên:</h3>
        <ul>
            <li><strong>Họ và tên:</strong> ${student.họVàTên}</li>
            <li><strong>Mã số sinh viên:</strong> ${student.mssv}</li>
            <li><strong>Ngày sinh:</strong> ${student.ngàySinh || "N/A"}</li>
            <li><strong>Giới tính:</strong> ${student.giớiTính || "N/A"}</li>
            <li><strong>Khoa:</strong> ${student.khoa || "N/A"}</li>
            <li><strong>Chương trình đào tạo:</strong> ${student.chươngTrình || "N/A"}</li>
            <li><strong>Khóa:</strong> ${student.khóa || "N/A"}</li>
        </ul>
        <h3>2. Tình trạng sinh viên hiện tại:</h3>
        <p>${student.tìnhTrạng || "N/A"}</p>
        <h3>3. Mục đích xác nhận:</h3>
        <p>${purpose}</p>
        <h3>4. Thời gian cấp giấy:</h3>
        <p>Giấy xác nhận có hiệu lực đến ngày: ${validUntil}</p>
        <p>📅 Ngày cấp: ${issuedDate}</p>
        <div style="text-align: right; margin-top: 20px;">
            <p style="font-weight: bold;">✍ Trưởng Phòng Đào Tạo</p>
            <p>(Ký, ghi rõ họ tên, đóng dấu)</p>
        </div>
      </div>
    `;
    const fileName = `confirmation-${student.mssv}`;

    if (req.query.format === "html") {
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}.html`);
      res.setHeader("Content-Type", "text/html");
      return res.send(htmlContent);
    }

    if (req.query.format === "md") {
      const markdown = `
      # TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN  
      ## PHÒNG ĐÀO TẠO  

      📍 Địa chỉ: 227 Nguyễn Văn Cừ, Quận 5, TP.HCM  
      📞 (028) 38 354 080 | ✉️ contact@hcmus.edu.vn  

      ---

      # GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN
      Trường Đại học Khoa học Tự nhiên xác nhận: 

      ## 1. Thông tin sinh viên:  
      - **Họ và Tên:** ${student.họVàTên}  
      - **MSSV:** ${student.mssv}  
      - **Ngày sinh:** ${student.ngàySinh}
      - **Giới tính:** ${student.giớiTính}
      - **Khoa:** ${student.khoa}
      - **Chương trình đào tạo:** ${student.chươngTrình} 
      - **Khóa:** ${student.khóa}
      
      ## 2. Tình trạng sinh viên hiện tại:
      ${student.tìnhTrạng}
      
      ## 3. Mục đích xác nhận:
      ${purpose}

      ## 4. Thời gian cấp giấy: 
      Giấy xác nhận có hiệu lực đến ngày: ${validUntil}

      📅 **Ngày cấp:** ${issuedDate}   

      ✒️ **Trưởng Phòng Đào Tạo** 
      *(Ký, ghi rõ họ tên, đóng dấu)*  
      `;
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}.md`);
      res.setHeader("Content-Type", "text/markdown");
      return res.send(markdown);
    }

    if (req.query.format === "pdf") {
      pdf.create(htmlContent).toBuffer((err, buffer) => {
        if (err) return res.status(500).send("Lỗi xuất PDF");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        res.send(buffer);
      });
      return;
    }

    res.status(400).send("Định dạng không hợp lệ");
  } catch (error) {
    console.error("Lỗi khi xuất file:", error);
    res.status(500).send("Lỗi khi xuất file");
  }
};

export const updateStudentPurpose = async (req, res) => {
  try {
    const { purpose } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { purpose }, { new: true });

    if (!student) return res.status(404).json({ error: "Không tìm thấy sinh viên" });

    res.json({ message: "Cập nhật mục đích thành công!", student });
  } catch (error) {
    console.error("Lỗi khi cập nhật mục đích:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().lean();
    res.json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sinh viên:", error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách sinh viên" });
  }
};

//EX3
export const getEmailDomains = async (req, res) => {
  try {
    let config = await Option.findOne();
    if (!config) config = new Option();
    res.json(config.emailDomains || []);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tên miền email." });
  }
};

export const addEmailDomain = async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ message: "Tên miền không hợp lệ!" });

    let config = await Option.findOne();
    if (!config) config = new Option();

    if (!config.emailDomains.includes(domain)) {
      config.emailDomains.push(domain);
      await config.save();
    }

    res.json({ message: "Đã thêm tên miền!", emailDomains: config.emailDomains });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm tên miền email!" });
  }
};

export const deleteEmailDomain = async (req, res) => {
  try {
    const { domain } = req.params;
    let config = await Option.findOne();
    if (!config) config = new Option();

    config.emailDomains = config.emailDomains.filter(d => d !== domain);
    await config.save();

    res.json({ message: "Đã xóa tên miền!", emailDomains: config.emailDomains });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tên miền email!" });
  }
};

export const getPhoneCountryCodes = async (req, res) => {
  try {
    let config = await Option.findOne();
    if (!config) config = new Option();
    res.json(config.phoneCountryCodes || []);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách mã quốc gia!" });
  }
};

export const addPhoneCountryCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.startsWith('+')) return res.status(400).json({ message: "Mã quốc gia không hợp lệ!" });

    let config = await Option.findOne();
    if (!config) config = new Option();

    if (!config.phoneCountryCodes.includes(code)) {
      config.phoneCountryCodes.push(code);
      await config.save();
    }

    res.json({ message: "Đã thêm mã quốc gia!", phoneCountryCodes: config.phoneCountryCodes });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm mã quốc gia!" });
  }
};

export const deletePhoneCountryCode = async (req, res) => {
  try {
    const { code } = req.params;
    let config = await Option.findOne();
    if (!config) config = new Option();

    config.phoneCountryCodes = config.phoneCountryCodes.filter(c => c !== code);
    await config.save();

    res.json({ message: "Đã xóa mã quốc gia!", phoneCountryCodes: config.phoneCountryCodes });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa mã quốc gia!" });
  }
};

export const addStatusRule = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (!from || !to || from === to) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    let config = await Option.findOne();
    if (!config) config = new Option();

    // Kiểm tra nếu quy tắc chưa tồn tại thì mới thêm
    if (!config.statusRules.get(from)?.includes(to)) {
      if (!config.statusRules.has(from)) {
        config.statusRules.set(from, []);
      }
      config.statusRules.get(from).push(to);
      await config.save();
      return res.json({ message: `Đã thêm quy tắc: ${from} → ${to}` });
    }

    res.status(400).json({ message: "Quy tắc đã tồn tại!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm quy tắc!" });
  }
};

export const deleteStatusRule = async (req, res) => {
  try {
    const { from, to } = req.body;
    let config = await Option.findOne();
    if (!config) {
      return res.status(404).json({ message: "Không tìm thấy cấu hình!" });
    }

    if (config.statusRules.has(from)) {
      config.statusRules.set(from, config.statusRules.get(from).filter(status => status !== to));
      await config.save();
      return res.json({ message: `Đã xóa quy tắc: ${from} → ${to}` });
    }

    res.status(400).json({ message: "Không tìm thấy quy tắc để xóa!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa quy tắc!" });
  }
};

// Lấy đường dẫn hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy phiên bản và ngày build từ package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const buildDatePath = path.join(__dirname, '../build-date.txt');

// Ghi ngày build khi server khởi động
if (!fs.existsSync(buildDatePath)) {
  fs.writeFileSync(buildDatePath, new Date().toISOString());
}
const buildDate = fs.readFileSync(buildDatePath, 'utf-8');

// API trả về phiên bản và ngày build
export const getAppInfo = (req, res) => {
  logger.info("Lấy thông tin phiên bản ứng dụng.");
  res.json({
    version: packageJson.version,
    buildDate: buildDate
  });
};

// Thiết lập multer để upload file
const upload = multer({ dest: 'uploads/' });

// Xuất dữ liệu ra JSON
export const exportJSON = async (req, res) => {
  try {
    const students = await Student.find().lean();
    if (students.length === 0) {
      logger.warn("Không có dữ liệu để xuất JSON.");
      return res.status(400).json({ message: "Không có dữ liệu để xuất." });
    }
    logger.info(`Xuất JSON thành công - ${students.length} sinh viên.`);
    res.setHeader('Content-Disposition', 'attachment; filename=sinhvien.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(students);
  } catch (error) {
    logger.error(`Lỗi xuất JSON: ${error.message}`);
    res.status(500).send("Lỗi khi xuất JSON.");
  }
};

// Xuất dữ liệu ra Excel
export const exportExcel = async (req, res) => {
  try {
    const students = await Student.find().lean();
    if (students.length === 0) {
      logger.warn("Không có dữ liệu để xuất Excel.");
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
    logger.info(`Xuất Excel thành công - ${students.length} sinh viên.`);
    res.setHeader('Content-Disposition', 'attachment; filename=sinhvien.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error(`Lỗi xuất Excel: ${error.message}`);
    res.status(500).send("Lỗi khi xuất Excel.");
  }
};

// Import dữ liệu từ JSON hoặc Excel
export const importData = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn("Người dùng không chọn file để import.");
      return res.status(400).json({ message: "Vui lòng chọn file để tải lên." });
    }

    const filePath = req.file.path;
    const students = [];

    if (req.file.mimetype === 'application/json') {
      try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(jsonData);
        students.push(...parsedData);
        logger.info(`Nhập dữ liệu từ JSON: ${students.length} bản ghi.`);
      } catch (error) {
        logger.error(`Lỗi đọc file JSON: ${error.message}`);
        return res.status(400).json({ message: "File JSON không hợp lệ." });
      }
    } else if (req.file.mimetype.includes('spreadsheetml')) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
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
        logger.info(`Nhập dữ liệu từ Excel: ${students.length} bản ghi.`);
      } catch (error) {
        logger.error(`Lỗi đọc file Excel: ${error.message}`);
        return res.status(400).json({ message: "File Excel không hợp lệ." });
      }
    } else {
      logger.warn("Người dùng tải lên file không hợp lệ.");
      return res.status(400).json({ message: "Chỉ hỗ trợ file JSON hoặc Excel." });
    }

    await Student.insertMany(students);
    fs.unlinkSync(filePath);
    logger.info("Import dữ liệu thành công!");
    res.json({ message: "Import dữ liệu thành công!", students });
  } catch (error) {
    logger.error(`Lỗi import dữ liệu: ${error.message}`);
    res.status(500).json({ message: "Lỗi khi import dữ liệu." });
  }
};

// Lấy danh sách khoa, tình trạng sinh viên, chương trình đào tạo
export const getConfig = async (req, res) => {
  try {
    let config = await Option.findOne();
    if (!config) {
      config = new Option();
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
    logger.info(`Nhận yêu cầu thêm cấu hình - Loại: ${type}, Giá trị: ${value}`);

    if (!type || !value) {
      logger.warn("Thiếu dữ liệu đầu vào khi thêm cấu hình.");
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    let config = await Option.findOne();
    if (!config) config = new Option();

    // Kiểm tra type có hợp lệ hay không
    const validTypes = ["departments", "statuses", "programs"];
    if (!validTypes.includes(type)) {
      logger.warn(`Loại cấu hình không hợp lệ: ${type}`);
      return res.status(400).json({ message: "Loại dữ liệu không hợp lệ." });
    }

    if (!config[type].includes(value)) {
      config[type].push(value);
      await config.save();
      logger.info(`Thêm cấu hình thành công - Loại: ${type}, Giá trị: ${value}`);
      return res.json({ message: "Thêm thành công!", config });
    } else {
      logger.warn(`Giá trị cấu hình đã tồn tại - Loại: ${type}, Giá trị: ${value}`);
      return res.status(400).json({ message: "Giá trị đã tồn tại." });
    }
  } catch (error) {
    logger.error(`Lỗi khi thêm cấu hình: ${error.message}`);
    res.status(500).json({ message: "Lỗi khi thêm mục mới." });
  }
};

// Xóa một mục khỏi danh sách
export const deleteConfigItem = async (req, res) => {
  try {
    const { type, value } = req.body;
    logger.info(`Nhận yêu cầu xóa cấu hình - Loại: ${type}, Giá trị: ${value}`);

    if (!type || !value) {
      logger.warn("Thiếu dữ liệu đầu vào khi xóa cấu hình.");
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    let config = await Option.findOne();
    if (!config) {
      logger.warn("Không tìm thấy cấu hình để xóa.");
      return res.status(404).json({ message: "Không tìm thấy cấu hình." });
    }

    // Kiểm tra type có hợp lệ hay không
    const validTypes = ["departments", "statuses", "programs"];
    if (!validTypes.includes(type)) {
      logger.warn(`Loại cấu hình không hợp lệ khi xóa: ${type}`);
      return res.status(400).json({ message: "Loại dữ liệu không hợp lệ." });
    }

    if (!config[type].includes(value)) {
      logger.warn(`Không tìm thấy giá trị cấu hình để xóa - Loại: ${type}, Giá trị: ${value}`);
      return res.status(400).json({ message: "Không tìm thấy giá trị để xóa." });
    }

    config[type] = config[type].filter(item => item !== value);
    await config.save();
    logger.info(`Xóa cấu hình thành công - Loại: ${type}, Giá trị: ${value}`);
    return res.json({ message: "Xóa thành công!", config });
  } catch (error) {
    logger.error(`Lỗi khi xóa cấu hình: ${error.message}`);
    res.status(500).json({ message: "Lỗi khi xóa mục." });
  }
};

// Đổi tên một mục trong danh sách cấu hình
export const renameConfigItem = async (req, res) => {
  try {
    const { type, oldValue, newValue } = req.body;
    logger.info(`Nhận yêu cầu đổi tên cấu hình - Loại: ${type}, Từ: ${oldValue}, Thành: ${newValue}`);

    if (!type || !oldValue || !newValue) {
      logger.warn("Thiếu dữ liệu đầu vào khi đổi tên cấu hình.");
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    let config = await Option.findOne();
    if (!config) {
      logger.warn("Không tìm thấy cấu hình.");
      return res.status(404).json({ message: "Không tìm thấy cấu hình." });
    }

    // Kiểm tra loại dữ liệu hợp lệ
    const validTypes = ["departments", "statuses", "programs"];
    if (!validTypes.includes(type)) {
      logger.warn(`Loại cấu hình không hợp lệ: ${type}`);
      return res.status(400).json({ message: "Loại dữ liệu không hợp lệ." });
    }

    const index = config[type].indexOf(oldValue);
    if (index === -1) {
      logger.warn(`Không tìm thấy giá trị cần đổi tên - Loại: ${type}, Giá trị: ${oldValue}`);
      return res.status(400).json({ message: "Không tìm thấy giá trị cần đổi tên." });
    }

    // Cập nhật giá trị
    config[type][index] = newValue;
    await config.save();
    logger.info(`Đổi tên cấu hình thành công - Loại: ${type}, Từ: ${oldValue}, Thành: ${newValue}`);

    return res.json({ message: "Đổi tên thành công!", config });
  } catch (error) {
    logger.error(`Lỗi khi đổi tên cấu hình: ${error.message}`);
    res.status(500).json({ message: "Lỗi khi đổi tên mục." });
  }
};

// Hiển thị danh sách sinh viên từ MongoDB
export const getStudentList = async (req, res) => {
  try {
    const students = await Student.find().lean();
    logger.info(`Lấy danh sách sinh viên - Số lượng: ${students.length}`);
    res.render('list', { students });
  } catch (error) {
    logger.error(`Lỗi tải danh sách sinh viên: ${error.message}`);
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
    const { email, khoa, sốĐiệnThoại, mssv, họVàTên } = req.body;

    // Xác định request có phải từ API không
    const isApiRequest = req.headers['accept'] && req.headers['accept'].includes('application/json');

    // Kiểm tra các trường bắt buộc
    if (!email || !sốĐiệnThoại || !mssv || !họVàTên) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc: email, sốĐiệnThoại, mssv, họVàTên" });
    }

    // Kiểm tra MSSV đã tồn tại hay chưa
    const existingStudent = await Student.findOne({ mssv });
    if (existingStudent) {
      console.log("MSSV đã tồn tại:", mssv);  // Debug log
      return res.status(400).json({ error: "MSSV đã tồn tại, vui lòng chọn MSSV khác" });
    }

    // Lấy config từ database
    let config = await Option.findOne();
    if (!config) {
      config = new Option();
      await config.save();
    }

    if (config.rulesEnabled) {
      const allowedDomains = config.emailDomains || [];
      const allowedPhoneCodes = config.phoneCountryCodes || [];

      // Kiểm tra email có đúng domain không
      const emailDomain = email.split('@').pop();
      if (!allowedDomains.includes(emailDomain)) {
        return isApiRequest
          ? res.status(400).json({ error: `Email phải thuộc tên miền hợp lệ: ${allowedDomains.join(', ')}` })
          : res.render('add', { error: `Email phải thuộc tên miền hợp lệ: ${allowedDomains.join(', ')}` });
      }

      // Kiểm tra số điện thoại có đúng mã quốc gia không
      if (!allowedPhoneCodes.some(code => sốĐiệnThoại.startsWith(code))) {
        return isApiRequest
          ? res.status(400).json({ error: `Số điện thoại phải bắt đầu bằng: ${allowedPhoneCodes.join(', ')}` })
          : res.render('add', { error: `Số điện thoại phải bắt đầu bằng: ${allowedPhoneCodes.join(', ')}` });
      }

      // Nếu khoa chưa tồn tại, thêm vào danh sách
      if (!config.departments.includes(khoa)) {
        config.departments.push(khoa);
        await config.save();
      }
    }

    // Tạo sinh viên mới
    const newStudent = new Student(req.body);
    await newStudent.save();

    return isApiRequest
      ? res.status(201).json({ student: newStudent })
      : res.redirect('/list');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi thêm sinh viên" });
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
    if (!student) {
      logger.warn(`Xóa sinh viên thất bại - ID không tồn tại: ${req.params.id}`);
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    const now = new Date();

    const deletionTimeLimit = 30;

    const timeDiff = (now - student.createdAt) / (1000 * 60);

    if (timeDiff > deletionTimeLimit) {
      return res.status(403).json({ message: `Chỉ có thể xóa sinh viên trong vòng ${deletionTimeLimit} phút sau khi tạo.` });
    }

    logger.info(`Xóa sinh viên thành công - ID: ${req.params.id}`);
    res.json({ message: "Xóa sinh viên thành công!" });
  } catch (error) {
    logger.error(`Lỗi khi xóa sinh viên: ${error.message}`);
    res.status(500).json({ message: "Lỗi khi xóa sinh viên." });
  }
};

// Cập nhật thông tin sinh viên
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { tìnhTrạng } = req.body;

    logger.info(`Nhận yêu cầu cập nhật sinh viên - ID: ${studentId}`);
    logger.info(`Dữ liệu từ frontend: ${JSON.stringify(req.body)}`);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      logger.warn(`ID không hợp lệ: ${studentId}`);
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    if (!tìnhTrạng) {
      return res.status(400).json({ message: "Trạng thái mới không hợp lệ!" });
    }

    // Kiểm tra xem sinh viên có tồn tại không
    const student = await Student.findById(studentId);
    if (!student) {
      logger.warn(`Không tìm thấy sinh viên - ID: ${studentId}`);
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    // Lấy quy tắc trạng thái từ cấu hình
    const config = await Option.findOne();
    const statusRules = config?.statusRules ? JSON.parse(JSON.stringify(config.statusRules)) : {};

    // console.log("Dữ liệu statusRules sau khi chuyển đổi:", statusRules);
    // console.log(`Trạng thái hiện tại: ${student.tìnhTrạng}`);
    // console.log("Trạng thái có thể chuyển đổi:", statusRules[student.tìnhTrạng]);

    // Lấy danh sách trạng thái hợp lệ cho trạng thái hiện tại
    const allowedNextStatuses = statusRules[student.tìnhTrạng] || [];

    // Kiểm tra nếu trạng thái mới không hợp lệ
    if (!Array.isArray(allowedNextStatuses) || !allowedNextStatuses.includes(tìnhTrạng)) {
      return res.status(400).json({ message: `Không thể đổi từ "${student.tìnhTrạng}" sang "${tìnhTrạng}"!` });
    }

    // Cập nhật thông tin sinh viên
    student.tìnhTrạng = tìnhTrạng;

    // Kiểm tra nếu dữ liệu trống thì không cập nhật
    let hasUpdate = false;
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        student[key] = req.body[key];
        hasUpdate = true;
      }
    });

    if (!hasUpdate) {
      logger.warn(`Không có dữ liệu mới để cập nhật - ID: ${studentId}`);
      return res.status(400).json({ message: "Không có dữ liệu mới để cập nhật." });
    }

    // Lưu thay đổi
    await student.save();
    logger.info(`Cập nhật thành công - ID: ${studentId}, Dữ liệu mới: ${JSON.stringify(student)}`);

    return res.json({ message: "Cập nhật thành công!", student });

  } catch (error) {
    logger.error(`Lỗi khi cập nhật sinh viên - ID: ${req.params.id}, Lỗi: ${error.message}`);
    return res.status(500).json({ message: "Lỗi khi cập nhật thông tin.", error });
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
    logger.info("Lấy danh sách khoa");
    res.json(config?.departments || []);
  } catch (error) {
    logger.error(`Lỗi tải danh sách khoa: ${error.message}`);
    res.status(500).json({ message: "Lỗi khi tải danh sách khoa." });
  }
};

//lấy và cập nhật trạng thái bật/tắt quy định
export const getRulesStatus = async (req, res) => {
  try {
    let config = await Option.findOne();
    if (!config) {
      config = new Option();
      await config.save();
    }
    res.json({ rulesEnabled: config.rulesEnabled });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy trạng thái quy định." });
  }
};

export const toggleRulesStatus = async (req, res) => {
  try {
    let config = await Option.findOne();
    if (!config) {
      config = new Option();
    }

    config.rulesEnabled = !config.rulesEnabled; // Đảo trạng thái
    await config.save();
    res.json({ message: `Quy định đã được ${config.rulesEnabled ? "bật" : "tắt"}!`, rulesEnabled: config.rulesEnabled });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái quy định." });
  }
};