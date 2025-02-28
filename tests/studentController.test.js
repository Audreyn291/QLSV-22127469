import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';
import Student from '../Database/dbstudents.js';
import Option from '../models/optionsModel.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();

    await mongoose.disconnect();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Tạo Config mặc định
    await Option.create({
        emailDomains: ["student.university.edu.vn"],
        phoneCountryCodes: ["+84", "03", "05", "07", "08", "09"]
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("API StudentController", () => {

    test("Thêm email domain hợp lệ", async () => {
        const response = await request(app).post("/config/email-domains").send({ domain: "test.edu.vn" });
        expect(response.status).toBe(200);
        expect(response.body.emailDomains).toContain("test.edu.vn");
    });

    test("Thêm số điện thoại hợp lệ", async () => {
        const response = await request(app).post("/config/phone-codes").send({ code: "+85" });
        expect(response.status).toBe(200);
        expect(response.body.phoneCountryCodes).toContain("+85");
    });

    test("Thêm sinh viên mới", async () => {
        const student = {
            mssv: "SV001",  // Kiểm tra lại key này
            họVàTên: "Nguyễn Văn A",  // Kiểm tra lại key này
            email: "student@student.university.edu.vn",
            sốĐiệnThoại: "0901234567",
            khoa: "Khoa Công Nghệ",
            tìnhTrạng: "Đang học"
        };


        const response = await request(app)
            .post("/students")
            .set("Accept", "application/json")
            .send(student);

        expect(response.status).toBe(201);
        expect(response.body.student.họVàTên).toBe("Nguyễn Văn A");
    });

    test("Không thể thêm sinh viên trùng MSSV", async () => {
        await Student.create({
            mssv: "SV002",
            họVàTên: "Nguyễn Văn B",
            email: "nguyenvanb@student.university.edu.vn"
        });

        const response = await request(app).post("/students").send({
            mssv: "SV002",
            họVàTên: "Nguyễn Văn C",
            email: "nguyenvanc@student.university.edu.vn"
        });

        expect(response.status).toBe(400);
    });

    test("Xóa sinh viên", async () => {
        const student = await Student.create({
            mssv: "SV003",
            họVàTên: "Trần Văn C",
            email: "tranvc@student.university.edu.vn"
        });

        const response = await request(app).delete(`/students/${student._id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Xóa sinh viên thành công!");
    });

});
