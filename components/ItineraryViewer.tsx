
import React, { useState } from 'react';
import { ItinerarySegmentCard } from './ItinerarySegmentCard';
import { MapView } from './MapView';
import { ArrowLeftIcon, DownloadIcon, CalendarIcon, ShareIcon, MapIcon, ListViewIcon, CheckCircleIcon } from './icons';
import type { UnsplashImageData } from '../services/unsplashService';
import { LoadingSpinner } from './LoadingSpinner';

// @ts-ignore
const jsPDF = window.jspdf.jsPDF;
// @ts-ignore
const html2canvas = window.html2canvas;
// @ts-ignore
const ics = window.ics;
// @ts-ignore
const pako = window.pako;


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
  const [isExporting, setIsExporting] = useState(false);
  const [shareStatus, setShareStatus] = useState('Share');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const days = planData?.days || [];
  const trip = planData?.trip;
  const isLoadingImages = planData && itineraryImages === null;
  let segmentCounter = 0;
  
  const handleExportPDF = async () => {
    const content = document.getElementById('itinerary-content');
    if (!content) return;

    setIsExporting(true);
    try {
        const canvas = await html2canvas(content, {
            scale: 2, // Higher resolution
            useCORS: true, // Handle cross-origin images
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height] // Use canvas dimensions for the PDF
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        const destination = trip?.destinations?.join('_') || 'trip';
        const startDate = trip?.dates?.start || new Date().toISOString().split('T')[0];
        const fileName = `Itinerary_${destination}_${startDate}.pdf`;
        
        pdf.save(fileName);

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Sorry, there was an error creating the PDF.");
    } finally {
        setIsExporting(false);
    }
  };

  const handleExportICS = () => {
      const events: any[] = [];
      days.forEach((day: any) => {
          day.segments?.forEach((segment: any) => {
              if (segment.start) {
                  const [hours, minutes] = segment.start.split(':').map(Number);
                  const dateParts = day.date.split('-').map(Number);
                  
                  const start = [dateParts[0], dateParts[1], dateParts[2], hours, minutes];
                  // Default to 2 hour duration
                  const end = [dateParts[0], dateParts[1], dateParts[2], hours + 2, minutes];

                  events.push({
                      title: segment.title,
                      description: segment.narrative || '',
                      location: segment.location || '',
                      start,
                      end,
                      status: 'CONFIRMED',
                      busyStatus: 'BUSY'
                  });
              }
          });
      });

      if(events.length === 0) {
        alert("No scheduled events found to export.");
        return;
      }
      
      const { error, value } = ics.createEvents(events);
      if (error) {
          console.error("Error creating ICS file:", error);
          alert("Sorry, there was an error creating the calendar file.");
          return;
      }

      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const destination = trip?.destinations?.join('_') || 'trip';
      link.download = `Itinerary_${destination}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleSharePlan = async () => {
      if (!planData) return;
      try {
        setShareStatus('Copying...');
        const jsonString = JSON.stringify(planData);
        const compressed = pako.deflate(jsonString);
        // Use a trick to convert Uint8Array to a string btoa can handle
        // Fix: Explicitly type `byte` as `number` to resolve TypeScript error where it was inferred as `unknown`.
        const binaryString = Array.from(compressed, (byte: number) => String.fromCharCode(byte)).join('');
        const base64 = btoa(binaryString);
        const url = `${window.location.origin}${window.location.pathname}?plan=${encodeURIComponent(base64)}`;

        await navigator.clipboard.writeText(url);
        setShareStatus('Copied!');
      } catch (error) {
          console.error("Failed to share plan:", error);
          setShareStatus('Error');
      } finally {
          setTimeout(() => setShareStatus('Share'), 2000);
      }
  }


  return (
    <div className="h-full flex flex-col bg-brand-surface rounded-2xl overflow-hidden content-card">
        <header className="p-4 sm:p-6 border-b border-brand-border flex-shrink-0 bg-brand-surface z-10 shadow-sm flex items-center justify-between gap-4">
            <div className="flex-shrink min-w-0">
              <h2 className="text-2xl font-serif text-brand-text-primary truncate">
                Itinerary: {trip?.destinations?.join(', ')}
              </h2>
              {trip?.dates?.start && trip?.dates?.end && (
                <p className="text-sm text-brand-text-secondary mt-1">
                  {formatDate(trip.dates.start)} to {formatDate(trip.dates.end)}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                  onClick={onBack}
                  disabled={isExporting}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-transparent hover:bg-gray-100 text-brand-text-secondary rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-brand-surface disabled:opacity-50"
              >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Back</span>
              </button>
              
              <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="p-2 bg-transparent hover:bg-gray-100 text-brand-text-secondary rounded-full transition-colors">
                {viewMode === 'list' ? <MapIcon className="h-5 w-5" /> : <ListViewIcon className="h-5 w-5" />}
              </button>
              
              <div className="h-6 border-l border-brand-border"></div>

              <button onClick={handleSharePlan} disabled={shareStatus !== 'Share'} className="flex items-center space-x-2 px-3 py-2 bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent-light rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70 disabled:opacity-50">
                  {shareStatus === 'Copied!' ? <CheckCircleIcon className="h-5 w-5" /> : <ShareIcon className="h-5 w-5" />}
                  <span className="hidden md:inline">{shareStatus}</span>
              </button>
              <button onClick={handleExportICS} className="flex items-center space-x-2 px-3 py-2 bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent-light rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70 disabled:opacity-50">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Calendar</span>
              </button>
              <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-3 py-2 bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent-light rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70 disabled:opacity-50 disabled:cursor-wait"
              >
                  {isExporting ? <LoadingSpinner/> : <DownloadIcon className="h-5 w-5" />}
                  <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'PDF'}</span>
              </button>
              <button
                  onClick={onProceed}
                  disabled={isExporting}
                  className="px-5 py-2 bg-brand-accent hover:bg-teal-700 text-white rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70 disabled:opacity-50"
              >
                  Confirm
              </button>
            </div>
        </header>
        <div id="itinerary-content-wrapper" className="flex-1 overflow-y-auto">
            {viewMode === 'list' ? (
              <div id="itinerary-content" className="p-4 sm:p-6 space-y-8">
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
            ) : (
                <MapView planData={planData} />
            )}
        </div>
    </div>
  );
};
