
import React, { useState, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { Message, Preferences as PreferencesType, AppState } from './types';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { Preferences } from './components/Preferences';
import { ItineraryViewer } from './components/ItineraryViewer';
import { VisualSummaryViewer } from './components/VisualSummaryViewer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ConfirmationViewer } from './components/ConfirmationViewer';
import { SuccessView } from './components/SuccessView';
import { initChatSession, sendMessageAndGetStream } from './services/geminiService';
import { fetchImagesForItinerary } from './services/unsplashService';
import type { UnsplashImageData } from './services/unsplashService';


const parseAIResponse = (responseText: string): { summary: string; jsonData: any | null } => {
  const separator = '---JSON_SEPARATOR---';
  const parts = responseText.split(separator);
  const summary = parts[0]?.trim() ?? 'Sorry, I encountered an issue.';
  let jsonData = null;

  if (parts.length > 1 && parts[1]) {
    const jsonString = parts[1];
    
    // Find the start and end of the JSON object, accommodating for markdown code blocks or other text
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const potentialJson = jsonString.substring(jsonStart, jsonEnd + 1);
      try {
        jsonData = JSON.parse(potentialJson);
      } catch (e) {
        console.error("Failed to parse JSON from AI response:", e);
        console.error("Attempted to parse:", potentialJson);
      }
    } else {
        console.warn("Could not find a valid JSON object in the AI response after the separator.");
    }
  }
  return { summary, jsonData };
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [itineraryPlan, setItineraryPlan] = useState<any | null>(null);
  const [itineraryImages, setItineraryImages] = useState<UnsplashImageData[] | null>(null);
  const [preferences, setPreferences] = useState<PreferencesType>({
    travelStyle: 'Balanced',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    accommodationTypes: ['Boutique Hotel'],
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [appState, setAppState] = useState<AppState>('chatting');

  // Fix: Explicitly type initialMessage as Message to ensure type compatibility.
  const initialMessage: Message = {
      id: 'initial-message',
      sender: 'ai',
      summary: "Good day. I am Luxe Concierge, your personal travel planner. How may I assist you in crafting an unforgettable journey today? Please provide me with your destination, dates, party size, and approximate budget to begin.",
      jsonData: null
  };

  useEffect(() => {
    const key = sessionStorage.getItem('UNSPLASH_API_KEY');
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
    
    const initChat = () => {
      try {
        const chatSession = initChatSession();
        setChat(chatSession);
        setMessages([initialMessage]);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
        setError(errorMessage);
        setMessages([{
          id: 'error-init',
          sender: 'ai',
          summary: `There was an error initializing the AI Concierge: ${errorMessage}`,
          jsonData: null,
          isError: true
        }]);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (!itineraryPlan || (appState !== 'detailed_itinerary' && appState !== 'confirmation')) {
        if(appState !== 'detailed_itinerary' && appState !== 'confirmation') {
            setItineraryImages(null);
        }
        return;
    }

    const fetchImages = async () => {
        setItineraryImages(null); // Set to null to indicate loading for the new plan
        const destinations = itineraryPlan.trip?.destinations?.join(' ') || 'travel';
        const segmentCount = itineraryPlan.days?.reduce((acc: number, day: any) => acc + (day.segments?.length || 0), 0) || 0;
        
        if (segmentCount === 0) {
            setItineraryImages([]); // No segments, no images needed
            return;
        }

        const images = await fetchImagesForItinerary(destinations, segmentCount);
        setItineraryImages(images || []); // Set to fetched images or an empty array on failure/no results
    };

    if(itineraryImages === null) fetchImages();

  }, [itineraryPlan, appState]);
  
  const handleSaveApiKey = (key: string) => {
    sessionStorage.setItem('UNSPLASH_API_KEY', key);
    setIsApiKeyModalOpen(false);
  };
  
  const handleContinueWithoutKey = () => {
    setIsApiKeyModalOpen(false);
  };

  const handlePreferencesChange = (newPreferences: Partial<PreferencesType>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };
  
  const handleApproveSummary = () => setAppState('detailed_itinerary');
  const handleRefineRequest = () => setAppState('chatting');
  const handleReturnToSummary = () => setAppState('visual_summary');
  const handlePlanUpdate = (updatedPlan: any) => setItineraryPlan(updatedPlan);
  const handleProceedToConfirmation = () => setAppState('confirmation');
  const handleConfirmBooking = () => setAppState('confirmed');
  const handlePlanAnotherTrip = () => {
    setMessages([initialMessage]);
    setItineraryPlan(null);
    setItineraryImages(null);
    setAppState('chatting');
  };

  const handleSendMessage = async (inputText: string) => {
    if (!chat) {
      setError("Chat is not initialized. Please refresh the page.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    if (appState !== 'chatting') {
        setAppState('chatting');
    }
    
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', summary: inputText, jsonData: null };
    setMessages(prev => [...prev, userMessage]);

    const preferencesText = `Current Traveler Preferences:\n- Style: ${preferences.travelStyle}\n- Dietary: ${preferences.dietaryRestrictions || 'None'}\n- Accessibility: ${preferences.accessibilityNeeds || 'None'}\n- Accommodation: ${preferences.accommodationTypes.join(', ')}`;
    
    let messageWithContext = inputText;
    if (itineraryPlan) {
        messageWithContext = `CURRENT_PLAN_JSON: ${JSON.stringify(itineraryPlan)}\n\nUSER_REQUEST: ${inputText}`;
    }
    
    const fullPrompt = `${preferencesText}\n\n---\n\n${messageWithContext}`;
    
    const aiMessageId = Date.now().toString() + '-ai';
    // Fix: Explicitly type the new message object to match the Message interface.
    const aiPlaceholderMessage: Message = { id: aiMessageId, sender: 'ai', summary: '', jsonData: null };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    try {
      let fullResponseText = '';
      const stream = await sendMessageAndGetStream(chat, fullPrompt);

      for await (const chunk of stream) {
        fullResponseText += chunk;
        const currentSummary = fullResponseText.split('---JSON_SEPARATOR---')[0];
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId ? { ...m, summary: currentSummary } : m
        ));
      }

      const { summary, jsonData } = parseAIResponse(fullResponseText);
      setMessages(prev => prev.map(m => 
        m.id === aiMessageId ? { ...m, summary, jsonData } : m
      ));
      
      if (jsonData?.plan_draft) {
        setItineraryImages(null);
        setItineraryPlan(jsonData.plan_draft);
        setAppState('visual_summary');
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      const errorMsg: Message = { id: aiMessageId + '-err', sender: 'ai', isError: true, summary: `My apologies, I seem to have encountered an error: ${errorMessage}`, jsonData: null };
      setMessages(prev => prev.map(m => m.id === aiMessageId ? errorMsg : m));
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch(appState) {
        case 'confirmed':
            return <SuccessView onPlanAnother={handlePlanAnotherTrip} />;
        case 'confirmation':
            return (
                <div className="h-screen w-screen bg-brand-bg p-4 animate-fade-in">
                    <ConfirmationViewer
                        planData={itineraryPlan}
                        onBack={() => setAppState('detailed_itinerary')}
                        onConfirm={handleConfirmBooking}
                    />
                </div>
            );
        case 'detailed_itinerary':
            return (
                <div className="h-screen w-screen bg-brand-bg p-4 animate-fade-in">
                    <ItineraryViewer 
                        planData={itineraryPlan} 
                        itineraryImages={itineraryImages}
                        onBack={handleReturnToSummary}
                        onProceed={handleProceedToConfirmation}
                    />
                </div>
            );
        case 'chatting':
        case 'visual_summary':
        default:
            return (
                <div className="flex h-screen font-sans bg-brand-bg overflow-hidden">
                    <div className="flex flex-col w-full md:w-[45%] lg:w-2/5 h-full max-h-screen">
                        <div className="flex flex-col m-4 content-card rounded-2xl overflow-hidden h-full">
                            <Header />
                            <Preferences preferences={preferences} onPreferencesChange={handlePreferencesChange} />
                            <main className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto">
                                    <ChatWindow messages={messages} isLoading={isLoading} />
                                </div>
                            </main>
                            <footer className="p-4 border-t border-brand-border bg-brand-surface">
                                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                            </footer>
                        </div>
                    </div>
                    <aside className="hidden md:flex flex-1 h-full p-4 pl-0">
                        <div className="content-card rounded-2xl overflow-hidden h-full w-full">
                            <VisualSummaryViewer 
                                planData={itineraryPlan} 
                                onApprove={handleApproveSummary}
                                onRefine={handleRefineRequest}
                                onPlanUpdate={handlePlanUpdate}
                            />
                        </div>
                    </aside>
                </div>
            );
    }
  };


  return (
    <>
      {isApiKeyModalOpen && (
        <ApiKeyModal 
          onSaveKey={handleSaveApiKey} 
          onContinueWithoutKey={handleContinueWithoutKey} 
        />
      )}
      {renderContent()}
    </>
  );
};

export default App;
