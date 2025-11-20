import React from 'react';
import Button from './Button';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-3xl w-full space-y-8">
            <Button variant="ghost" onClick={onBack} className="mb-4 pl-0 hover:pl-2 transition-all gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to Home
            </Button>

            <header>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">About Ervie</h1>
                <p className="text-xl text-muted-foreground">The story behind the companion.</p>
            </header>

            <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Why Ervie?</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Anxiety can hit unexpectedly, often when we feel most alone. Ervie was created to bridge that gap—providing immediate, judgment-free grounding whenever you need it. It's not just a chatbot; it's a digital safe space designed to listen and help you breathe through the chaos until you feel like yourself again.
                </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <img 
                        src="https://avatars.githubusercontent.com/u/65492005?v=4" 
                        alt="Amir Hafizi" 
                        className="w-24 h-24 rounded-full object-cover shadow-lg shrink-0 border-2 border-primary/20"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-1">Amir Hafizi</h2>
                        <p className="text-primary font-medium mb-4">Hobbyist Developer & CS Student</p>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Hi there! I'm a passionate developer currently pursuing a Bachelor of Computer Science at <span className="text-foreground font-medium">Universiti Teknologi MARA (UiTM) Tapah, Perak, Malaysia</span>. I love building applications that combine creativity with technology to solve real-world human problems.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <a href="https://github.com/YoRzHe-HotaaRu" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium text-foreground decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                GitHub
                            </a>
                            <a href="https://yiorzhe.dev" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium text-foreground decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                yiorzhe.dev
                            </a>
                             <a href="https://linkedin.com/in/amir-hafizi-musa-5530b9364" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium text-foreground decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};

export default AboutPage;