import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, ThumbsUp, ThumbsDown, RefreshCw, X, TrendingUp, Activity, Target, Maximize2, Minimize2 } from 'lucide-react';

const IA = () => {
  // ✅ FIXED: Correct Backend URL
  // const API_BASE_URL = 'http://localhost:8000';
 const API_BASE_URL = '/api';
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // ✅ FIXED: Better health check
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (res.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (err) {
      console.error('Health check error:', err);
      setBackendStatus('error');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileUpload([file]);
          break;
        }
      }
    }
  };

  // ✅ FIXED: Proper file upload handler
  const handleFileUpload = async (files) => {
    if (files.length === 0) return;
    
    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const uploadRes = await fetch(`${API_BASE_URL}/context/learn_paths`, {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.detail || `Upload failed: ${uploadRes.status}`);
      }

      const result = await uploadRes.json();

      const uploaded = files.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
      }));

      setUploadedFiles(prev => [...prev, ...uploaded]);

      const uploadMsg = {
        id: Date.now(),
        type: 'bot',
        text: `✅ Fichier(s) chargé(s) avec succès : ${result.files.join(', ')}. Vous pouvez maintenant poser des questions à leur sujet.`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        analysis: null
      };
      setMessages(prev => [...prev, uploadMsg]);

    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = {
        id: Date.now(),
        type: 'bot',
        text: `❌ Erreur lors du chargement du fichier: ${err.message}`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        analysis: null
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) handleFileUpload(files);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) handleFileUpload(files);
  };

  // ✅ FIXED: Proper API communication
  const sendToAI = async (question, messageId = null) => {
    const endpoint = uploadedFiles.length > 0 ? '/chat/mixed' : '/chat';

    try {
      const requestBody = {
        question: question,
        symbols: ["EURUSD", "GBPJPY"]
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorDetail = `API error: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch (e) {
          // Response wasn't JSON
        }
        throw new Error(errorDetail);
      }

      const data = await res.json();
      
      const aiResponse = {
        id: messageId || Date.now(),
        type: 'bot',
        text: data.answer || "Je n'ai pas pu générer de réponse. Veuillez réessayer.",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        analysis: null
      };

      if (messageId) {
        setMessages(prev => prev.map(msg => msg.id === messageId ? aiResponse : msg));
      } else {
        setMessages(prev => [...prev, aiResponse]);
      }

      return aiResponse;

    } catch (err) {
      console.error('Chat error:', err);
      
      let errorMessage = err.message;
      if (err.name === 'AbortError') {
        errorMessage = 'Timeout: Le serveur met trop de temps à répondre. Assurez-vous que le backend fonctionne.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = `Impossible de se connecter au serveur. Vérifiez que le backend fonctionne sur ${API_BASE_URL}`;
      }

      const errorMsg = {
        id: messageId || Date.now(),
        type: 'bot',
        text: `❌ Erreur: ${errorMessage}`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        analysis: null
      };

      if (messageId) {
        setMessages(prev => prev.map(msg => msg.id === messageId ? errorMsg : msg));
      } else {
        setMessages(prev => [...prev, errorMsg]);
      }
      return errorMsg;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      analysis: null
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    
    setIsLoading(true);
    await sendToAI(currentInput);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = async (messageId, isPositive) => {
    if (isPositive) {
      const feedbackMsg = {
        id: Date.now(),
        type: 'bot',
        text: "Merci pour votre feedback positif ! 👍",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        analysis: null
      };
      setMessages(prev => [...prev, feedbackMsg]);
    } else {
      setRegeneratingMessageId(messageId);
      
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex > 0) {
        const userMessage = messages[messageIndex - 1];
        if (userMessage.type === 'user') {
          await sendToAI(userMessage.text, messageId);
        } else {
          await sendToAI("Peux-tu reformuler ou améliorer ta réponse précédente ?", messageId);
        }
      } else {
        await sendToAI("Peux-tu reformuler ou améliorer ta réponse précédente ?", messageId);
      }
      
      setRegeneratingMessageId(null);
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
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black">
      {backendStatus === 'error' && (
        <div className="w-full bg-red-900/20 border-b border-red-500/30 px-4 py-2 z-50">
          <p className="text-red-400 text-sm">⚠️ Backend non connecté. Assurez-vous que le serveur fonctionne sur {API_BASE_URL}</p>
        </div>
      )}

      <div className="lg:hidden w-full border-b border-gray-800 flex-shrink-0">
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          <h3 className="text-white font-semibold text-sm sm:text-base">Dashboard Trading</h3>

          <div 
            className="border rounded-2xl p-4 sm:p-5"
            style={{
              borderColor: 'rgba(0, 184, 230, 0.3)',
              background: 'linear-gradient(135deg, rgba(0, 26, 40, 0.8) 0%, rgba(0, 115, 182, 0.8) 100%)',
              boxShadow: '0 0 30px rgba(0, 115, 182, 0.2), inset 0 0 20px rgba(0, 115, 182, 0.1)'
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

          <div>
            <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">Activité Récente</h4>
            <div className="space-y-3">
              <div className="border rounded-xl p-3" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
                <div className="flex justify-between items-start mb-2"><div><p className="text-white text-sm font-semibold">EUR/USD</p><p className="text-green-400 text-xs font-medium">ACHETER</p></div><span className="text-gray-500 text-xs">10:32</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">En cours</span><span className="text-cyan-400 font-medium">+0.8%</span></div>
              </div>
              <div className="border rounded-xl p-3" style={{ borderColor: 'rgba(0, 184, 230, 0.3)', background: 'rgba(0, 26, 40, 0.5)' }}>
                <div className="flex justify-between items-start mb-2"><div><p className="text-white text-sm font-semibold">GBP/USD</p><p className="text-red-400 text-xs font-medium">VENDRE</p></div><span className="text-gray-500 text-xs">09:15</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Terminé</span><span className="text-green-400 text-xs font-medium">+1.2%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black flex flex-col">
        <div className="border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${backendStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                  {regeneratingMessageId === message.id ? (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-sm">Régénération de la réponse...</span>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                  
                  {message.type === 'bot' && regeneratingMessageId !== message.id && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700 flex-wrap">
                      <span className="text-xs text-gray-400 w-full">Cette réponse était-elle utile?</span>
                      <button
                        onClick={() => handleFeedback(message.id, true)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-all"
                      >
                        <ThumbsUp size={12} />
                        Oui
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, false)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        <ThumbsDown size={12} />
                        Non
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2 inline-block">{message.time}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-600">
                V
              </div>
              <div className="flex-1 max-w-full sm:max-w-2xl">
                <div className="rounded-2xl p-4 sm:p-5 inline-block bg-gray-900/80 text-gray-200 border border-gray-800">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <RefreshCw size={16} className="animate-spin" />
                    <span className="text-sm">En cours de traitement...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

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

        <div className="p-4 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
          {uploadedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                  <FileText size={14} className="text-cyan-400" />
                  <span className="max-w-32 truncate">{file.name}</span>
                  <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-red-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                placeholder="Posez une question ou collez une image..."
                rows={1}
                disabled={isLoading}
                className="w-full bg-gray-900 text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxHeight: '120px' }}
              />
              <style jsx>{`textarea::-webkit-scrollbar { display: none; }`}</style>
            </div>

            <label className="p-3 rounded-2xl text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer transition-all flex items-center justify-center" style={{opacity: isUploading ? 0.5 : 1, pointerEvents: isUploading ? 'none' : 'auto'}}>
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileText size={18} />
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            <label className="p-3 rounded-2xl text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer transition-all flex items-center justify-center" style={{opacity: isUploading ? 0.5 : 1, pointerEvents: isUploading ? 'none' : 'auto'}}>
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileText size={18} />
              )}
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading || isUploading}
              className="p-3 rounded-2xl text-white transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)', boxShadow: '0 0 20px rgba(0, 115, 182, 0.3)' }}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">VIDAR AI peut faire des erreurs. Vérifiez avant de trader.</p>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="hidden lg:block w-80 bg-black border-l border-gray-800 overflow-y-auto transition-all duration-300" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Dashboard Trading</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <X size={16} />
              </button>
            </div>
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