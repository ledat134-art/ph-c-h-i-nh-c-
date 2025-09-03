
import React from 'react';

interface ImageComparatorProps {
  original: string | null;
  restored: string | null;
  isLoading: boolean;
}

const ImagePanel: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode; isDownloadable?: boolean }> = ({ title, imageUrl, children, isDownloadable = false }) => (
  <div className="w-full lg:w-1/2 p-2 sm:p-4">
    <div className="bg-gray-800 rounded-xl shadow-2xl p-4 h-full flex flex-col">
      <h3 className="text-xl font-bold text-center text-gray-300 mb-4">{title}</h3>
      <div className="flex-grow bg-black/30 rounded-lg flex items-center justify-center aspect-square overflow-hidden relative">
        {imageUrl && <img src={imageUrl} alt={title} className="object-contain max-h-full max-w-full" />}
        {children}
      </div>
      {isDownloadable && imageUrl && (
        <a 
          href={imageUrl} 
          download="restored-photo.png"
          className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-500 transition-all duration-300 text-center flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      )}
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/50 backdrop-blur-sm">
        <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg text-gray-300">AI is working its magic...</p>
    </div>
);

const Placeholder: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-center font-semibold">Your restored image will appear here.</p>
    <p className="text-center text-sm">Click "Restore Photo" to begin.</p>
  </div>
);

export const ImageComparator: React.FC<ImageComparatorProps> = ({ original, restored, isLoading }) => {
  return (
    <div className="w-full max-w-7xl flex flex-col lg:flex-row">
      <ImagePanel title="Original" imageUrl={original} />
      <ImagePanel title="Restored" imageUrl={restored} isDownloadable={!!restored}>
        {isLoading && <LoadingSpinner />}
        {!isLoading && !restored && <Placeholder />}
      </ImagePanel>
    </div>
  );
};
