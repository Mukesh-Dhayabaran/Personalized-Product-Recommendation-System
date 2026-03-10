import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hi! I am your AuraRec shopping assistant. How can I help you find the perfect product today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "You are a helpful shopping assistant for AuraRec. You have access to a product catalog. Recommend products based on user needs. Keep responses concise and friendly."
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-8 h-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-96 h-[600px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Aura Assistant</h3>
                  <p className="text-blue-100 text-xs">Powered by Gemini AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full pl-4 pr-12 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
