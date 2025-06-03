
import React from 'react';

interface SecurityScoreProps {
  score: number;
}

const SecurityScore: React.FC<SecurityScoreProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className={`px-3 py-2 rounded-lg border ${getScoreBg(score)} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
          Security {score}%
        </span>
      </div>
    </div>
  );
};

export default SecurityScore;
