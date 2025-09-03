
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full text-center mb-8 sm:mb-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        AI Photo Restorer Pro
      </h1>
      <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
        Breathe new life into your old memories. Upload a photo to begin the magic.
      </p>
    </header>
  );
};
