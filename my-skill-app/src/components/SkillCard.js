import React from 'react';

const SkillCard = ({ skill }) => {
  const isTeach = skill.type === 'teach';

  // Base classes for the card with transition for smooth hover effects
  const cardClasses = `
    m-4 p-6 bg-slate-800 rounded-xl shadow-lg 
    w-full md:w-1/2 lg:w-1/3 max-w-sm
    border border-slate-700
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30
  `;

  const badgeClasses = `
    absolute top-0 right-0 mt-4 mr-4 px-3 py-1 rounded-full text-xs font-bold
    ${isTeach ? 'bg-green-500/20 text-green-300' : 'bg-purple-500/20 text-purple-300'}
  `;

  return (
    <div className={cardClasses}>
      <div className="relative">
        <div className={badgeClasses}>{isTeach ? 'OFFERING' : 'SEEKING'}</div>
        <h3 className="text-xl font-bold text-purple-200 mb-2 pr-20">{skill.title}</h3>
        <p className="text-gray-400">{skill.description}</p>
      </div>
    </div>
  );
};

export default SkillCard;