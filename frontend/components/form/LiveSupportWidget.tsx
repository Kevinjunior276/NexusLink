'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveSupportWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, from: 'agent', text: "👋 Bonjour ! Je suis Maria, votre assistante. Comment puis-je vous aider ?", time: "Maintenant" }
    ]);

    const quickReplies = [
        "💳 Problème avec mon compte",
        "⏱️ Délai de réception",
        "🔒 Sécurité des données",
        "📞 Besoin d'assistance"
    ];

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[800] w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full shadow-[0_10px_40px_rgba(0,112,243,0.4)] flex items-center justify-center group hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <X key="close" className="w-6 h-6 text-white" />
                    ) : (
                        <MessageCircle key="open" className="w-6 h-6 text-white animate-pulse" />
                    )}
                </AnimatePresence>

                {/* Online Indicator */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#020308] animate-pulse" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-28 right-6 z-[800] w-[90vw] sm:w-96 glass-card rounded-[24px] border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-wider">Maria - Support</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-bold text-white/80 uppercase">En ligne</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="p-4 space-y-4 max-h-80 overflow-y-auto bg-[#03040b]/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.from === 'agent' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-3 ${msg.from === 'agent' ? 'bg-white/10 text-white' : 'bg-brand-primary text-white'}`}>
                                        <p className="text-xs font-medium">{msg.text}</p>
                                        <span className="text-[9px] opacity-60 mt-1 block">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Replies */}
                        <div className="p-4 border-t border-white/5 bg-[#03040b]/30">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Réponses rapides :</p>
                            <div className="grid grid-cols-2 gap-2">
                                {quickReplies.map((reply, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setMessages([...messages,
                                            { id: messages.length + 1, from: 'user', text: reply, time: "À l'instant" },
                                            { id: messages.length + 2, from: 'agent', text: "Merci ! Un agent va vous répondre dans quelques instants. 🚀", time: "À l'instant" }
                                            ]);
                                        }}
                                        className="text-[9px] font-bold text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2 transition-all text-left"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-[#03040b]/50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tapez votre message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-brand-primary transition-all"
                                />
                                <button className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center hover:bg-brand-primary/80 transition-all">
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
