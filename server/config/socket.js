const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Join role-based room
    socket.join(`role:${socket.userRole}`);

    // Handle joining course rooms
    socket.on('join:course', (courseId) => {
      socket.join(`course:${courseId}`);
    });

    // Handle joining conversation rooms
    socket.on('join:conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Handle chat messages
    socket.on('send:message', (data) => {
      io.to(`conversation:${data.conversationId}`).emit('new:message', data);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    socket.on('stop:typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:stop:typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
