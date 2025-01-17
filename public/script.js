const socket = io();

const messagesDiv = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const sendButton = chatForm.querySelector("button");

function disableInput() {
  chatInput.disabled = true;
  sendButton.disabled = true;
}

function enableInput() {
  chatInput.disabled = false;
  sendButton.disabled = false;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value;

  if (message.trim() === "") return;

  displayMessage(`You: ${message}`, false);

  disableInput();

  socket.emit("sendMessage", message);

  chatInput.value = "";
});

socket.on("receiveMessage", (message) => {
  displayAIMessageWithTypingEffect(message);
});

function displayMessage(message, isAI = false) {
  const div = document.createElement("div");
  div.classList.add(isAI ? "ai-message" : "user-message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  messageContent.innerHTML = message;

  div.appendChild(messageContent);
  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displayAIMessageWithTypingEffect(message) {
  const div = document.createElement("div");
  div.classList.add("ai-message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.innerHTML = "";

  div.appendChild(messageContent);
  messagesDiv.appendChild(div);

  let index = 0;
  const typingSpeed = 20;
  const typingInterval = setInterval(() => {
    messageContent.innerHTML += message[index];
    index++;

    if (index === message.length) {
      clearInterval(typingInterval);

      enableInput();
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, typingSpeed);
}
