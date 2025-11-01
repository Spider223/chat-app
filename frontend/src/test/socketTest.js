import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDU3ZGY0MTVlZmVmZWMxNDA2ODNkZSIsInVzZXJuYW1lIjoibWFkaGFuIiwiaWF0IjoxNzYxOTc2ODQzLCJleHAiOjE3NjE5ODA0NDN9.o8zeglRK16cGQDw-pEUa79LpHvnb_7oKPa89pksNvIs", // must match your socket auth setup
  },
});

socket.on("connect", () => {
  console.log("✅ Connected to socket server with ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("userCountUpdate", (count) => {
  console.log("👥 Total users:", count);
});

socket.on("chatCountUpdate", (count) => {
  console.log("💬 Total messages:", count);
});

socket.emit("sendMessage", "Hello from test client!");
