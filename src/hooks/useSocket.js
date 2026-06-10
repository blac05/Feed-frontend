import { io } from "socket.io-client";

// Replace 'YOUR_AUTH_TOKEN' with your actual token if needed
const authToken = "YOUR_AUTH_TOKEN"; // e.g., from environment variables

const socket = io("https://feed-er99.onrender.com", {
  auth: {
    token: authToken,
  },
  reconnectionAttempts: 10,    // Number of reconnection attempts
  reconnectionDelay: 2000,     // Delay between reconnection attempts in ms
  timeout: 30000,              // Connection timeout in ms
});

// Connection established
socket.on('connect', () => {
  console.log('Connected to socket server');
});

// Disconnected
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Connection error
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Reconnection attempts
socket.on('reconnect_attempt', () => {
  console.log('Attempting to reconnect...');
});

// Reconnection failed
socket.on('reconnect_failed', () => {
  console.log('Failed to reconnect.');
});

export default socket;