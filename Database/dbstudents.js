import mongoose from 'mongoose';

// Kết nối với MongoDB
export async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://dhyen22:yen30052022@qlsv-22127469.xydjl.mongodb.net/qlsv',);
        console.log('Kết nối MongoDB thành công');
    } catch (error) {
        console.log('Kết nối MongoDB thất bại:', error);
    }
}

// Định nghĩa Schema cho sinh viên
const studentSchema = new mongoose.Schema({
    mssv: String,
    họVàTên: String,
    ngàySinh: String,
    giớiTính: String,
    khoa: String,
    khóa: String,
    chươngTrình: String,
    địaChỉ: String,
    email: String,
    sốĐiệnThoại: String,
    tìnhTrạng: String
});

export const Student = mongoose.model('Student', studentSchema);