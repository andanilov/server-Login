require('dotenv').config(); // Get .evn config
const express = require('express');

// --- Middlewares
const cors = require('cors'); // For request by browser
const cookieParser = require('cookie-parser');
const router = require('./router/index'); // Import all routes
const errorMiddleware = require('./middlewares/error-middleware');

const mongoose = require('mongoose'); // MongoDB
const PORT = process.env.PORT || 5000;
const app = express();

// --- Middlewares including
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(process.env.API_ROUTE, router); // middleware for all routes
app.use(errorMiddleware); // error middleware should be last!


// Starting the server with error catching
const start = async () => {
  try {
    // 1. Connect to Db (MongoDB) by URL
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // 2. Start server
    app.listen(PORT, () => console.log(`Server started on ${PORT} port!`))
  } catch (error) {
    console.log(error);
  }
};

start();
