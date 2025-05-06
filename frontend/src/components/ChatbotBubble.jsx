import React, { useState } from 'react';
import api from '../services/api';

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message to chat
    setMessages([...messages, { text: newMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      // Use the api service instead of fetch
      const response = await api.post('/chatbot/query', { 
        query: newMessage 
      });

      setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[450px] bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Skill Hub Assistant</h3>
            <button 
              onClick={toggleChat}
              className="text-white text-xl hover:bg-blue-700 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                Ask me about skills available on the platform!
              </div>
            )}
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[80%] p-2.5 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white self-end rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 text-gray-800 self-start rounded-lg rounded-bl-none max-w-[80%] p-2.5">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            )}
          </div>
          <form 
            className="border-t border-gray-200 p-3 flex gap-2" 
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about skills..."
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button 
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleChat}
          aria-label="Open chat assistant"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatbotBubble;