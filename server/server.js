const http = require('http');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const { initializeSocket } = require('./config/socket');
const { configureCloudinary } = require('./config/cloudinary');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Configure Cloudinary (optional)
configureCloudinary();

// Connect to database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
