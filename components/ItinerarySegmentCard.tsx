
import React from 'react';
import { StayIcon, DineIcon, ExperienceIcon, TransferIcon, FlightIcon, LocationIcon } from './icons';

interface ItinerarySegmentCardProps {
  segment: any;
}

const getIconForType = (type: string) => {
  const props = { className: "h-8 w-8 text-brand-accent/80" };
  switch (type.toLowerCase()) {
    case 'stay': case 'yacht': return <StayIcon {...props} />;
    case 'dine': return <DineIcon {...props} />;
    case 'experience': case 'wellness': return <ExperienceIcon {...props} />;
    case 'transfer': case 'rail': case 'heli': return <TransferIcon {...props} />;
    case 'flight': return <FlightIcon {...props} />;
    default: return <ExperienceIcon {...props} />;
  }
};

export const ItinerarySegmentCard: React.FC<ItinerarySegmentCardProps> = ({ segment }) => {
  return (
    <div className="flex items-start space-x-6">
      <div className="pt-1 flex-shrink-0">
         {getIconForType(segment.type)}
      </div>

      <div className="flex-grow">
        <div className="flex items-baseline space-x-3">
          <h4 className="font-serif text-xl font-medium text-brand-text-primary">{segment.title}</h4>
          {segment.start && (
            <span className="text-sm text-brand-text-secondary">
               / {segment.start} {segment.end ? `- ${segment.end}` : ''}
            </span>
          )}
        </div>
        
        {segment.location && (
          <div className="flex items-center space-x-1.5 text-brand-text-secondary mt-1 mb-3">
            <LocationIcon className="h-4 w-4" />
            <span className="text-sm">{segment.location}</span>
          </div>
        )}

        {segment.narrative && (
          <div className="relative pl-3 border-l-2 border-brand-accent/50">
            <p className="text-sm text-brand-text-secondary leading-relaxed font-light italic">
              {segment.narrative}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
