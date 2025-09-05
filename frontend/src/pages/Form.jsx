import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey Sam! How can I assist you today?" },
  ]);
  const chatEndRef = useRef(null);

  async function buttonClicked(e) {
    e.preventDefault();
    const input = e.target[0].value.trim();
    if (!input) return;

    setMessages((prev) => [...prev, { sender: "human", text: input }]);
    setIsLoading(true);

    try {
      // NOTE: This is a placeholder API call to a local server.
      // In a real application, this would be replaced with a live API endpoint.
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

  const fullText = "Welcome to GenAI!";
  const [displayedText, setDisplayedText] = useState("");

  // Typing effect for the main title
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100); // typing speed in ms

    return () => clearInterval(interval);
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="relative bg-gray-950 text-gray-100 min-h-screen flex flex-col items-center justify-center font-sans p-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080/0d0d0d/1a1a1a?text=Background')" }}></div>
      </div>
      <div className="absolute inset-0 -z-10 bg-black opacity-60"></div>

      {/* Animated Blobs - Enhanced Colors and Animations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-screen filter blur-2xl opacity-40 animate-blob animation-delay-6000"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-white mb-6 animate-pulse-light">
          {displayedText}
          <span className="animate-blink text-purple-400">|</span>
        </h1>
        {/* Chat Box - Refined Design */}
        <div className="bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-purple-900/30 overflow-hidden w-full h-[80vh] flex flex-col border border-purple-800 transition-all duration-300 hover:shadow-purple-700/50">
          {/* Header */}
          <div className="bg-gray-800/90 p-4 border-b border-gray-700 flex items-center">
            <svg
              className="w-8 h-8 text-purple-400 mr-3 animate-spin-slow"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zm1 4a1 1 0 100 2h4a1 1 0 100-2H8z" />
            </svg>
            <h1 className="text-xl font-bold text-white">GEN AI</h1>
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
                  className={`rounded-xl p-3 max-w-[75%] shadow-lg text-sm transition-transform duration-300 transform ${
                    msg.sender === "human"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-indigo-500/30 hover:scale-105"
                      : "bg-gradient-to-br from-gray-800 to-gray-700 text-gray-200 shadow-gray-700/30 hover:scale-105"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl p-3 max-w-[75%] bg-gray-800 text-gray-300 animate-pulse">
                  <div className="w-20 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={buttonClicked}>
            <div className="p-4 border-t border-gray-800 bg-gray-900/80 flex items-center backdrop-blur-md">
              <textarea
                className="flex-1 resize-none bg-gray-800/60 text-white rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200 overflow-hidden max-h-[10rem] placeholder-gray-400"
                rows="1"
                placeholder="Type your message..."
              />
              <button
                className="ml-3 p-4 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all transform hover:scale-110 active:scale-95 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111827; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 10px;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.2); }
          66% { transform: translate(-50px, 70px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }

        @keyframes blink {
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-end infinite; }

        @keyframes pulse-light {
          0%, 100% { filter: drop-shadow(0 0 5px #a855f7); }
          50% { filter: drop-shadow(0 0 10px #c084fc); }
        }
        .animate-pulse-light { animation: pulse-light 3s infinite ease-in-out; }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}</style>
    </div>
  );
};

export default Form;
