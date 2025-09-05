
import React from 'react';
import { StayIcon, DineIcon, ExperienceIcon, TransferIcon, FlightIcon, LocationIcon } from './icons';
import type { UnsplashImageData } from '../services/unsplashService';

interface ItinerarySegmentCardProps {
  segment: any;
  imageData: UnsplashImageData | null;
  isLoading: boolean;
}

const getIconForType = (type: string, className?: string) => {
  const props = { className: className || "h-6 w-6 text-brand-text-secondary" };
  switch (type.toLowerCase()) {
    case 'stay': case 'yacht': return <StayIcon {...props} />;
    case 'dine': return <DineIcon {...props} />;
    case 'experience': case 'wellness': return <ExperienceIcon {...props} />;
    case 'transfer': case 'rail': case 'heli': return <TransferIcon {...props} />;
    case 'flight': return <FlightIcon {...props} />;
    default: return <ExperienceIcon {...props} />;
  }
};

export const ItinerarySegmentCard: React.FC<ItinerarySegmentCardProps> = ({ segment, imageData, isLoading }) => {
  if (isLoading) {
    return <div className="h-72 w-full bg-gray-200 rounded-xl animate-pulse-slow"></div>;
  }

  if (!imageData) {
    // Fallback card when no image is found
    return (
        <div 
          className="relative h-72 w-full bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-xl p-6 flex flex-col justify-between text-white overflow-hidden shadow-lg animate-fade-in animate-background-pan"
          style={{ backgroundSize: '200% 200%' }}
        >
            <div className="absolute -bottom-12 -right-12 opacity-5">
                {getIconForType(segment.type, "h-48 w-48 text-white")}
            </div>
            <div className="relative z-10 flex justify-end">
                <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20">
                    {getIconForType(segment.type, "h-6 w-6 text-white")}
                </div>
            </div>
            <div className="relative z-10 text-shadow">
                {segment.start && (
                    <span className="text-sm font-light text-white/80 uppercase tracking-wider">{segment.start}</span>
                )}
                <h4 className="font-serif text-3xl font-medium mt-1">{segment.title}</h4>
                {segment.location && (
                    <div className="flex items-center space-x-1.5 text-white/80 mt-2">
                        <LocationIcon className="h-4 w-4" />
                        <span className="text-sm">{segment.location}</span>
                    </div>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="relative h-72 w-full rounded-xl overflow-hidden shadow-lg animate-fade-in group text-white">
        <img src={imageData.imageUrl} alt={segment.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div className="flex justify-end">
                <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20">
                    {getIconForType(segment.type, "h-6 w-6 text-white")}
                </div>
            </div>

            <div className="text-shadow">
                {segment.start && (
                    <span className="text-sm font-light text-white/80 uppercase tracking-wider">{segment.start}</span>
                )}
                <h4 className="font-serif text-3xl font-medium mt-1">{segment.title}</h4>
                {segment.location && (
                    <div className="flex items-center space-x-1.5 text-white/80 mt-2">
                        <LocationIcon className="h-4 w-4" />
                        <span className="text-sm">{segment.location}</span>
                    </div>
                )}
            </div>
        </div>

        <p className="absolute bottom-2 right-4 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Photo by <a href={imageData.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{imageData.photographerName}</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Unsplash</a>
        </p>
    </div>
  );
};
