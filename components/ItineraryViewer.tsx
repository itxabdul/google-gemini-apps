
import React from 'react';
import { ItinerarySegmentCard } from './ItinerarySegmentCard';

interface ItineraryViewerProps {
  planData: any; // Ideally, create a strict type for this
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // This will use the browser's locale, which is generally what's desired.
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Assuming dates from AI are UTC
  });
};

export const ItineraryViewer: React.FC<ItineraryViewerProps> = ({ planData }) => {
  const days = planData?.days || [];

  return (
    <div className="mt-6 border-t border-brand-border pt-6 animate-stagger-slide">
      <div className="px-4">
        <h2 className="text-2xl font-serif text-brand-text-primary mb-1 animate-item">
          Itinerary Draft
        </h2>
        <p className="text-sm text-brand-text-secondary mb-6 animate-item" style={{ animationDelay: '100ms' }}>
          A proposed journey for your review.
        </p>
      </div>
      <div className="space-y-8">
        {days.map((day: any, dayIndex: number) => (
          <div 
            key={day.date} 
            className="animate-item"
            style={{ animationDelay: `${(dayIndex * 150) + 150}ms` }}
          >
            <div className="px-4">
              <h3 className="font-semibold text-brand-accent mb-4 pb-2 border-b border-brand-border">
                {formatDate(day.date)}
              </h3>
            </div>
            <div className="relative pl-12 pr-4 space-y-6">
              <div className="absolute left-[23px] top-1 h-full w-px bg-brand-border"></div>
              {day.segments?.map((segment: any, segIndex: number) => (
                <div key={segment.id} className="relative animate-item" style={{ animationDelay: `${(dayIndex * 150) + (segIndex * 100) + 200}ms`}}>
                  <div className="absolute left-[-2px] top-3 h-4 w-4 rounded-full bg-brand-surface border-2 border-brand-accent"></div>
                  <ItinerarySegmentCard 
                    segment={segment}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
