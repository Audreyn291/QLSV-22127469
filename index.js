const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        layoutsDir: './views/layouts',
        partialsDir: './views/partials',
    })
);


// Cấu hình Handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.use('/', studentRoutes);

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
