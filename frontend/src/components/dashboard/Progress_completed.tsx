// components/dashboard/CourseCard.tsx
import React from 'react';

interface CourseCardProps {
  icon: string;
  title: string;
  count: number;
  bgColor: string;
  textColor: string;
}

const Progress_completed: React.FC<CourseCardProps> = ({ icon, title, count, bgColor, textColor }) => (
   <div className="w-full h-full"> {/* Ensure card grows to fill grid cell */}
    <div className="w-full h-full p-4 sm:p-6 border border-white rounded-2xl bg-white/40 backdrop-blur-md shadow-xl hover:scale-[1.02] transition-all">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} text-white flex items-center justify-center rounded-full shadow-md text-lg sm:text-xl`}>
          {icon}
        </div>
        <div>
          <div className={`text-base sm:text-xl font-semibold ${textColor}`}>{title}</div>
          <div className="text-sm text-gray-600">{count} Courses</div>
        </div>
      </div>
    </div>
  </div>
);

export default Progress_completed;
