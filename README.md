# Luxe Concierge AI

![Luxe Concierge AI Screenshot](https://storage.googleapis.com/aiprompts/creative-work/Luxe_Concierge_AI_Screenshot.png)

An AI-powered luxury travel planner that crafts ultra-detailed, climate-smart itineraries for high-net-worth travelers. This sophisticated web application provides a seamless, conversational interface for users to design their dream journeys with the help of the Google Gemini API.

## ✨ Features

- **Conversational AI Planner**: Engage with a Gemini-powered AI that understands complex travel requests and personal preferences.
- **Dynamic Preference Management**: Easily set and update travel style, dietary needs, accessibility requirements, and accommodation types.
- **Visual Itinerary Summary**: Review a high-level, interactive summary of your trip.
- **Drag & Drop Reordering**: Intuitively rearrange itinerary segments to customize your schedule.
- **Rich Itinerary Details**: Dive into a day-by-day view of your plan, beautifully illustrated with images from the Unsplash API.
- **Interactive Map View**: Toggle to an interactive map displaying all your itinerary locations as pins for a clear geographical overview.
- **Calendar Integration**: Export your entire itinerary as an `.ics` file to easily import into Google Calendar, Apple Calendar, or Outlook.
- **Collaborative Planning**: Generate a unique, compressed link to share a read-only version of your itinerary with travel companions.
- **PDF Export**: Download a beautifully formatted PDF of your itinerary with images for offline viewing or printing.
- **Seamless Booking Flow**: Proceed from drafting to a final confirmation and booking screen.
- **Responsive & Elegant UI**: A clean, modern interface built with React and Tailwind CSS, designed for a premium user experience.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini API (`@google/genai`)](https://ai.google.dev/docs)
- **Imagery**: [Unsplash API](https://unsplash.com/developers)
- **Mapping**: [Leaflet.js](https://leafletjs.com/)
- **Utilities**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) (for PDF export), [ics.js](https://github.com/adamgibbons/ics) (for calendar files), [pako](https://github.com/nodeca/pako) (for link compression)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- You need to have [Node.js](https://nodejs.org/) and a package manager like [npm](https://www.npmjs.com/) installed on your machine.
- A modern web browser.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/luxe-concierge-ai.git
    cd luxe-concierge-ai
    ```

2.  **Install dependencies:**
    *(Note: This project uses ES modules directly in the browser via import maps, so a traditional build step with npm packages might not be required for all server setups. If you were to bundle this with a tool like Vite, this step would be `npm install`.)*

3.  **Set up API Keys:**

    *   **Google Gemini API Key**: The application expects the Gemini API key to be available as an environment variable named `API_KEY`. How you set this will depend on your hosting environment or local development server. The application code references `process.env.API_KEY`.

    *   **Unsplash API Key**: The application will prompt you for an Unsplash API key upon first launch. This key is stored in your browser's `sessionStorage` and is used to fetch itinerary images. You can get a free key from the [Unsplash Developer portal](https://unsplash.com/developers).

4.  **Run the application:**
    You'll need a local development server to serve the `index.html` file. A simple way to do this is using the `serve` package:
    ```bash
    npx serve .
    ```
    Then, open your browser and navigate to the provided local URL (e.g., `http://localhost:3000`).

## Usage

Once the application is running:

1.  If it's your first time, a modal will appear asking for an Unsplash API key. You can provide one to see itinerary images or continue without them.
2.  Use the chat interface to describe your desired trip. Be as detailed as you like! Try the "✨ Try a Detailed Example" button for inspiration.
3.  Adjust your preferences (Travel Style, Dietary Needs, etc.) in the "Traveler Preferences" section. These are sent to the AI with every message.
4.  When the AI has enough information, it will generate a visual summary of the itinerary. You can drag and drop segments to reorder them.
5.  Click "Approve & View Details" to see the full, day-by-day itinerary with images.
6.  Use the buttons in the header to switch to Map View, export to PDF, export to your Calendar, or Share the plan via a link.
7.  Proceed through the confirmation and "booking" steps to complete the flow.

## 📄 License

This project is licensed under the MIT License. You can add a `LICENSE.md` file to your repository with the license text.

## Acknowledgements

-   Powered by the [Google Gemini API](https://ai.google.dev/).
-   Beautiful photography from [Unsplash](https://unsplash.com/).