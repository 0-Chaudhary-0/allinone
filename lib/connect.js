// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const username = encodeURIComponent("SuperiorScienceAcademy");
  const password = encodeURIComponent("#@superior@#");
  try {
    await mongoose.connect(`mongodb+srv://SuperiorScienceAcademy:${password}@ssacademy.uihy77l.mongodb.net/?retryWrites=true&w=majority&appName=SSAcademy/test`);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
