
import React from 'react';
import { ArrowLeftIcon, CreditCardIcon } from './icons';

interface ConfirmationViewerProps {
    planData: any;
    onBack: () => void;
    onConfirm: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const ConfirmationViewer: React.FC<ConfirmationViewerProps> = ({ planData, onBack, onConfirm }) => {
    
    const bookableItems = planData?.days?.flatMap((day: any) =>
        day.segments?.filter((seg: any) => seg.cost_usd && seg.cost_usd > 0).map((seg: any) => ({ ...seg, date: day.date }))
    ) || [];

    const totalCost = bookableItems.reduce((acc: number, item: any) => acc + (item.cost_usd || 0), 0);
    const trip = planData?.trip;

    return (
        <div className="h-full flex flex-col bg-brand-surface rounded-2xl overflow-hidden content-card">
            <header className="p-4 sm:p-6 border-b border-brand-border flex-shrink-0 bg-brand-surface z-10 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif text-brand-text-primary">Confirm & Book Your Journey</h2>
                    <p className="text-sm text-brand-text-secondary mt-1">
                        Please review the final details for your trip to {trip?.destinations?.join(', ')}.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 px-4 py-2 bg-transparent hover:bg-gray-100 text-brand-text-secondary rounded-full font-semibold transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Back to Itinerary</span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-4 pb-2 border-b border-brand-border">
                        Summary of Bookable Items
                    </h3>
                    <div className="space-y-3">
                        {bookableItems.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-brand-accent-light/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-brand-text-primary">{item.title}</p>
                                    <p className="text-sm text-brand-text-secondary capitalize">{item.type}</p>
                                </div>
                                <p className="font-semibold text-brand-text-primary">{formatCurrency(item.cost_usd)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-4 border-t-2 border-brand-border">
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-serif text-brand-text-primary">Estimated Total</p>
                            <p className="text-2xl font-bold font-serif text-brand-accent">{formatCurrency(totalCost)}</p>
                        </div>
                        <p className="text-right text-sm text-brand-text-secondary mt-1">
                            Final charges may vary. Does not include taxes or fees unless specified.
                        </p>
                    </div>
                </div>
            </div>

            <footer className="p-4 border-t border-brand-border bg-brand-surface/80 backdrop-blur-sm flex items-center justify-end">
                <button
                    onClick={onConfirm}
                    className="flex items-center space-x-3 px-6 py-3 bg-brand-accent hover:bg-teal-700 text-white rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70 text-lg"
                >
                    <CreditCardIcon className="h-6 w-6" />
                    <span>Confirm & Book Journey</span>
                </button>
            </footer>
        </div>
    );
};
