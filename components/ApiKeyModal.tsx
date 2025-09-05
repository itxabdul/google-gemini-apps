
import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSaveKey: (key: string) => void;
    onContinueWithoutKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSaveKey, onContinueWithoutKey }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSave = () => {
        if (apiKey.trim()) {
            onSaveKey(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-brand-surface rounded-2xl shadow-2xl max-w-md w-full p-8 m-4 transform transition-all animate-slide-up">
                <h2 className="text-2xl font-serif text-brand-text-primary mb-2">Enable Itinerary Images</h2>
                <p className="text-brand-text-secondary mb-6">
                    To visualize your journey with beautiful photography, please provide your Unsplash API key. This is stored only in your browser for this session.
                </p>
                
                <div>
                    <label htmlFor="unsplash-key" className="block text-sm font-medium text-brand-text-secondary mb-1">
                        Unsplash API Key
                    </label>
                    <input
                        id="unsplash-key"
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your key here"
                        className="w-full px-4 py-3 input-styled rounded-lg focus:outline-none text-brand-text-primary placeholder-brand-text-secondary/70"
                        autoFocus
                    />
                </div>

                <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!apiKey.trim()}
                        className="w-full sm:w-auto px-6 py-3 bg-brand-accent hover:bg-teal-700 text-white rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-accent/70 focus:ring-offset-2 focus:ring-offset-brand-surface"
                    >
                        Save & Continue
                    </button>
                    <button
                        onClick={onContinueWithoutKey}
                        className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-gray-100 text-brand-text-secondary rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-brand-surface"
                    >
                        Continue without Images
                    </button>
                </div>
                 <p className="text-xs text-brand-text-secondary/70 mt-4 text-center">
                    You can get a free key from the <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-accent">Unsplash Developer portal</a>.
                </p>
            </div>
        </div>
    );
};
