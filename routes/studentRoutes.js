import { getHome, getAddStudent, getStudentList, getSearchStudent, postAddStudent, getStudentsByDepartment, getDepartments } from '../controllers/studentController.js';
import { getStudentById, deleteStudent, updateStudent } from '../controllers/studentController.js';
import { getConfig, addConfigItem, deleteConfigItem, renameConfigItem } from '../controllers/studentController.js';
import { exportJSON, exportExcel, importData } from '../controllers/studentController.js';
import { getEmailDomains, addEmailDomain, deleteEmailDomain } from '../controllers/studentController.js';
import { getPhoneCountryCodes, addPhoneCountryCode, deletePhoneCountryCode } from '../controllers/studentController.js';
import { getAppInfo } from '../controllers/studentController.js';
import { addStatusRule, deleteStatusRule } from '../controllers/studentController.js';
import { getRulesStatus, toggleRulesStatus } from '../controllers/studentController.js';
import { getConfirmationPage, exportConfirmation, updateStudentPurpose } from "../controllers/studentController.js";
import { getAllStudents } from "../controllers/studentController.js";
import express from 'express';
import multer from 'multer';
import logger from '../utils/logger.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getHome);
router.get('/add', getAddStudent);
router.post('/add', postAddStudent);
router.get('/list', getStudentList);
router.get('/search', (req, res) => {
    res.render('search');
});
router.get("/confirmation", getConfirmationPage);
router.get("/confirmation/:id", getConfirmationPage);
router.get("/export-confirmation/:id", exportConfirmation);
router.put("/students/:id/update-purpose", updateStudentPurpose);
router.get('/api/search', getSearchStudent);
router.post('/students', postAddStudent);
router.get("/students", getAllStudents);
router.get('/students/:id', getStudentById);  // Định tuyến lấy thông tin sinh viên
router.put('/students/:id', updateStudent);  // Định tuyến cập nhật sinh viên
router.delete('/students/:id', deleteStudent);  // Định tuyến xóa sinh viên
router.get('/config', getConfig);
router.post('/config', addConfigItem);
router.delete('/config', deleteConfigItem);
router.put('/config/rename', renameConfigItem);

router.get('/api/departments', getDepartments);  // Lấy danh sách khoa
router.get('/api/students-by-department', getStudentsByDepartment);  // Tìm sinh viên theo khoa

router.get('/api/export/json', exportJSON);    // Xuất JSON
router.get('/api/export/excel', exportExcel); // Xuất Excel
router.post('/api/import', upload.single('file'), importData); // Nhập dữ liệu từ CSV/Excel

router.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
});

router.get('/config/rules-status', getRulesStatus);
router.post('/config/toggle-rules', toggleRulesStatus); // Bật/Tắt quy định

router.get("/confirmation/:id", getConfirmationPage);
router.get("/export-confirmation/:id", exportConfirmation);  // Xuất file

router.get('/config/email-domains', getEmailDomains);
router.post('/config/email-domains', addEmailDomain);
router.delete('/config/email-domains/:domain', deleteEmailDomain);

router.get('/config/phone-codes', getPhoneCountryCodes);
router.post('/config/phone-codes', addPhoneCountryCode);
router.delete('/config/phone-codes/:code', deletePhoneCountryCode);

router.post('/config/status-rules', addStatusRule);
router.delete('/config/status-rules', deleteStatusRule);

router.get('/email-config', (req, res) => {
    res.render('emailConfig');
});

router.get('/api/version', getAppInfo);  // Lấy thông tin phiên bản

export default router;