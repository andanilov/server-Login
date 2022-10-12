require('dotenv').config(); // Get .evn config
const express = require('express');
const cors = require('cors'); // For request by browser
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); // MongoDB

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());


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
