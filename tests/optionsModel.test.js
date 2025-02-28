import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Option from "../models/optionsModel.js";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await Option.create({
        emailDomains: ["student.university.edu.vn"],
        phoneCountryCodes: ["+84", "03", "05", "07", "08", "09"]
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Model Option", () => {
    test("Lấy danh sách email domain", async () => {
        const config = await Option.findOne();
        expect(config.emailDomains).toContain("student.university.edu.vn");
    });

    test("Thêm một email domain mới", async () => {
        const config = await Option.findOne();
        config.emailDomains.push("new.edu.vn");
        await config.save();

        const updatedConfig = await Option.findOne();
        expect(updatedConfig.emailDomains).toContain("new.edu.vn");
    });
});
