
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  summary: string;
  jsonData: any | null;
  isError?: boolean;
}

export interface Preferences {
  travelStyle: 'Adventurous' | 'Relaxed' | 'Cultural' | 'Luxury' | 'Balanced';
  dietaryRestrictions: string;
  accessibilityNeeds: string;
  accommodationTypes: string[];
}
