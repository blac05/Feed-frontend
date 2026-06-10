import { io } from "socket.io-client";

const socket = io(
  "https://feed-er99.onrender.com"
);

export default socket;