const express = require("express");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

console.log("Loaded API Key:", process.env.GEMINI_API_KEY);

const app = express();
const PORT = 3000;

const server = require("http").createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (message) => {
    console.log("User message:", message);

    const detailedPrompt = `You are an AI assistant helping a user with their inquiry. The user said: "${message}". Please provide a detailed and helpful response based on the context of the message. If the message doesn't require a deep response, answer it in the best way possible. Thank you!`;

    try {
      const result = await model.generateContent(detailedPrompt);
      const aiResponse = result.response.text();

      socket.emit("receiveMessage", aiResponse);
    } catch (error) {
      console.error("Error generating response:", error);

      socket.emit("receiveMessage", `Error: ${error.message}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
