import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Form = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://api.example.com/chat', { message: userMessage.text });
      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsLoading(false);
      setTimeout(() => {
        const botMessage = { text: `I received your message: "${userMessage.text}". This is a placeholder response.`, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, I am unable to connect right now. Please try again later.', sender: 'bot', error: true };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center font-sans p-4 antialiased">
      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl h-[80vh] flex flex-col border border-gray-700">
        
        {/* Header */}
        <div className="bg-gray-700 p-4 border-b border-gray-600 flex items-center">
          <svg className="w-8 h-8 text-indigo-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zm1 4a1 1 0 100 2h4a1 1 0 100-2H8z" />
          </svg>
          <h1 className="text-xl font-bold text-white">AURA AI</h1>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <TransitionGroup className="space-y-4">
            {messages.map((msg, index) => (
              <CSSTransition
                key={index}
                timeout={300}
                classNames="message"
              >
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-xl p-3 max-w-[75%] shadow-lg ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </CSSTransition>
            ))}
            <CSSTransition
              in={isLoading}
              timeout={300}
              classNames="message"
              unmountOnExit
            >
              <div className="flex justify-start">
                <div className="rounded-xl p-3 max-w-[75%] shadow-lg bg-gray-700 text-gray-200 rounded-bl-none animate-pulse">
                  <div className="w-12 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-600 bg-gray-800 flex items-center">
          <textarea
            className="flex-1 resize-none bg-gray-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            rows="1"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="ml-3 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-colors duration-200 transform hover:scale-105 active:scale-95 disabled:bg-gray-600 disabled:transform-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

      </div>
      
      {/* Custom styles for the scrollbar and transitions */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* gray-700 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563; /* gray-600 */
          border-radius: 20px;
          border: 2px solid #374151; /* gray-700 */
        }
        
        .message-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .message-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        .message-exit {
          opacity: 1;
        }
        .message-exit-active {
          opacity: 0;
          transition: opacity 300ms;
        }
      `}</style>
    </div>
  );
};

export default Form;
