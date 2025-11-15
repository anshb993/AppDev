// src/services/openFDAApi.ts

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug';

/**
 * Interface representing the key fields we want to extract from the OpenFDA Labeling API.
 * Most clinical text fields (like indications) are arrays of strings.
 */
export interface FDADrugLabel {
    // Unique identifiers
    application_number: string;
    set_id?: string;
    
    // OpenFDA nested fields
    openfda?: {
        brand_name?: string[];
        generic_name?: string[];
        manufacturer_name?: string[];
    };
    
    // Clinical content fields (Arrays of strings/paragraphs)
    indications_and_usage?: string[];
    adverse_reactions?: string[];
    warnings_and_cautions?: string[];
    purpose?: string[];
    
    // Other fields
    product_type?: string;
    route?: string[];
}

/**
 * Utility to safely extract and join array-of-strings fields from OpenFDA response.
 * This handles missing fields and joins paragraphs into a single string.
 */
const extractContent = (content?: string[]): string => {
    if (!content || !Array.isArray(content) || content.length === 0) {
        return '';
    }
    // Joins all paragraphs and cleans up potential HTML/markdown characters
    return content.join('\n\n').replace(/<\/?[^>]+(>|$)/g, "").trim();
};

export const openFDAApi = {
    /**
     * Searches the OpenFDA Drug Labeling database by brand or generic name.
     */
    searchDrugs: async (searchTerm: string): Promise<FDADrugLabel[]> => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return [];

        // Search both brand name and generic name for better results
        // Use +AND+ for an exact phrase search and filter out drug labels without a brand name
        const searchURL = `${OPENFDA_BASE_URL}/label.json?search=openfda.brand_name:"${query}"+OR+openfda.generic_name:"${query}"&limit=10`;

        try {
            const response = await fetch(searchURL);
            if (response.status === 404) {
                console.log(`OpenFDA search for "${searchTerm}" returned no results (404).`);
                return []; // Return empty array immediately
            }
            if (!response.ok) {
                // Throw an error for non-2xx status codes
                throw new Error(`FDA API error: ${response.status} (${response.statusText})`);
            }
            
            const data = await response.json();
            // console.log('FDA Search Data Received:', data.results);
            return data.results || [];

        } catch (error) {
            console.error('Error fetching from OpenFDA:', error);
            // Return an empty array on failure
            return [];
        }
    },

    /**
     * Gets drug details by a unique Set ID (optional, but good for detailed view).
     */
    getDrugDetailsBySetId: async (setId: string): Promise<FDADrugLabel | null> => {
        try {
            const response = await fetch(
                `${OPENFDA_BASE_URL}/label.json?search=set_id:"${setId}"&limit=1`
            );
            
            if (!response.ok) {
                throw new Error(`FDA API error: ${response.status}`);
            }
            
            const data = await response.json();
            // The result is the first element of the results array
            return data.results?.[0] || null;
        } catch (error) {
            console.error('Error fetching drug details by Set ID:', error);
            return null;
        }
    },
    
    // Expose the content extraction utility for use in the UI component
    extractContent,
};

// Replace your original 'openFDAApi' export with this one.
// You no longer need the getEmergencyDrugs or getDrugDetails by applicationNumber 
// since searchDrugs and getDrugDetailsBySetId cover the functionality better.