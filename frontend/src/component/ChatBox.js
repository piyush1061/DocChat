import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const ChatContainer = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatSocket = io("http://localhost:9001");
    setSocket(chatSocket);

    chatSocket.emit("join-room", roomId);

    chatSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    chatSocket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      chatSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("send-message", message);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="fixed bottom-0 right-0 mr-4 mb-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <div className="mb-2 bg-gray-200 p-2">Welcome to the Chat Room!</div>
      <div className="h-40 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="break-words">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-2 py-1 border rounded-md mr-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
