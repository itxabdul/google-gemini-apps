
export interface UnsplashImageData {
    imageUrl: string;
    downloadUrl: string;
    photographerName: string;
    photographerUrl: string;
}

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

/**
 * Fetches an image and its metadata from the Unsplash API for a given query.
 * Requires the UNSPLASH_API_KEY environment variable to be set.
 * @param query The search term for the image (e.g., "Amalfi Coast hotel").
 * @returns A promise that resolves to an UnsplashImageData object or null.
 */
export const fetchImageForSegment = async (query: string): Promise<UnsplashImageData | null> => {
    if (!process.env.UNSPLASH_API_KEY) {
        console.error("Unsplash API key is not set. Please set the UNSPLASH_API_KEY environment variable.");
        return null;
    }

    const url = new URL(UNSPLASH_API_URL);
    url.searchParams.append('query', query);
    url.searchParams.append('per_page', '1');
    url.searchParams.append('orientation', 'landscape');

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        if (!response.ok) {
            console.error(`Unsplash API error: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const photo = data.results[0];
            return {
                imageUrl: photo.urls.regular,
                downloadUrl: photo.links.download_location,
                photographerName: photo.user.name,
                photographerUrl: photo.user.links.html,
            };
        } else {
            console.warn(`No Unsplash images found for query: "${query}"`);
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
        return null;
    }
};

/**
 * Triggers the download event for a photo on Unsplash, as required by their API guidelines.
 * This should be called after an image has been successfully displayed to the user.
 * @param downloadUrl The specific download_location URL provided by the Unsplash API.
 */
export const triggerUnsplashDownload = async (downloadUrl: string): Promise<void> => {
    if (!process.env.UNSPLASH_API_KEY) {
        console.error("Unsplash API key is not set for download trigger.");
        return;
    }
    
    if (!downloadUrl) {
        console.warn("No download URL provided to trigger download event.");
        return;
    }

    try {
        const response = await fetch(downloadUrl, {
            headers: {
                'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}`,
                'Accept-Version': 'v1'
            }
        });

        if (!response.ok) {
            console.error(`Failed to trigger Unsplash download event: ${response.status} ${response.statusText}`);
        } else {
            // Success! The download has been tracked by Unsplash.
            console.log("Successfully triggered Unsplash download for:", downloadUrl);
        }
    } catch (error) {
        console.error("Error triggering Unsplash download:", error);
    }
};
