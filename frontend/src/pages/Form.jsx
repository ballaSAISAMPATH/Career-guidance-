import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Welcome to AURA AI ! How can I assist you today?" },
  ]);

  const chatEndRef = useRef(null);

  async function buttonClicked(e) {
    e.preventDefault();
    const input = e.target[0].value.trim();
    if (!input) return;

    setMessages((prev) => [...prev, { sender: "human", text: input }]);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Oops! Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
      e.target.reset();
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="relative bg-black text-gray-100 min-h-screen flex flex-col items-center justify-center font-sans p-4 overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-2xl opacity-50 animate-fast-blob"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-fast-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-40 animate-fast-blob animation-delay-4000"></div>
      </div>

      {/* Chat Box */}
      <div className="relative z-10 bg-gray-950/70 backdrop-blur-lg  rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl h-[80vh] flex flex-col border border-gray-800">
        {/* Header */}
        <div className="bg-gray-900/90 p-4 border-b border-gray-700 flex items-center">
          <svg
            className="w-8 h-8 text-purple-400 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zm1 4a1 1 0 100 2h4a1 1 0 100-2H8z" />
          </svg>
          <h1 className="text-xl font-bold text-purple-400">AURA AI</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "human" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl p-3 max-w-[75%] shadow-md text-sm ${
                  msg.sender === "human"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-indigo-500/30"
                    : "bg-gradient-to-r from-black-800 to-gray-700 text-gray-200 shadow-gray-700/30"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl p-3 max-w-[75%] bg-gray-800 text-gray-300 animate-pulse">
                <div className="w-16 h-4 bg-gray-600 rounded"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={buttonClicked}>
          <div className="p-4 border-t border-gray-800 bg-gray-900/80 flex items-center backdrop-blur-md">
            <textarea
              className="flex-1 resize-none bg-gray-800/60 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 overflow-hidden max-h-[10rem] placeholder-gray-400"
              rows="1"
              placeholder="Type your message..."
            />
            <button
              className="ml-3 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all transform hover:scale-110 active:scale-95 disabled:bg-gray-600"
              disabled={isLoading}
            >
              <svg
                className="rotate-180"
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1.2em"
                width="1.2em"
              >
                <path d="M22 2v20l-22-10zm-19 10l17 8.5-2-8.5-15-2-0 0zm17-0.5l-17-2.5 15-2.5-0 5z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111827; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 10px;
        }

        @keyframes fast-blob {
          0% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(40px, -60px) scale(1.15); }
          50% { transform: translate(-30px, 30px) scale(0.9); }
          75% { transform: translate(20px, 50px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fast-blob {
          animation: fast-blob 10s infinite ease-in-out;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Form;
