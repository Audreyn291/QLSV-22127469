import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Student } from "../Database/dbstudents.js";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Model Student", () => {

    test("Tạo sinh viên mới", async () => {
        const student = await Student.create({
            mssv: "SV001",
            họVàTên: "Nguyễn Văn A",
            email: "student@student.university.edu.vn"
        });

        expect(student.mssv).toBe("SV001");
        expect(student.họVàTên).toBe("Nguyễn Văn A");
    });

    test("Không thể tạo sinh viên trùng MSSV", async () => {
        await Student.create({
            mssv: "SV002",
            họVàTên: "Nguyễn Văn B",
            email: "nguyenvanb@student.university.edu.vn"
        });

        await expect(
            Student.create({
                mssv: "SV002",
                họVàTên: "Nguyễn Văn C",
                email: "nguyenvanc@student.university.edu.vn"
            })
        ).rejects.toThrow();
    });
});
