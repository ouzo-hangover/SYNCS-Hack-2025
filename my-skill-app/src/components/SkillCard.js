import React from 'react';

// This function is now simplified to handle standard JavaScript Date objects.
const formatTimestamp = (dateObject) => {
  // We check if it's a valid Date object before trying to format it.
  if (!dateObject || !(dateObject instanceof Date)) {
    return 'N/A';
  }
  return dateObject.toLocaleDateString() + ' at ' + dateObject.toLocaleTimeString();
};

const SkillCard = ({ skill }) => (
  <div className="bg-slate-800 rounded-xl shadow-lg p-6 m-4 w-full md:w-80 flex flex-col justify-between animate-fadeInUp">
    <div>
      <h3 className="text-xl font-bold text-purple-200 mb-2">{skill.title}</h3>
      <p className="text-sm font-semibold text-gray-400 mb-1">
        {skill.type === 'teach' ? 'I can teach...' : 'I want to learn...'}
      </p>
      <p className="text-gray-300 text-sm mb-4">
        {skill.description}
      </p>
    </div>
    <div className="text-right text-xs text-gray-500 mt-auto">
      <span className="font-medium text-gray-200">Posted by:</span> {skill.userId.substring(0, 8)}...
      <p>
        <span className="font-medium text-gray-200">Posted on:</span> {formatTimestamp(skill.createdAt)}
      </p>
    </div>
  </div>
);

export default SkillCard;