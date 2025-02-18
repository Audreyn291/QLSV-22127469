const getHome = (req, res) => {
    res.render('home');
  };
  
  const getAddStudent = (req, res) => {
    res.render('add');
  };
  
  const getStudentList = (req, res) => {
    res.render('list');
  };
  
  const getSearchStudent = (req, res) => {
    res.render('search');
  };
  
  module.exports = {
    getHome,
    getAddStudent,
    getStudentList,
    getSearchStudent,
  };
  