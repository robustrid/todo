require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./src/routes/user-routes');
const todoRoutes = require('./src/routes/todo-routes');
const { authenticate } = require('./src/middleware/authentication')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Routes
    app.use('/users', userRoutes);
    app.use('/todos', authenticate, todoRoutes);


    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();
