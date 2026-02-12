'use client';

import { useState, useEffect } from 'react';
import { translateText } from '../../component/api';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
 
];

export default function TranslatorPage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const translated = await translateText({
        text: inputText,
        source: sourceLanguage,
        target: targetLanguage,
      });
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    // Swap the texts
    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);
    // Automatically translate after swapping if there's text to translate
    if (translatedText) {
      handleTranslate();
    }
  };

  // Re-translate when source or target language changes and there's input text
  useEffect(() => {
    if (inputText && sourceLanguage !== targetLanguage) {
      handleTranslate();
    }
  }, [sourceLanguage, targetLanguage]);

  const clearText = () => {
    setInputText('');
    setTranslatedText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Language Translator</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Translate text between multiple languages instantly
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with language selectors */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label htmlFor="source-language" className="block text-white text-sm font-medium mb-2">
                  From
                </label>
                <select
                  id="source-language"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full bg-white bg-opacity-90 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-base"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={`src-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={swapLanguages}
                className="my-4 md:my-0 flex items-center justify-center p-3 bg-white bg-opacity-30 hover:bg-opacity-50 text-indigo-600 rounded-full shadow-md transition-transform transform hover:scale-105"
                aria-label="Swap languages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              
              <div className="flex-1 w-full">
                <label htmlFor="target-language" className="block text-white text-sm font-medium mb-2">
                  To
                </label>
                <select
                  id="target-language"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-white bg-opacity-90 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-base"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={`tgt-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Translation areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0">
            {/* Source text area */}
            <div className="p-6 border-r border-gray-200">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Original Text</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setInputText('Hello, how are you today?')}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded transition"
                  >
                    Sample
                  </button>
                  <button
                    onClick={clearText}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-700"
              />
            </div>

            {/* Target text area */}
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Translated Text</span>
                <button
                  onClick={() => navigator.clipboard.writeText(translatedText)}
                  disabled={!translatedText}
                  className={`text-xs py-1 px-3 rounded transition ${
                    translatedText
                      ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Copy
                </button>
              </div>
              
              <div className="relative w-full h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-300">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
                      <p className="text-gray-600">Translating...</p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={translatedText}
                    readOnly
                    placeholder="Translation will appear here..."
                    className="w-full h-full p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none text-gray-700"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Translate button */}
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white shadow-lg transition-all duration-300 ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </span>
              ) : (
                'Translate Text'
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This translator supports {LANGUAGES.length} languages</p>
        </div>
      </div>
    </div>
  );
}