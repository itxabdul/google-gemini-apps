import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="p-4 border-b border-brand-border flex-shrink-0 bg-brand-surface">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-xl font-serif font-bold text-brand-text-primary tracking-wider">
                    Luxe Concierge
                </h1>
            </div>
        </header>
    );
}