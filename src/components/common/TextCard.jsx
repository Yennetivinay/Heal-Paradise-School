import React from 'react';

const TextCard = ({
  title,
  description,
  icon: Icon,
  iconGradient = 'from-blue-500 to-sky-500', // Default gradient for icon background
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`group rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-sky-300/50 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-6">
        {Icon && (
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-slate-700 leading-relaxed text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

export default TextCard;

