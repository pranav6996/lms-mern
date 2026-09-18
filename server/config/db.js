const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/learnhub';

  if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    console.error('⚠️  WARNING: MONGO_URI is not defined in Environment Variables.');
    console.error('👉 Please set MONGO_URI in your Render dashboard (Environment tab) to your MongoDB Atlas connection string.');
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
      console.error('👉 Render cannot connect to localhost. Please add MONGO_URI with your MongoDB Atlas URI in the Render Environment settings.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
