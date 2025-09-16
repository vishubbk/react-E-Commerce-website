import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AiCenter = () => {
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: "👋 Welcome to Biggest Shopping Mall AI Center! How can I help you with your e-commerce project today?",
    },
  ]);
  const chatEndRef = useRef(null);

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;
    const newChat = [...chat, { sender: "user", text: userMessage }];
    setChat(newChat);
    setMessage("");
    setLoader(true);

    try {
      // Send message to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ai-help`,
        { code: userMessage },
        { withCredentials: true }
      );

      // Backend returns { text: aiResponse }
      const aiReply = response.data.text || "⚠️ Something went wrong. Please try again.";

      setChat([...newChat, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("Error:", error);
      setChat([
        ...newChat,
        { sender: "ai", text: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>

      {/* Chat Window */}
      <div className="flex flex-col items-center mt-20 flex-grow px-5">
        <div className="w-full max-w-2xl flex flex-col bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[65vh]">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm md:text-base ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loader && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-600 text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex items-center border-t border-gray-200 p-3 bg-gray-50">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 outline-none bg-white text-gray-800"
              type="text"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={loader}
              className="ml-3 px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
};

export default AiCenter;
