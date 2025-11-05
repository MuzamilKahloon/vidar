import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp, Brain, BarChart3, Lock, Zap, ArrowRight } from 'lucide-react';

const MetaTrade = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [connectionId, setConnectionId] = useState('');
  const [password, setPassword] = useState('');
  const [serverName, setServerName] = useState('');
  const [riskLevel, setRiskLevel] = useState('');

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

                {/* Connection ID Input */}
                <div className="mb-4 sm:mb-5">
                  <input
                    type="text"
                    placeholder="Entrez votre ID de connexion MT5"
                    value={connectionId}
                    onChange={(e) => setConnectionId(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setServerName(e.target.value)}
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
                    placeholder="1"
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
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
<div className="flex gap-2 sm:gap-3">
  <button 
    className="flex-1 py-2.5 rounded font-medium text-xs transition-all hover:border-opacity-100"
    style={{
      border: '1px solid rgba(0, 184, 230, 0.4)',
      color: '#00b8e6',
      background: 'rgba(0, 184, 230, 0.05)'
    }}
  >
    Tester la connexion
  </button>
  <button 
    className="flex-1 text-white py-2.5 rounded font-medium text-xs transition-all hover:opacity-90"
    style={{
      background: 'linear-gradient(343deg, rgba(0, 26, 40, 1) 0%, rgba(0, 115, 182, 1) 100%)',
      boxShadow: '0 0 15px rgba(0, 115, 182, 0.3)'
    }}
  >
    Connecter
  </button>
</div>
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