
export interface UnsplashImageData {
    imageUrl: string;
    downloadUrl: string;
    photographerName: string;
    photographerUrl: string;
}

const getUnsplashApiKey = (): string | null => {
    return sessionStorage.getItem('UNSPLASH_API_KEY');
};

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

/**
 * Triggers the download event for a photo on Unsplash, as required by their API guidelines.
 * This should be called after an image has been successfully displayed to the user.
 * @param downloadUrl The specific download_location URL provided by the Unsplash API.
 */
const triggerUnsplashDownload = async (downloadUrl: string, apiKey: string): Promise<void> => {
    if (!downloadUrl) {
        console.warn("No download URL provided to trigger download event.");
        return;
    }

    try {
        // This is a fire-and-forget request. We don't need to wait for the result.
        fetch(downloadUrl, {
            headers: {
                'Authorization': `Client-ID ${apiKey}`,
                'Accept-Version': 'v1'
            }
        });
    } catch (error) {
        console.error("Error triggering Unsplash download:", error);
    }
};


/**
 * Fetches a batch of images and their metadata from the Unsplash API for a given query.
 * This is designed to make a single API call for an entire itinerary.
 * Reads the UNSPLASH_API_KEY from sessionStorage.
 * @param query The search term for the images (e.g., "Amalfi Coast").
 * @param count The number of images to fetch.
 * @returns A promise that resolves to an array of UnsplashImageData objects or null.
 */
export const fetchImagesForItinerary = async (query: string, count: number): Promise<UnsplashImageData[] | null> => {
    const apiKey = getUnsplashApiKey();
    if (!apiKey) {
        return null; // Silently return null if the key is not available.
    }

    if (count === 0) {
        return [];
    }

    const url = new URL(UNSPLASH_API_URL);
    url.searchParams.append('query', query);
    url.searchParams.append('per_page', count.toString());
    url.searchParams.append('orientation', 'landscape');

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Client-ID ${apiKey}`,
                'Accept-Version': 'v1'
            }
        });

        if (!response.ok) {
            console.error(`Unsplash API error: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const images: UnsplashImageData[] = data.results.map((photo: any) => ({
                imageUrl: photo.urls.regular,
                downloadUrl: photo.links.download_location,
                photographerName: photo.user.name,
                photographerUrl: photo.user.links.html,
            }));
            
            // Trigger download events in the background for API compliance.
            images.forEach(image => triggerUnsplashDownload(image.downloadUrl, apiKey));

            return images;
        } else {
            console.warn(`No Unsplash images found for query: "${query}"`);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch images from Unsplash:", error);
        return null;
    }
};
