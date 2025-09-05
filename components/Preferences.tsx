import React, { useState } from 'react';
import type { Preferences as PreferencesType } from '../types';
import { SettingsIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface PreferencesProps {
  preferences: PreferencesType;
  onPreferencesChange: (newPreferences: Partial<PreferencesType>) => void;
}

const accommodationOptions = ['Boutique Hotel', 'Luxury Resort', 'Private Villa', 'Unique Stay'];

export const Preferences: React.FC<PreferencesProps> = ({ preferences, onPreferencesChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccommodationChange = (option: string) => {
    const newTypes = preferences.accommodationTypes.includes(option)
      ? preferences.accommodationTypes.filter(item => item !== option)
      : [...preferences.accommodationTypes, option];
    onPreferencesChange({ accommodationTypes: newTypes });
  };

  return (
    <div className="border-b border-brand-border bg-brand-surface">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-4 text-left focus:outline-none transition-colors hover:bg-gray-50"
          aria-expanded={isOpen}
          aria-controls="preferences-panel"
        >
          <div className="flex items-center space-x-3">
            <SettingsIcon className="text-brand-accent"/>
            <span className="font-serif text-lg text-brand-text-primary">Traveler Preferences</span>
          </div>
          {isOpen ? <ChevronUpIcon className="text-brand-text-secondary" /> : <ChevronDownIcon className="text-brand-text-secondary" />}
        </button>
      </div>
      {isOpen && (
        <div id="preferences-panel" className="p-4 pt-0 max-w-4xl mx-auto transition-all duration-300 ease-in-out animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-b-lg">
            {/* Travel Style */}
            <div>
              <label htmlFor="travel-style" className="block text-sm font-medium text-brand-text-secondary mb-1">Travel Style</label>
              <select
                id="travel-style"
                value={preferences.travelStyle}
                onChange={(e) => onPreferencesChange({ travelStyle: e.target.value as PreferencesType['travelStyle'] })}
                className="w-full px-3 py-2 input-styled rounded-lg focus:outline-none text-brand-text-primary"
              >
                <option value="Balanced">Balanced</option>
                <option value="Adventurous">Adventurous</option>
                <option value="Relaxed">Relaxed</option>
                <option value="Cultural">Cultural</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

             {/* Dietary Restrictions */}
            <div>
              <label htmlFor="dietary" className="block text-sm font-medium text-brand-text-secondary mb-1">Dietary Restrictions</label>
              <input
                type="text"
                id="dietary"
                value={preferences.dietaryRestrictions}
                onChange={(e) => onPreferencesChange({ dietaryRestrictions: e.target.value })}
                placeholder="e.g., Vegetarian, gluten-free"
                className="w-full px-3 py-2 input-styled rounded-lg focus:outline-none text-brand-text-primary placeholder-brand-text-secondary/70"
              />
            </div>

            {/* Accessibility Needs */}
            <div className="md:col-span-2">
              <label htmlFor="accessibility" className="block text-sm font-medium text-brand-text-secondary mb-1">Accessibility Needs</label>
              <input
                type="text"
                id="accessibility"
                value={preferences.accessibilityNeeds}
                onChange={(e) => onPreferencesChange({ accessibilityNeeds: e.target.value })}
                placeholder="e.g., Wheelchair access, step-free rooms"
                className="w-full px-3 py-2 input-styled rounded-lg focus:outline-none text-brand-text-primary placeholder-brand-text-secondary/70"
              />
            </div>
            
            {/* Accommodation */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text-secondary mb-2">Preferred Accommodation</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                {accommodationOptions.map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`acc-${option}`}
                      checked={preferences.accommodationTypes.includes(option)}
                      onChange={() => handleAccommodationChange(option)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent/70 checkbox-custom"
                    />
                    <span className="font-medium text-brand-text-primary">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};