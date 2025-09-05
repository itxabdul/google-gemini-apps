
import React, { useState, useEffect, useRef } from 'react';
import { MapIcon, StayIcon, DineIcon, ExperienceIcon, TransferIcon, FlightIcon, CheckCircleIcon } from './icons';

interface VisualSummaryViewerProps {
  planData: any;
  onApprove: () => void;
  onRefine: () => void;
  onPlanUpdate: (updatedPlan: any) => void;
}

const getIconForType = (type: string, className?: string) => {
  const props = { className: className || "h-6 w-6 text-brand-accent/80" };
  switch (type.toLowerCase()) {
    case 'stay': case 'yacht': return <StayIcon {...props} />;
    case 'dine': return <DineIcon {...props} />;
    case 'experience': case 'wellness': return <ExperienceIcon {...props} />;
    case 'transfer': case 'rail': case 'heli': return <TransferIcon {...props} />;
    case 'flight': return <FlightIcon {...props} />;
    default: return <ExperienceIcon {...props} />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const EmptyState: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center bg-brand-surface p-8 text-center animate-fade-in">
    <MapIcon className="w-24 h-24 text-brand-accent/20 mb-6" />
    <h2 className="text-2xl font-serif text-brand-text-primary">Your Journey Awaits</h2>
    <p className="text-brand-text-secondary mt-2 max-w-sm">
      As you converse with your concierge, a high-level visual snapshot of your journey will appear here for your approval.
    </p>
  </div>
);

export const VisualSummaryViewer: React.FC<VisualSummaryViewerProps> = ({ planData, onApprove, onRefine, onPlanUpdate }) => {
  const [localPlan, setLocalPlan] = useState(planData);
  const [draggedItem, setDraggedItem] = useState<{ dayIndex: number; segmentIndex: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ dayIndex: number; segmentIndex: number | null } | null>(null);

  useEffect(() => {
    setLocalPlan(planData);
  }, [planData]);

  if (!localPlan) {
    return <EmptyState />;
  }

  const handleDragStart = (e: React.DragEvent, dayIndex: number, segmentIndex: number) => {
    setDraggedItem({ dayIndex, segmentIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${dayIndex},${segmentIndex}`);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };
  
  const handleDragOver = (e: React.DragEvent, dayIndex: number, segmentIndex: number | null) => {
    e.preventDefault();
    if(draggedItem) {
        setDropTarget({ dayIndex, segmentIndex });
    }
  };
  
  const handleDrop = (e: React.DragEvent, targetDayIndex: number, targetSegmentIndex: number | null) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { dayIndex: fromDay, segmentIndex: fromSegment } = draggedItem;

    const newPlan = JSON.parse(JSON.stringify(localPlan));
    const draggedSegment = newPlan.days[fromDay].segments.splice(fromSegment, 1)[0];
    
    // If targetSegmentIndex is null, it means we're dropping on the day column, so add to end.
    const insertionIndex = targetSegmentIndex === null ? newPlan.days[targetDayIndex].segments.length : targetSegmentIndex;
    
    let adjustedInsertionIndex = insertionIndex;
    if (fromDay === targetDayIndex && fromSegment < insertionIndex) {
        adjustedInsertionIndex--;
    }

    newPlan.days[targetDayIndex].segments.splice(adjustedInsertionIndex, 0, draggedSegment);
    newPlan.days = newPlan.days.filter((day: any) => day.segments && day.segments.length > 0);

    setLocalPlan(newPlan);
    onPlanUpdate(newPlan);
    handleDragEnd();
  };
  
  const trip = localPlan.trip;
  const days = localPlan.days || [];

  return (
    <div className="h-full flex flex-col bg-brand-surface animate-fade-in">
      <header className="p-4 sm:p-6 border-b border-brand-border flex-shrink-0 bg-brand-surface z-10 shadow-sm">
        <h2 className="text-2xl font-serif text-brand-text-primary">
          Itinerary Snapshot: {trip?.destinations?.join(', ')}
        </h2>
        <p className="text-sm text-brand-text-secondary mt-1">
          A high-level overview of your proposed journey. Drag and drop to reorder.
        </p>
      </header>

      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <div className="flex space-x-6 h-full">
          {days.map((day: any, dayIndex: number) => (
            <div 
                key={day.date}
                className="w-80 flex-shrink-0 bg-brand-bg/50 rounded-xl flex flex-col"
                onDragOver={(e) => handleDragOver(e, dayIndex, null)}
                onDrop={(e) => handleDrop(e, dayIndex, null)}
            >
              <h3 className="font-semibold text-brand-text-primary p-4 border-b border-brand-border/50 text-center">
                {formatDate(day.date)}
              </h3>
              <div className="p-3 space-y-3 overflow-y-auto">
                 {day.segments?.map((segment: any, segIndex: number) => {
                    const isDragged = draggedItem?.dayIndex === dayIndex && draggedItem?.segmentIndex === segIndex;
                    const isDropTargetBefore = dropTarget?.dayIndex === dayIndex && dropTarget?.segmentIndex === segIndex;
                    return (
                        <React.Fragment key={segment.id}>
                            {isDropTargetBefore && <div className="h-10 bg-brand-accent/10 rounded-lg animate-pulse-slow"></div>}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, dayIndex, segIndex)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, dayIndex, segIndex)}
                                className={`p-3 bg-brand-surface rounded-lg shadow-sm border border-brand-border cursor-grab flex items-start space-x-3 transition-opacity ${isDragged ? 'opacity-30' : 'opacity-100'}`}
                            >
                                <div className="flex-shrink-0 pt-1">{getIconForType(segment.type)}</div>
                                <div>
                                    <p className="font-medium text-brand-text-primary text-sm leading-tight">{segment.title}</p>
                                    <p className="text-xs text-brand-text-secondary mt-1 capitalize">{segment.type}</p>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                 })}
                 {dropTarget?.dayIndex === dayIndex && dropTarget?.segmentIndex === null && (
                    <div className="h-10 bg-brand-accent/10 rounded-lg animate-pulse-slow"></div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="p-4 border-t border-brand-border bg-brand-surface/80 backdrop-blur-sm flex items-center justify-end space-x-3">
          <button
            onClick={onRefine}
            className="px-4 py-2 bg-transparent hover:bg-gray-100 text-brand-text-secondary rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Refine Request
          </button>
          <button
            onClick={onApprove}
            className="flex items-center space-x-2 px-5 py-2 bg-brand-accent hover:bg-teal-700 text-white rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/70"
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span>Approve & View Details</span>
          </button>
      </footer>
    </div>
  );
};
