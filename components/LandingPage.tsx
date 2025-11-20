import React from 'react';
import Button from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLearnMore }) => {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Navigation */}
      <nav className="w-full p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
             <span className="text-primary-foreground font-bold">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Ervie</span>
        </div>
        <Button variant="ghost" onClick={onGetStarted}>Log In</Button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 text-center max-w-4xl mx-auto animate-in fade-in duration-700 pb-10">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs md:text-sm font-medium">
            ✨ Your calm in the chaos
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-6 md:mb-8 leading-tight">
          Immediate support for <br />
          <span className="text-primary">anxious moments.</span>
        </h1>
        <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl leading-relaxed">
          Ervie is an AI companion designed to help you ground yourself when anxiety strikes. 
          Talk naturally or chat silently—we're here to help you breathe.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Button size="lg" onClick={onGetStarted} fullWidth={false} className="w-full sm:w-auto rounded-full px-10 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            Talk to Ervie
          </Button>
          <Button size="lg" variant="outline" onClick={onLearnMore} fullWidth={false} className="w-full sm:w-auto rounded-full px-10 text-lg bg-transparent border-2">
            Learn more
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-20 w-full text-left">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-chart-5/20 text-chart-5 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Voice & Text</h3>
                <p className="text-muted-foreground text-sm">Speak your mind freely or type your thoughts. Ervie adapts to your preferred communication style.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-chart-4/20 text-chart-4 rounded-lg flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5"></path><path d="M17 12h5"></path><path d="M9 12h6"></path></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Grounding Techniques</h3>
                <p className="text-muted-foreground text-sm">Guided breathing exercises and sensory grounding methods to help reduce panic immediately.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-chart-2/20 text-chart-2 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Safe Space</h3>
                <p className="text-muted-foreground text-sm">A judgment-free zone available 24/7. Your conversations are private and focused on your well-being.</p>
            </div>
        </div>
      </main>

      <footer className="p-6 text-center text-muted-foreground text-xs md:text-sm">
        &copy; {new Date().getFullYear()} Ervie. Not a replacement for professional medical advice.
      </footer>
    </div>
  );
};

export default LandingPage;