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
    mssv: { type: String, unique: true, required: true },
    họVàTên: { type: String, required: true },
    email: { type: String, required: true },
    giớiTính: String,
    khoa: String,
    khóa: String,
    chươngTrình: String,
    địaChỉ: String,
    sốĐiệnThoại: String,
    tìnhTrạng: String,
    createdAt: { type: Date, default: Date.now } 
});

export const Student = mongoose.model('Student', studentSchema);
export default Student;