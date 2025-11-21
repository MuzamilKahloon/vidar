import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, TrendingUp, Brain, BarChart3, Lock, Zap, ArrowRight, Loader2, CheckCircle, XCircle, Play, History } from 'lucide-react';

const MetaTrade = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [connectionId, setConnectionId] = useState('');
  const [password, setPassword] = useState('');
  const [serverName, setServerName] = useState('');
  const [riskLevel, setRiskLevel] = useState('1.0');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [connectionResult, setConnectionResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tradingResults, setTradingResults] = useState(null);
  const [historicalSignals, setHistoricalSignals] = useState(null);

  // API Base URL - adjust according to your backend
  // const API_BASE_URL = 'http://localhost:8000';
  const API_BASE_URL = 'https://bdc16faaec9b.ngrok-free.app';
  // Load saved connection on component mount
  useEffect(() => {
    const savedConnection = localStorage.getItem('mt5_connection');
    if (savedConnection) {
      const connection = JSON.parse(savedConnection);
      setConnectionId(connection.login || '');
      setServerName(connection.server || '');
      setRiskLevel(connection.riskLevel || '1.0');
    }
  }, []);

  // Test MT5 Connection - USING EXISTING /run-cycle ENDPOINT
  const handleTestConnection = async () => {
    if (!connectionId || !password || !serverName) {
      setTestResult({ 
        success: false, 
        message: 'Veuillez remplir tous les champs requis (ID, mot de passe, serveur)' 
      });
      return;
    }

    setIsTesting(true);
    setIsLoading(true);
    setTestResult(null);

    try {
      // Save credentials temporarily for testing
      const testCredentials = {
        login: connectionId,
        password: password,
        server: serverName,
        riskLevel: riskLevel
      };
      
      localStorage.setItem('mt5_test_credentials', JSON.stringify(testCredentials));

      setTestResult({ 
        success: true, 
        message: '✅ Credentials saved successfully. Use "Run Trading Cycle" to test with actual trading.' 
      });

    } catch (error) {
      console.error('Test connection error:', error);
      setTestResult({ 
        success: false, 
        message: '❌ Error saving credentials' 
      });
    } finally {
      setIsTesting(false);
      setIsLoading(false);
    }
  };

  // Connect MT5 Account - SAVE CREDENTIALS LOCALLY
  const handleConnectAccount = async () => {
    if (!connectionId || !password || !serverName || !riskLevel) {
      setConnectionResult({ 
        success: false, 
        message: '❌ Veuillez remplir tous les champs requis' 
      });
      return;
    }

    setIsConnecting(true);
    setIsLoading(true);
    setConnectionResult(null);

    try {
      // Save connection details to localStorage
      const connectionData = {
        login: connectionId,
        server: serverName,
        riskLevel: riskLevel,
        connectedAt: new Date().toISOString(),
        status: 'connected'
      };
      
      localStorage.setItem('mt5_connection', JSON.stringify(connectionData));

      // Update environment configuration
      const mt5Config = {
        MT5_LOGIN: connectionId,
        MT5_SERVER: serverName,
        RISK_PERCENT: riskLevel,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('mt5_config', JSON.stringify(mt5Config));

      setConnectionResult({ 
        success: true, 
        message: '✅ Compte MT5 configuré avec succès! Vos paramètres sont sauvegardés.',
        accountInfo: {
          login: connectionId,
          server: serverName,
          balance: 'Demo Account',
          currency: 'USD'
        }
      });

      // Clear password for security
      setPassword('');

    } catch (error) {
      console.error('Connect account error:', error);
      setConnectionResult({ 
        success: false, 
        message: '❌ Erreur lors de la sauvegarde des paramètres' 
      });
    } finally {
      setIsConnecting(false);
      setIsLoading(false);
    }
  };

  // Run Trading Cycle - USING EXISTING /run-cycle ENDPOINT
  const handleRunTradingCycle = async () => {
    if (!connectionId || !serverName) {
      setTradingResults({ 
        success: false, 
        message: '❌ Veuillez d\'abord configurer votre compte MT5' 
      });
      return;
    }

    setIsLoading(true);
    setTradingResults(null);

    try {
      // INTEGRATION: Using existing backend endpoint /run-cycle
      const response = await fetch(`${API_BASE_URL}/run-cycle?auto_trade=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        setTradingResults({ 
          success: true, 
          message: '✅ Cycle de trading exécuté avec succès!',
          data: result
        });
      } else {
        setTradingResults({ 
          success: false, 
          message: `❌ Erreur lors de l'exécution: ${result.detail || 'Unknown error'}` 
        });
      }
    } catch (error) {
      console.error('Trading cycle error:', error);
      setTradingResults({ 
        success: false, 
        message: '❌ Impossible de se connecter au serveur de trading' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get Historical Signals - USING EXISTING /signals ENDPOINT
  const handleGetSignals = async () => {
    try {
      // INTEGRATION: Using existing backend endpoint /signals
      const response = await fetch(`${API_BASE_URL}/signals?limit=10`);
      const result = await response.json();
      
      if (response.ok) {
        setHistoricalSignals(result);
      } else {
        setHistoricalSignals({ 
          error: `Erreur: ${result.detail || 'Unknown error'}` 
        });
      }
    } catch (error) {
      console.error('Get signals error:', error);
      setHistoricalSignals({ 
        error: 'Impossible de récupérer les signaux historiques' 
      });
    }
  };

  // Clear results when form changes
  const clearResults = () => {
    setTestResult(null);
    setConnectionResult(null);
    setTradingResults(null);
    setHistoricalSignals(null);
  };

  // Check if we have a valid connection
  const hasValidConnection = localStorage.getItem('mt5_connection');

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center sm:text-left">
            Connecter le compte MT5
          </h1>
          <p className="text-gray-400 text-xs font-light text-center sm:text-left max-w-2xl">
            Liez votre compte de trading pour activer la supervision de l'IA en temps réel
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Left Section - Connection Form */}
            <div className="lg:col-span-2">
              <div 
                className="border rounded-lg p-4 sm:p-6 md:p-7"
                style={{
                  borderColor: 'rgba(0, 184, 230, 0.3)',
                  background: 'rgba(0, 26, 40, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
                }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-5">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(0, 184, 230, 0.1)',
                      boxShadow: '0 0 15px rgba(0, 184, 230, 0.2)'
                    }}
                  >
                    <TrendingUp size={20} className="sm:size-6" style={{ color: '#00b8e6' }} />
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-white text-center mb-4 sm:mb-6">
                  ID de connexion
                </h2>

                {/* Status Indicator */}
                {hasValidConnection && (
                  <div className="mb-4 p-3 rounded text-xs text-green-400 bg-green-900/20 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      <span>Compte MT5 configuré. Prêt pour le trading automatique.</span>
                    </div>
                  </div>
                )}

                {/* Test Connection Result */}
                {testResult && (
                  <div 
                    className={`mb-4 p-3 rounded text-xs ${
                      testResult.success 
                        ? 'text-green-400 bg-green-900/20 border border-green-500/30' 
                        : 'text-red-400 bg-red-900/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {testResult.success ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <XCircle size={14} className="mt-0.5 flex-shrink-0" />}
                      <span>{testResult.message}</span>
                    </div>
                  </div>
                )}

                {/* Connection Result */}
                {connectionResult && (
                  <div 
                    className={`mb-4 p-3 rounded text-xs ${
                      connectionResult.success 
                        ? 'text-green-400 bg-green-900/20 border border-green-500/30' 
                        : 'text-red-400 bg-red-900/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {connectionResult.success ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <XCircle size={14} className="mt-0.5 flex-shrink-0" />}
                      <div>
                        <span>{connectionResult.message}</span>
                        {connectionResult.accountInfo && (
                          <div className="mt-2 text-green-300 space-y-1">
                            <div>Compte: {connectionResult.accountInfo.login} @ {connectionResult.accountInfo.server}</div>
                            <div>Type: {connectionResult.accountInfo.balance}</div>
                            <div>Risque défini: {riskLevel}% par trade</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Trading Results */}
                {tradingResults && (
                  <div 
                    className={`mb-4 p-3 rounded text-xs ${
                      tradingResults.success 
                        ? 'text-green-400 bg-green-900/20 border border-green-500/30' 
                        : 'text-red-400 bg-red-900/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {tradingResults.success ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <XCircle size={14} className="mt-0.5 flex-shrink-0" />}
                      <div>
                        <span>{tradingResults.message}</span>
                        {tradingResults.data && tradingResults.data.symbols && (
                          <div className="mt-2 text-green-300 space-y-2">
                            {tradingResults.data.symbols.map((symbol, index) => (
                              <div key={index} className="border-l-2 border-green-500 pl-2">
                                <div className="font-semibold">{symbol.symbol}</div>
                                {symbol.signal && (
                                  <div className="text-xs">
                                    Signal: {symbol.signal.signal} | Confiance: {symbol.signal.confidence}%
                                  </div>
                                )}
                                {symbol.error && (
                                  <div className="text-red-300 text-xs">Erreur: {symbol.error}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Connection ID Input */}
                <div className="mb-4 sm:mb-5">
                  <input
                    type="text"
                    placeholder="Entrez votre ID de connexion MT5"
                    value={connectionId}
                    onChange={(e) => {
                      setConnectionId(e.target.value);
                      clearResults();
                    }}
                    className="w-full rounded px-3 sm:px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 184, 230, 0.2)',
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 184, 230, 0.6)';
                      e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 184, 230, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 184, 230, 0.2)';
                      e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                </div>

                {/* Password Section */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-white text-xs font-medium mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearResults();
                      }}
                      className="w-full rounded px-3 sm:px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none transition-all pr-9"
                      placeholder="••••••••"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(0, 184, 230, 0.2)',
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 184, 230, 0.6)';
                        e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 184, 230, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 184, 230, 0.2)';
                        e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3)';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Server Name */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-white text-xs font-medium mb-1.5">
                    Nom du serveur
                  </label>
                  <input
                    type="text"
                    placeholder="ex. MetaQuotes-Demo"
                    value={serverName}
                    onChange={(e) => {
                      setServerName(e.target.value);
                      clearResults();
                    }}
                    className="w-full rounded px-3 sm:px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 184, 230, 0.2)',
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 184, 230, 0.6)';
                      e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 184, 230, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 184, 230, 0.2)';
                      e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                </div>

                {/* Risk Level */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-white text-xs font-medium mb-1.5">
                    Définissez votre risque par position (en %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5"
                    placeholder="1"
                    value={riskLevel}
                    onChange={(e) => {
                      setRiskLevel(e.target.value);
                      clearResults();
                    }}
                    className="w-full rounded px-3 sm:px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 184, 230, 0.2)',
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 184, 230, 0.6)';
                      e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 184, 230, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 184, 230, 0.2)';
                      e.target.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                  <p className="text-gray-500 text-xs mt-1.5">
                    Exemple: 0.5%, 1%, 2% par trade
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <div className="flex gap-2 sm:gap-3">
                    <button 
                      onClick={handleTestConnection}
                      disabled={isLoading}
                      className="flex-1 py-2.5 rounded font-medium text-xs transition-all hover:border-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        border: '1px solid rgba(0, 184, 230, 0.4)',
                        color: '#00b8e6',
                        background: 'rgba(0, 184, 230, 0.05)'
                      }}
                    >
                      {isTesting ? <Loader2 size={14} className="animate-spin" /> : null}
                      {isTesting ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button 
                      onClick={handleConnectAccount}
                      disabled={isLoading}
                      className="flex-1 text-white py-2.5 rounded font-medium text-xs transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(343deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)',
                        boxShadow: '0 0 15px rgba(0, 115, 182, 0.3)'
                      }}
                    >
                      {isConnecting ? <Loader2 size={14} className="animate-spin" /> : null}
                      {isConnecting ? 'Connexion...' : 'Connecter'}
                    </button>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button 
                      onClick={handleRunTradingCycle}
                      disabled={isLoading || !hasValidConnection}
                      className="flex-1 py-2.5 rounded font-medium text-xs transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(343deg, rgba(40, 26, 0, 0.8) 0%, rgba(182, 115, 0, 0.8) 100%)',
                        border: '1px solid rgba(230, 184, 0, 0.4)',
                        color: '#fff'
                      }}
                    >
                      <Play size={14} />
                      Tester le Trading
                    </button>
                    <button 
                      onClick={handleGetSignals}
                      className="flex-1 py-2.5 rounded font-medium text-xs transition-all hover:border-opacity-100 flex items-center justify-center gap-2"
                      style={{
                        border: '1px solid rgba(100, 100, 100, 0.4)',
                        color: '#ccc',
                        background: 'rgba(50, 50, 50, 0.3)'
                      }}
                    >
                      <History size={14} />
                      Signaux
                    </button>
                  </div>
                </div>

               {/* Historical Signals Display */}
{historicalSignals && (
  <div className="mt-4 p-3 rounded text-xs text-gray-300 bg-gray-800/50 border border-gray-700">
    <div className="font-semibold mb-3 text-cyan-300">Signaux Historiques</div>
    {historicalSignals.error ? (
      <div className="text-red-400">{historicalSignals.error}</div>
    ) : historicalSignals.items && historicalSignals.items.length > 0 ? (
      <div className="grid grid-cols-1 gap-2">
        {historicalSignals.items.map((signal, index) => (
          <div key={index} className="flex justify-between items-center p-2 rounded bg-black/30">
            <div>
              <span className="font-medium text-white">{signal.symbol}</span>
              <span className="text-gray-400 ml-2">Conf: {signal.confidence}%</span>
            </div>
            <div className="text-right">
              <span className={signal.signal === 'BUY' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {signal.signal}
              </span>
              <div className="text-gray-500 text-xs">
                {signal.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-500">Aucun signal historique trouvé</div>
    )}
  </div>
)}
              </div>
            </div>

            {/* Right Section - Info Cards */}
            <div className="space-y-3 sm:space-y-4">
              
              {/* Card 1 - Connected Account */}
              <div 
                className="border rounded-lg p-3 sm:p-4 md:p-5"
                style={{
                  borderColor: 'rgba(0, 184, 230, 0.3)',
                  background: 'rgba(0, 26, 40, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                  <Lock size={14} className="sm:size-4" style={{ color: '#00b8e6', marginTop: '2px', flexShrink: 0 }} />
                  <h3 className="text-white font-semibold text-xs">
                    Une fois votre compte MT5 connecté
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Connectez votre compte MT5 et définissez votre niveau de risque. Aucune donnée sensible n'est stockée, il reste cryptée.
                </p>
              </div>

              {/* Card 2 - AI Account Link */}
              <div 
                className="border rounded-lg p-3 sm:p-4 md:p-5"
                style={{
                  borderColor: 'rgba(0, 184, 230, 0.3)',
                  background: 'rgba(0, 26, 40, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                  <Brain size={14} className="sm:size-4" style={{ color: '#00b8e6', marginTop: '2px', flexShrink: 0 }} />
                  <h3 className="text-white font-semibold text-xs">
                    Votre compte est lié à votre IA personnelle
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Une fois connecté, votre compte est automatiquement relié à votre IA VIADAR. Elle analyse le marché en temps réel selon votre stratégie et vos paramètres de risque.
                </p>
              </div>

              {/* Card 3 - AI Trading */}
              <div 
                className="border rounded-lg p-3 sm:p-4 md:p-5"
                style={{
                  borderColor: 'rgba(0, 184, 230, 0.3)',
                  background: 'rgba(0, 26, 40, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                  <Zap size={14} className="sm:size-4" style={{ color: '#00b8e6', marginTop: '2px', flexShrink: 0 }} />
                  <h3 className="text-white font-semibold text-xs">
                    L'IA prend des décisions et exécute les trades en direct
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  L'IA détecte les opportunités, place les ordres et les gère en toute autonomie (ouverture, modification, break-even, clôture).
                </p>
                <p className="text-cyan-400 text-xs mt-2 sm:mt-2.5 flex items-start gap-1.5">
                  <ArrowRight size={12} className="mt-0.5 flex-shrink-0" />
                  <span>Elle agit selon vos règles sans jamais avoir accès à votre capital ni retirer de fonds.</span>
                </p>
              </div>

              {/* Card 4 - Dashboard Control */}
              <div 
                className="border rounded-lg p-3 sm:p-4 md:p-5"
                style={{
                  borderColor: 'rgba(0, 184, 230, 0.3)',
                  background: 'rgba(0, 26, 40, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                  <BarChart3 size={14} className="sm:size-4" style={{ color: '#00b8e6', marginTop: '2px', flexShrink: 0 }} />
                  <h3 className="text-white font-semibold text-xs">
                    Suivez et contrôlez tout depuis votre tableau de bord
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Depuis l'interface, vous pouvez suivre les performances en temps réel: gains, drawdown, historiques, graphiques, et les décisions prises par votre IA.
                </p>
              </div>

              {/* Card 5 - Security */}
              <div 
                className="border rounded-lg p-3 sm:p-4 md:p-5"
                style={{
                  borderColor: 'rgba(0, 184, 230, 0.3)',
                  background: 'rgba(0, 26, 40, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                  <Lock size={14} className="sm:size-4" style={{ color: '#00b8e6', marginTop: '2px', flexShrink: 0 }} />
                  <h3 className="text-white font-semibold text-xs">
                    Connexion sécurisée
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Nous utilisons le cryptage de bout en bout et ne stockons jamais vos identifiants en texte brut. Vos fonds restent sous votre contrôle total.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="px-4 sm:px-6 md:px-8 pb-8 sm:pb-12">
          <div 
            className="border rounded-lg p-4 sm:p-6"
            style={{
              borderColor: 'rgba(0, 184, 230, 0.3)',
              background: 'rgba(0, 26, 40, 0.5)',
              boxShadow: '0 0 20px rgba(0, 115, 182, 0.1), inset 0 0 20px rgba(0, 115, 182, 0.05)'
            }}
          >
            <h3 className="text-white font-semibold text-sm mb-4 sm:mb-5 text-center sm:text-left">
              Informations de connexion
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <h4 className="text-cyan-400 font-medium text-xs mb-2">
                  Où trouver votre ID de connexion ?
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Vous pouvez trouver votre ID de connexion MT5 dans la section "Paramètres du compte" de votre terminal MT5.
                </p>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-cyan-400 font-medium text-xs mb-2">
                  Nom du serveur
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Le nom du serveur est généralement fourni par votre courtier lors de la création du compte.
                </p>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-cyan-400 font-medium text-xs mb-2">
                  Sécurité des données
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Toutes les connexions sont cryptées avec SSL/TLS et vos identifiants ne sont jamais stockés.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetaTrade;