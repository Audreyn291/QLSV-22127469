import { getHome, getAddStudent, getStudentList, getSearchStudent, postAddStudent, getStudentsByDepartment, getDepartments } from '../controllers/studentController.js';
import { getStudentById, deleteStudent, updateStudent } from '../controllers/studentController.js';
import { getConfig, addConfigItem, deleteConfigItem } from '../controllers/studentController.js';
import { exportJSON, exportExcel, importData } from '../controllers/studentController.js';
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
router.get('/api/search', getSearchStudent);
router.get('/students/:id', getStudentById);  // Định tuyến lấy thông tin sinh viên
router.put('/students/:id', updateStudent);  // Định tuyến cập nhật sinh viên
router.delete('/students/:id', deleteStudent);  // Định tuyến xóa sinh viên
router.get('/config', getConfig);
router.post('/config', addConfigItem);
router.delete('/config', deleteConfigItem);

router.get('/api/departments', getDepartments);  // Lấy danh sách khoa
router.get('/api/students-by-department', getStudentsByDepartment);  // Tìm sinh viên theo khoa

router.get('/api/export/json', exportJSON);    // Xuất JSON
router.get('/api/export/excel', exportExcel); // Xuất Excel
router.post('/api/import', upload.single('file'), importData); // Nhập dữ liệu từ CSV/Excel

router.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
});


export default router;
