import React, { useMemo } from 'react';
import { Interaction } from '../types';

interface AnalyticsProps {
    interactions: Interaction[];
}

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6 ${className}`}>
    {title && <h3 className="font-semibold text-lg mb-4 tracking-tight">{title}</h3>}
    {children}
  </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ interactions }) => {
  
  // Real-time analysis logic
  const analyticsData = useMemo(() => {
      const userMessages = interactions.filter(i => i.role === 'user');
      
      // 1. Keyword Sentiment Analysis
      const keywords = {
          anxious: ['anxious', 'scared', 'panic', 'fear', 'worry', 'nervous', 'stress', 'help', 'overwhelm'],
          calm: ['calm', 'better', 'breathe', 'okay', 'fine', 'good', 'relax', 'safe', 'peace'],
          hopeful: ['hope', 'try', 'will', 'maybe', 'future', 'plan', 'believe'],
          sad: ['sad', 'cry', 'hurt', 'pain', 'lonely', 'tired']
      };

      const emotionCounts = { anxious: 0, calm: 0, hopeful: 0, sad: 0, neutral: 0 };
      const sentimentTrend: number[] = []; // 0 to 10 scale, where 0 is negative, 10 is positive

      userMessages.forEach(msg => {
          const text = msg.text.toLowerCase();
          let isNeutral = true;
          let score = 5; // Base neutral score

          if (keywords.anxious.some(k => text.includes(k))) { 
              emotionCounts.anxious++; 
              isNeutral = false;
              score -= 2;
          }
          if (keywords.sad.some(k => text.includes(k))) { 
              emotionCounts.sad++; 
              isNeutral = false;
              score -= 2;
          }
          if (keywords.calm.some(k => text.includes(k))) { 
              emotionCounts.calm++; 
              isNeutral = false;
              score += 2;
          }
          if (keywords.hopeful.some(k => text.includes(k))) { 
              emotionCounts.hopeful++; 
              isNeutral = false;
              score += 2;
          }

          if (isNeutral) emotionCounts.neutral++;
          
          // Clamp score
          score = Math.max(0, Math.min(10, score));
          sentimentTrend.push(score);
      });

      // 2. Calculate Totals
      const totalInteractions = interactions.length;
      const totalUser = userMessages.length;
      
      // 3. Dominant Emotion
      const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

      // 4. Average Sentiment (Simulated Anxiety Level Inversion: High Sentiment = Low Anxiety)
      const avgSentiment = sentimentTrend.length > 0 
        ? sentimentTrend.reduce((a, b) => a + b, 0) / sentimentTrend.length 
        : 5;
      
      const avgAnxiety = 10 - avgSentiment; // Invert for display

      return {
          totalInteractions,
          totalUser,
          emotionCounts,
          sentimentTrend,
          dominantEmotion,
          avgAnxiety
      };
  }, [interactions]);

  const { emotionCounts, sentimentTrend, dominantEmotion, avgAnxiety } = analyticsData;

  // Prepare Chart Data
  const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0) || 1;
  const emotionDisplay = [
      { name: 'Calm', value: Math.round((emotionCounts.calm / totalEmotions) * 100), color: 'var(--chart-2)' },
      { name: 'Anxious', value: Math.round((emotionCounts.anxious / totalEmotions) * 100), color: 'var(--chart-1)' },
      { name: 'Hopeful', value: Math.round((emotionCounts.hopeful / totalEmotions) * 100), color: 'var(--chart-4)' },
      { name: 'Neutral', value: Math.round((emotionCounts.neutral / totalEmotions) * 100), color: 'var(--muted-foreground)' },
  ].filter(e => e.value > 0);

  // SVG Path generation for line chart
  const maxVal = 10;
  const points = sentimentTrend.map((val, i) => {
    const x = (i / (Math.max(1, sentimentTrend.length - 1))) * 100;
    const y = 100 - (val / maxVal) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Donut Chart Utils
  let accumulatedPercent = 0;
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Real-time Insights</h2>
        <p className="text-muted-foreground">Analyzing your current session conversation.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="flex flex-col justify-between bg-gradient-to-br from-card to-secondary/5">
          <div className="text-muted-foreground text-sm font-medium">Messages Exchanged</div>
          <div className="text-4xl font-bold mt-2">{analyticsData.totalInteractions}</div>
          <div className="text-xs text-primary mt-2 flex items-center gap-1">
            Including text & voice turns
          </div>
        </Card>
        <Card className="flex flex-col justify-between">
           <div className="text-muted-foreground text-sm font-medium">Est. Anxiety Level</div>
           <div className="text-4xl font-bold mt-2">{avgAnxiety.toFixed(1)}<span className="text-lg text-muted-foreground font-normal">/10</span></div>
           <div className="text-xs text-chart-2 mt-2 flex items-center gap-1">
            Based on keyword sentiment
          </div>
        </Card>
        <Card className="flex flex-col justify-between">
           <div className="text-muted-foreground text-sm font-medium">Dominant Vibe</div>
           <div className="text-4xl font-bold mt-2 text-chart-4 capitalize">{dominantEmotion}</div>
           <div className="text-xs text-muted-foreground mt-2">Most frequent emotion detected</div>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Sentiment Line Chart */}
        <Card title="Sentiment Flow (Session)" className="min-h-[300px]">
            {sentimentTrend.length < 2 ? (
                <div className="h-48 flex items-center justify-center text-muted-foreground italic">
                    Not enough data yet. Keep chatting!
                </div>
            ) : (
                <div className="w-full h-48 relative mt-4">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-muted-foreground/30">
                        <div className="border-b border-dashed border-border w-full h-0"></div>
                        <div className="border-b border-dashed border-border w-full h-0"></div>
                        <div className="border-b border-dashed border-border w-full h-0"></div>
                    </div>
                    
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <polygon points={`0,100 ${points} 100,100`} fill="url(#gradientArea)" />
                        <polyline 
                            points={points} 
                            fill="none" 
                            stroke="var(--primary)" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Start</span>
                        <span>Now</span>
                    </div>
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-4 text-center">
                Higher peaks represent calmer/positive sentiment. Lower valleys indicate detected anxiety words.
            </p>
        </Card>

        {/* Emotion Donut Chart */}
        <Card title="Emotion Distribution" className="min-h-[300px] flex flex-col items-center">
           {interactions.length < 2 ? (
               <div className="h-48 flex items-center justify-center text-muted-foreground italic">
                    Waiting for more messages...
               </div>
           ) : (
               <>
                <div className="relative w-48 h-48 mt-2">
                    <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                        <circle cx="0" cy="0" r="0.8" fill="none" stroke="var(--border)" strokeWidth="0.3" />
                        {(() => {
                        let offset = 0;
                        return emotionDisplay.map((emotion, i) => {
                            const circumference = 2 * Math.PI * 0.8;
                            const dashVal = (emotion.value / 100) * circumference;
                            const dashOffset = -offset * circumference;
                            offset += (emotion.value / 100);
                            
                            return (
                                <circle 
                                key={i}
                                cx="0" cy="0" r="0.8" 
                                fill="none" 
                                stroke={emotion.color} 
                                strokeWidth="0.25"
                                strokeDasharray={`${dashVal} ${circumference}`}
                                strokeDashoffset={dashOffset}
                                className="transition-all duration-500 ease-out"
                                />
                            );
                        });
                        })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-2xl font-bold">{analyticsData.totalUser}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">User msgs</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 w-full px-4">
                    {emotionDisplay.map((e, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }}></div>
                            <span className="text-sm text-foreground">{e.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{e.value}%</span>
                        </div>
                    ))}
                </div>
               </>
           )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;