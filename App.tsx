import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageComparator } from './components/ImageComparator';
import { restorePhoto, colorizePhoto, removeScratches } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'restore' | 'colorize' | 'remove-scratches' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalFile(file);
    setRestoredImageUrl(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
  };

  const handleProcessImage = useCallback(async (action: 'restore' | 'colorize' | 'remove-scratches') => {
    if (!originalFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoadingAction(action);
    setError(null);
    setRestoredImageUrl(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalFile);
      
      const processFunction = 
        action === 'restore' ? restorePhoto :
        action === 'colorize' ? colorizePhoto :
        removeScratches;

      const resultBase64 = await processFunction(base64, mimeType);
      
      if (resultBase64) {
        setRestoredImageUrl(`data:${mimeType};base64,${resultBase64}`);
      } else {
        setError(`The AI could not ${action} the image. Please try another one.`);
      }

    } catch (err) {
      console.error(err);
      setError(`An error occurred during the ${action} process. Please check the console and try again.`);
    } finally {
      setLoadingAction(null);
    }
  }, [originalFile]);
  
  const handleNewUpload = () => {
    setOriginalFile(null);
    setOriginalImageUrl(null);
    setRestoredImageUrl(null);
    setError(null);
    setLoadingAction(null);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center">
        {!originalImageUrl ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col items-center">
            <ImageComparator 
              original={originalImageUrl} 
              restored={restoredImageUrl}
              isLoading={!!loadingAction} 
            />
            {error && (
              <div className="mt-4 text-center bg-red-900/50 text-red-300 p-3 rounded-lg w-full max-w-3xl">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleProcessImage('restore')}
                disabled={!!loadingAction}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 flex items-center justify-center gap-2 w-48"
              >
                {loadingAction === 'restore' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Restoring...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Restore
                  </>
                )}
              </button>
               <button
                onClick={() => handleProcessImage('remove-scratches')}
                disabled={!!loadingAction}
                className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-500 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 flex items-center justify-center gap-2 w-48"
              >
                {loadingAction === 'remove-scratches' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removing...
                  </>
                ) : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Remove Scratches
                  </>
                )}
              </button>
              <button
                onClick={() => handleProcessImage('colorize')}
                disabled={!!loadingAction}
                className="px-8 py-3 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-500 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-opacity-50 flex items-center justify-center gap-2 w-48"
              >
                {loadingAction === 'colorize' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Colorizing...
                  </>
                ) : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Colorize
                  </>
                )}
              </button>
              <button
                onClick={handleNewUpload}
                disabled={!!loadingAction}
                className="px-8 py-3 bg-gray-700 text-white font-bold rounded-full shadow-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center gap-2 w-48"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                </svg>
                Upload New
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
