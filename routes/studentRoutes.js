const express = require('express');
const { getHome, getAddStudent, getStudentList, getSearchStudent } = require('../controllers/studentController');

const router = express.Router();

router.get('/', getHome);
router.get('/add', getAddStudent);
router.get('/search', getSearchStudent);
router.get('/list', getStudentList);

module.exports = router;
