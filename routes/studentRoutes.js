import express from 'express';
import { getHome, getAddStudent, getStudentList, getSearchStudent, postAddStudent } from '../controllers/studentController.js';
import { getStudentById, deleteStudent, updateStudent } from '../controllers/studentController.js';

const router = express.Router(); // Định nghĩa router trước khi sử dụng

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

export default router;
