import express from 'express';
const router = express.Router();
import { getHome, getAddStudent, getStudentList, getSearchStudent, postAddStudent, getStudentsByDepartment, getDepartments } from '../controllers/studentController.js';
import { getStudentById, deleteStudent, updateStudent } from '../controllers/studentController.js';
import { getConfig, addConfigItem, deleteConfigItem } from '../controllers/studentController.js';

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


export default router;