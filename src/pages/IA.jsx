import React, { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, Activity, Target, X, Maximize2, Minimize2 } from 'lucide-react';

const IA = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Bonjour ! Je suis votre assistant de trading IA VIDAR. Comment puis-je vous aider aujourd'hui ?",
      time: '10:30',
      analysis: null
    },
    {
      id: 2,
      type: 'user',
      text: "Quelle est votre analyse actuelle du marché EUR/USD ?",
      time: '10:32',
      analysis: null
    },
    {
      id: 3,
      type: 'bot',
      text: "Basé sur mon analyse actuelle, j'ai identifié une opportunité d'achat sur EUR/USD. Voici mes observations :",
      time: '10:32',
      analysis: {
        pair: "EUR/USD",
        action: "ACHETER",
        confidence: 87,
        entry: 1.0847,
        stopLoss: 1.0820,
        target: 1.0890,
        details: [
          "Structure haussière détectée avec zone de demande confirmée au niveau 1.0820",
          "RSI indique une tendance haussière",
          "Confluence avec EMA 50",
          "Niveau de confiance : 87%"
        ]
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        analysis: null
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: "J'ai analysé votre demande. Voici mes recommandations basées sur les données de marché actuelles...",
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          analysis: Math.random() > 0.5 ? {
            pair: ["EUR/USD", "GBP/USD", "USD/JPY"][Math.floor(Math.random() * 3)],
            action: Math.random() > 0.5 ? "ACHETER" : "VENDRE",
            confidence: Math.floor(Math.random() * 30) + 70,
            entry: (Math.random() * 0.5 + 1.08).toFixed(4),
            stopLoss: (Math.random() * 0.5 + 1.07).toFixed(4),
            target: (Math.random() * 0.5 + 1.09).toFixed(4),
            details: [
              "Analyse technique favorable",
              "Convergence des indicateurs",
              "Bon ratio risque/rendement"
            ]
          } : null
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { text: "Analyse EUR/USD", prompt: "Donne-moi une analyse technique détaillée de EUR/USD" },
    { text: "Meilleur trade", prompt: "Quelle est la meilleure opportunité de trading en ce moment ?" },
    { text: "Performance IA", prompt: "Montre-moi tes performances et statistiques récentes" },
    { text: "Risques marché", prompt: "Quels sont les risques principaux sur les marchés aujourd'hui ?" }
  ];

  const handleQuickAction = (prompt) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black">
      {/* Mobile: Dashboard at top | Desktop: Hidden */}
      <div className="lg:hidden w-full border-b border-gray-800 flex-shrink-0">
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          <h3 className="text-white font-semibold text-sm sm:text-base">Dashboard Trading</h3>

          {/* IA Active Card */}
          <div 
            className="border rounded-2xl p-4 sm:p-5"
            style={{
              borderColor: 'rgba(0, 184, 230, 0.3)',
              background: 'linear-gradient(135deg, rgba(0, 26, 40, 0.8) 0%, rgba(0, 115, 182, 0.8) 100%)',
              boxShadow: '0 0 30px rgba(0, 115, 182, 0.2), inset 0 0 20px rgba(0, 115, 182, 00.1)'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-cyan-400 text-xs font-semibold">IA ACTIVE</span>
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Décision Actuelle</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-gray-300">Paire:</span><span className="text-white font-bold">EUR/USD</span></div>
              <div className="flex justify-between"><span className="text-gray-300">Action:</span><span className="text-green-400 font-bold">ACHETER</span></div>
              <div className="flex justify-between"><span className="text-gray-300">Confiance:</span><span className="text-white font-bold">87%</span></div>
              <div className="mt-3 sm:mt-4">
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="border rounded-xl p-3 sm:p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center"><TrendingUp size={14} className="text-cyan-400" /></div></div>
              <p className="text-gray-400 text-xs mb-1">Trades ouverts</p><p className="text-white text-lg sm:text-xl font-bold">3</p>
            </div>
            <div className="border rounded-xl p-3 sm:p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-green-900/30 flex items-center justify-center"><Activity size={14} className="text-green-400" /></div></div>
              <p className="text-gray-400 text-xs mb-1">Performance</p><p className="text-green-400 text-lg sm:text-xl font-bold">+2.3%</p>
            </div>
            <div className="border rounded-xl p-3 sm:p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center"><Target size={14} className="text-purple-400" /></div></div>
              <p className="text-gray-400 text-xs mb-1">Succès</p><p className="text-white text-lg sm:text-xl font-bold">78%</p>
            </div>
            <div className="border rounded-xl p-3 sm:p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-orange-900/30 flex items-center justify-center"><Activity size={14} className="text-orange-400" /></div></div>
              <p className="text-gray-400 text-xs mb-1">Volatilité</p><p className="text-orange-400 text-lg sm:text-xl font-bold">15%</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">Activité Récente</h4>
            <div className="space-y-3">
              <div className="border rounded-xl p-3" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
                <div className="flex justify-between items-start mb-2"><div><p className="text-white text-sm font-semibold">EUR/USD</p><p className="text-green-400 text-xs font-medium">ACHETER</p></div><span className="text-gray-500 text-xs">10:32</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">En cours</span><span className="text-cyan-400 font-medium">+0.8%</span></div>
              </div>
              <div className="border rounded-xl p-3" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
                <div className="flex justify-between items-start mb-2"><div><p className="text-white text-sm font-semibold">GBP/USD</p><p className="text-red-400 text-xs font-medium">VENDRE</p></div><span className="text-gray-500 text-xs">09:15</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Terminé</span><span className="text-green-400 font-medium">+1.2%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 bg-black flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <h1 className="text-white font-semibold text-base sm:text-lg">Assistant Trading VIDAR</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500 transition-all lg:hidden"
            >
              {isSidebarOpen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 sm:space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 sm:gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                message.type === 'bot' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-gray-600 to-gray-800'
              }`}>
                {message.type === 'bot' ? 'V' : 'U'}
              </div>
              <div className={`flex-1 max-w-full sm:max-w-2xl ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl p-4 sm:p-5 inline-block w-full ${
                  message.type === 'bot' 
                    ? 'bg-gray-900/80 text-gray-200 border border-gray-800' 
                    : 'bg-gradient-to-br from-blue-900/30 to-cyan-900/20 text-gray-300 border border-blue-800/30'
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  {message.analysis && (
                    <div className="mt-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-cyan-400 text-xs font-semibold">RECOMMANDATION IA</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs sm:text-sm">
                        <div><span className="text-gray-400">Paire:</span><p className="text-white font-semibold">{message.analysis.pair}</p></div>
                        <div><span className="text-gray-400">Action:</span><p className={`font-semibold ${message.analysis.action === 'ACHETER' ? 'text-green-400' : 'text-red-400'}`}>{message.analysis.action}</p></div>
                        <div><span className="text-gray-400">Entrée:</span><p className="text-white font-semibold">{message.analysis.entry}</p></div>
                        <div><span className="text-gray-400">Confiance:</span><p className="text-white font-semibold">{message.analysis.confidence}%</p></div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div className={`h-2 rounded-full transition-all duration-1000 ${
                          message.analysis.confidence > 80 ? 'bg-gradient-to-r from-green-500 to-cyan-500' :
                          message.analysis.confidence > 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`} style={{ width: `${message.analysis.confidence}%` }}></div>
                      </div>
                      <div className="space-y-1">
                        {message.analysis.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                            <span className="text-gray-300 text-xs">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2 inline-block">{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-800">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((a, i) => (
              <button key={i} onClick={() => handleQuickAction(a.prompt)}
                className="px-3 sm:px-4 py-2 rounded-full text-xs text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all whitespace-nowrap flex-shrink-0">
                {a.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez une question..."
                rows={1}
                className="w-full bg-gray-900 text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxHeight: '120px' }}
              />
              <style jsx>{`textarea::-webkit-scrollbar { display: none; }`}</style>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-3 rounded-2xl text-white transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)', boxShadow: '0 0 20px rgba(0, 115, 182, 0.3)' }}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">VIDAR AI peut faire des erreurs. Vérifiez avant de trader.</p>
        </div>
      </div>

      {/* Desktop Sidebar */}
      {isSidebarOpen && (
        <div className="hidden lg:block w-80 bg-black border-l border-gray-800 overflow-y-auto  transition-all duration-300" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Dashboard Trading</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <X size={16} />
              </button>
            </div>
            {/* Same as mobile dashboard, but vertical */}
            <div className="border rounded-2xl p-5" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'linear-gradient(135deg, rgba(0, 26, 40, 0.8) 0%, rgba(0, 115, 182, 0.8) 100%)', boxShadow: '0 0 30px rgba(0, 115, 182, 0.2), inset 0 0 20px rgba(0, 115, 182, 0.1)' }}>
              <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div><span className="text-cyan-400 text-xs font-semibold">IA ACTIVE</span></div>
              <h3 className="text-white font-bold text-lg mb-4">Décision Actuelle</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-300 text-sm">Paire:</span><span className="text-white font-bold text-sm">EUR/USD</span></div>
                <div className="flex justify-between"><span className="text-gray-300 text-sm">Action:</span><span className="text-green-400 font-bold text-sm">ACHETER</span></div>
                <div className="flex justify-between"><span className="text-gray-300 text-sm">Confiance:</span><span className="text-white font-bold text-sm">87%</span></div>
                <div className="mt-4"><div className="w-full bg-gray-800 rounded-full h-2.5"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: '87%' }}></div></div></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-xl p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center"><TrendingUp size={16} className="text-cyan-400" /></div></div><p className="text-gray-400 text-xs mb-1">Trades ouverts</p><p className="text-white text-xl font-bold">3</p></div>
              <div className="border rounded-xl p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-green-900/30 flex items-center justify-center"><Activity size={16} className="text-green-400" /></div></div><p className="text-gray-400 text-xs mb-1">Performance</p><p className="text-green-400 text-xl font-bold">+2.3%</p></div>
              <div className="border rounded-xl p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center"><Target size={16} className="text-purple-400" /></div></div><p className="text-gray-400 text-xs mb-1">Succès</p><p className="text-white text-xl font-bold">78%</p></div>
              <div className="border rounded-xl p-4" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-orange-900/30 flex items-center justify-center"><Activity size={16} className="text-orange-400" /></div></div><p className="text-gray-400 text-xs mb-1">Volatilité</p><p className="text-orange-400 text-xl font-bold">15%</p></div>
            </div>
            <div>
              <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">Activité Récente</h4>
              <div className="space-y-3">
                <div className="border rounded-xl p-3" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
                  <div className="flex justify-between items-start mb-2"><div><p className="text-white text-sm font-semibold">EUR/USD</p><p className="text-green-400 text-xs font-medium">ACHETER</p></div><span className="text-gray-500 text-xs">10:32</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-xs">En cours</span><span className="text-cyan-400 text-xs font-medium">+0.8%</span></div>
                </div>
                <div className="border rounded-xl p-3" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
                  <div className="flex justify-between items-start mb-2"><div><p className="text-white text-sm font-semibold">GBP/USD</p><p className="text-red-400 text-xs font-medium">VENDRE</p></div><span className="text-gray-500 text-xs">09:15</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 text-xs">Terminé</span><span className="text-green-400 text-xs font-medium">+1.2%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IA;