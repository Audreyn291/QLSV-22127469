import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    departments: { type: [String], default: ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"] },
    statuses: { type: [String], default: ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"] },
    programs: { type: [String], default: ["Chất lượng cao", "Đại trà"] }
});

const Option = mongoose.model('Option', optionSchema);

export default Option;