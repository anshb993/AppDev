// src/services/openFDAApi.ts

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug';
const API_KEY = 'YOUR_API_KEY_HERE'; // You can get from https://open.fda.gov/apis/

export interface FDADrug {
  application_number: string;
  brand_name: string;
  generic_name: string;
  manufacturer_name: string;
  product_type: string;
  route: string[];
  active_ingredients: Array<{
    name: string;
    strength: string;
  }>;
  purpose?: string[];
}

export const openFDAApi = {
  // Search drugs by name
  searchDrugs: async (searchTerm: string): Promise<FDADrug[]> => {
    try {
      const response = await fetch(
        `${OPENFDA_BASE_URL}/label.json?api_key=${API_KEY}&search=openfda.brand_name:"${searchTerm}"&limit=10`
      );
      
      if (!response.ok) {
        throw new Error(`FDA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching from OpenFDA:', error);
      return [];
    }
  },

  // Get emergency/essential drugs
  getEmergencyDrugs: async (): Promise<FDADrug[]> => {
    const emergencyDrugNames = ['aspirin', 'ibuprofen', 'acetaminophen', 'bandage', 'antiseptic'];
    
    try {
      // Get aspirin as primary emergency drug
      const response = await fetch(
        `${OPENFDA_BASE_URL}/label.json?api_key=${API_KEY}&search=openfda.generic_name:"aspirin"&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`FDA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching emergency drugs:', error);
      // Return fallback data if API fails
      return getFallbackEmergencyDrugs();
    }
  },

  // Get drug details by application number
  getDrugDetails: async (applicationNumber: string): Promise<FDADrug | null> => {
    try {
      const response = await fetch(
        `${OPENFDA_BASE_URL}/label.json?api_key=${API_KEY}&search=application_number:"${applicationNumber}"`
      );
      
      if (!response.ok) {
        throw new Error(`FDA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error('Error fetching drug details:', error);
      return null;
    }
  }
};

// Fallback data in case API is unavailable
const getFallbackEmergencyDrugs = (): any[] => {
  return [
    {
      application_number: 'NDA020042',
      brand_name: 'Aspirin',
      generic_name: 'aspirin',
      manufacturer_name: 'Bayer',
      product_type: 'HUMAN OTC DRUG',
      route: ['ORAL'],
      active_ingredients: [{ name: 'ASPIRIN', strength: '81 mg' }],
      purpose: ['Analgesic', 'Antipyretic']
    },
    {
      application_number: 'NDA020018',
      brand_name: 'Tylenol',
      generic_name: 'acetaminophen',
      manufacturer_name: 'Johnson & Johnson',
      product_type: 'HUMAN OTC DRUG',
      route: ['ORAL'],
      active_ingredients: [{ name: 'ACETAMINOPHEN', strength: '500 mg' }],
      purpose: ['Pain reliever', 'Fever reducer']
    },
    {
      application_number: 'NDA020056',
      brand_name: 'Advil',
      generic_name: 'ibuprofen',
      manufacturer_name: 'Pfizer',
      product_type: 'HUMAN OTC DRUG',
      route: ['ORAL'],
      active_ingredients: [{ name: 'IBUPROFEN', strength: '200 mg' }],
      purpose: ['Pain reliever', 'Anti-inflammatory']
    }
  ];
};