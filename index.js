import express from 'express';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import studentRoutes from './routes/studentRoutes.js';
import { connectDatabase } from './Database/dbstudents.js';

const app = express();

// Cấu hình Handlebars với runtimeOptions
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Cho phép truy cập prototype
      allowProtoMethodsByDefault: true,    // Cho phép gọi phương thức prototype
    }
  })
);

app.set('view engine', 'hbs');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  // Thêm dòng này để xử lý JSON
app.use(express.static('public'));


// Routes
app.use('/', studentRoutes);

// Kết nối MongoDB trước khi chạy server
const startServer = async () => {
  try {
    await connectDatabase();  // Gọi hàm kết nối MongoDB
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Không thể kết nối đến database:', error);
  }
};

startServer(); // Gọi hàm khởi động server
