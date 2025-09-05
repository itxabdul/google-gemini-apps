
import React from 'react';
import { ItinerarySegmentCard } from './ItinerarySegmentCard';
import { ArrowLeftIcon } from './icons';
import type { UnsplashImageData } from '../services/unsplashService';

interface ItineraryViewerProps {
  planData: any; 
  itineraryImages: UnsplashImageData[] | null;
  onBack: () => void;
  onProceed: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export const ItineraryViewer: React.FC<ItineraryViewerProps> = ({ planData, itineraryImages, onBack, onProceed }) => {
  const days = planData?.days || [];
  const trip = planData?.trip;
  const isLoadingImages = planData && itineraryImages === null;
  let segmentCounter = 0;

  return (
    <div className="h-full flex flex-col bg-brand-surface rounded-2xl overflow-hidden content-card">
        <header className="p-4 sm:p-6 border-b border-brand-border flex-shrink-0 bg-brand-surface z-10 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-brand-text-primary">
                Itinerary Draft: {trip?.destinations?.join(', ')}
              </h2>
              {trip?.dates?.start && trip?.dates?.end && (
                <p className="text-sm text-brand-text-secondary mt-1">
                  A proposed journey from {formatDate(trip.dates.start)} to {formatDate(trip.dates.end)}.
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-4 py-2 bg-transparent hover:bg-gray-100 text-brand-text-secondary rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-brand-surface"
              >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Back to Summary</span>
              </button>
              <button
                  onClick={onProceed}
                  className="px-5 py-2 bg-brand-accent hover:bg-teal-700 text-white rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70"
              >
                  Proceed to Confirmation
              </button>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-8">
            {days.map((day: any, index: number) => (
              <div key={day.date} style={{ animationDelay: `${index * 100}ms`}} className="animate-slide-up">
                <div className="mb-4">
                  <h3 className="font-semibold text-brand-accent pb-2 border-b border-brand-border">
                    {formatDate(day.date)}
                  </h3>
                </div>
                <div className="space-y-6">
                  {day.segments?.map((segment: any) => {
                      const imageData = isLoadingImages ? null : (itineraryImages && itineraryImages[segmentCounter]) || null;
                      segmentCounter++;
                      return (
                        <ItinerarySegmentCard 
                          key={segment.id}
                          segment={segment}
                          imageData={imageData}
                          isLoading={isLoadingImages}
                        />
                      )
                  })}
                </div>
              </div>
            ))}
            </div>
        </div>
    </div>
  );
};
