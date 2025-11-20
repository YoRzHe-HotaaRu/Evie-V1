import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TextChat from './components/TextChat';
import VoiceAgent from './components/VoiceAgent';
import Analytics from './components/Analytics';
import AboutPage from './components/AboutPage';
import { AppView, Interaction } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  
  // Global State for Interactions (Chat & Voice History)
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
        id: 'init-1',
        role: 'model',
        text: "Hi, I'm Ervie. I'm here to listen and support you. How are you feeling right now?",
        timestamp: new Date(),
        source: 'text'
    }
  ]);

  const handleAddInteraction = (interaction: Interaction) => {
    setInteractions(prev => [...prev, interaction]);
  };

  const handleStart = () => {
    setCurrentView(AppView.APP_SELECTION);
  };

  const handleLearnMore = () => {
    setCurrentView(AppView.ABOUT);
  };

  const MobileNavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
        <div className={`p-1 rounded-xl ${active ? 'bg-primary/10' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onGetStarted={handleStart} onLearnMore={handleLearnMore} />;
      
      case AppView.ABOUT:
        return <AboutPage onBack={() => setCurrentView(AppView.LANDING)} />;

      case AppView.APP_SELECTION:
      case AppView.TEXT_CHAT:
      case AppView.VOICE_CHAT:
      case AppView.ANALYTICS:
        return (
          <div className="h-[100dvh] w-full bg-background flex flex-col md:flex-row overflow-hidden fixed inset-0">
            
            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex w-64 bg-card border-r border-border p-4 flex-col gap-4 z-20 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pl-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">E</span>
                </div>
                <span className="text-xl font-bold">Ervie</span>
              </div>

              <button
                onClick={() => setCurrentView(AppView.TEXT_CHAT)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === AppView.TEXT_CHAT 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span className="font-medium">Text Chat</span>
              </button>

              <button
                onClick={() => setCurrentView(AppView.VOICE_CHAT)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === AppView.VOICE_CHAT 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                <span className="font-medium">Voice Call</span>
              </button>

              <button
                onClick={() => setCurrentView(AppView.ANALYTICS)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === AppView.ANALYTICS 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <span className="font-medium">Analytics</span>
              </button>

               <div className="mt-auto pt-4 border-t border-border">
                  <button 
                    onClick={() => setCurrentView(AppView.LANDING)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Exit App
                  </button>
               </div>
            </aside>

            {/* --- MOBILE HEADER --- */}
            <header className="md:hidden flex-none h-14 border-b border-border bg-card flex items-center justify-between px-4 z-20 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">E</span>
                    </div>
                    <span className="font-bold text-lg">Ervie</span>
                </div>
                <button 
                    onClick={() => setCurrentView(AppView.LANDING)}
                    className="p-2 -mr-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Exit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 relative overflow-hidden bg-background flex flex-col w-full">
                <div className="flex-1 w-full h-full overflow-hidden relative">
                    {currentView === AppView.APP_SELECTION && (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300 p-4 overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 md:mb-8 mt-4">How would you like to connect?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl pb-8">
                                <div 
                                    onClick={() => setCurrentView(AppView.TEXT_CHAT)}
                                    className="cursor-pointer bg-card hover:border-primary border-2 border-border p-6 md:p-8 rounded-2xl flex flex-col items-center gap-4 transition-all hover:shadow-lg group active:scale-95"
                                >
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-chart-5/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold">Text Chat</h3>
                                    <p className="text-muted-foreground text-sm">Write down your thoughts and receive support at your own pace.</p>
                                </div>
                                <div 
                                    onClick={() => setCurrentView(AppView.VOICE_CHAT)}
                                    className="cursor-pointer bg-card hover:border-primary border-2 border-border p-6 md:p-8 rounded-2xl flex flex-col items-center gap-4 transition-all hover:shadow-lg group active:scale-95"
                                >
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-chart-4/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold">Voice Call</h3>
                                    <p className="text-muted-foreground text-sm">Have a real-time, comforting conversation with Ervie.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === AppView.TEXT_CHAT && (
                        <div className="h-full p-0 md:p-6">
                             <TextChat interactions={interactions} onAddInteraction={handleAddInteraction} />
                        </div>
                    )}
                    
                    {currentView === AppView.VOICE_CHAT && (
                        <div className="h-full p-0 md:p-6">
                            <VoiceAgent onAddInteraction={handleAddInteraction} />
                        </div>
                    )}

                    {currentView === AppView.ANALYTICS && (
                        <div className="h-full p-4 md:p-6 overflow-y-auto">
                            <Analytics interactions={interactions} />
                        </div>
                    )}
                </div>
            </main>

            {/* --- MOBILE BOTTOM NAV --- */}
            <nav className="md:hidden flex-none h-16 bg-card border-t border-border flex items-center justify-around px-1 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <MobileNavButton 
                    active={currentView === AppView.TEXT_CHAT} 
                    onClick={() => setCurrentView(AppView.TEXT_CHAT)}
                    label="Chat"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>}
                />
                <MobileNavButton 
                    active={currentView === AppView.VOICE_CHAT} 
                    onClick={() => setCurrentView(AppView.VOICE_CHAT)}
                    label="Voice"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>}
                />
                <MobileNavButton 
                    active={currentView === AppView.ANALYTICS} 
                    onClick={() => setCurrentView(AppView.ANALYTICS)}
                    label="Insights"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
                />
            </nav>
          </div>
        );
      default:
        return <LandingPage onGetStarted={handleStart} onLearnMore={handleLearnMore} />;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default App;