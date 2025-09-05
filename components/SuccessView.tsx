
import React from 'react';
import { SparklesIcon } from './icons';

interface SuccessViewProps {
    onPlanAnother: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ onPlanAnother }) => {
    return (
        <div className="h-screen w-screen bg-brand-bg flex items-center justify-center p-4 animate-fade-in">
            <div className="text-center">
                <div className="inline-block p-5 bg-brand-accent-light rounded-full mb-6">
                    <SparklesIcon className="w-16 h-16 text-brand-accent" />
                </div>
                <h1 className="text-4xl font-serif text-brand-text-primary mb-3">Your Journey is Confirmed!</h1>
                <p className="text-lg text-brand-text-secondary max-w-lg mx-auto mb-8">
                    Your itinerary has been booked. Our team will be in touch shortly with your final documents. We wish you an unforgettable experience.
                </p>
                <button
                    onClick={onPlanAnother}
                    className="px-6 py-3 bg-brand-accent hover:bg-teal-700 text-white rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70"
                >
                    Plan Another Journey
                </button>
            </div>
        </div>
    );
};
