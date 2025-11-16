// src/screens/SearchScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Assuming you have imported your API service here:
import { FDADrugLabel, openFDAApi } from '../openFDA/papi';

// --- Local Data Types (Matching the Drug interface from HomeScreen) ---
interface Drug {
    id: string;
    name: string;
    description: string;
    price: number;
    isEssential: boolean;
    precautions?: string;
}

// --- Component Start ---

export default function SearchScreen() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(['aspirin', 'pain relief', 'vitamins']); // Mock recents

    // --- Data Transformation Logic ---

    /**
     * Maps the raw OpenFDA data structure (FDADrugLabel) into the local app structure (Drug).
     */
    const transformFDAResult = (fdaDrug: FDADrugLabel, index: number): Drug => {
        // Extract Name
        const brandName = fdaDrug.openfda?.brand_name?.[0];
        const genericName = fdaDrug.openfda?.generic_name?.[0];
        const drugName = brandName || genericName || 'Unknown Drug';

        // Extract Description (Usage/Indications)
        const usageText = openFDAApi.extractContent(fdaDrug.indications_and_usage) ||
                          openFDAApi.extractContent(fdaDrug.purpose);

        let description = 'Medication for various conditions.';
        if (usageText) {
            // Take the first 150 characters for the listing description
            description = usageText.substring(0, 150) + (usageText.length > 150 ? '...' : '');
        }

        // Extract Precautions (Adverse Reactions/Warnings)
        const precautionsText = openFDAApi.extractContent(fdaDrug.adverse_reactions) ||
                              openFDAApi.extractContent(fdaDrug.warnings_and_cautions);
        
        // Return the mapped object
        return {
            id: fdaDrug.set_id || fdaDrug.application_number || `search-drug-${index}`,
            name: drugName,
            description: description,
            price: Math.floor(Math.random() * 15) + 5, // Random price for demo
            isEssential: true,
            precautions: precautionsText || 'Safety information unavailable.',
        };
    };

    // --- API Search Handler ---

    const handleApiSearch = async (query: string) => {
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        
        setLoading(true);
        try {
            const rawResults = await openFDAApi.searchDrugs(query);
            
            const transformedResults = rawResults
                // Filter out results that have no usable name
                .filter(drug => drug.openfda?.brand_name?.[0] || drug.openfda?.generic_name?.[0])
                .map(transformFDAResult);

            setSearchResults(transformedResults);

        } catch (error) {
            console.error('API search failed:', error);
            // Optionally set a friendly error message for the user
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Call the API search function on every text change
        handleApiSearch(query);

        // Add to recent searches (optional client-side demo feature)
        if (query.trim() !== '' && !recentSearches.includes(query.toLowerCase())) {
            setRecentSearches(prev => [query.toLowerCase(), ...prev.slice(0, 4)]);
        }
    };

    // --- User Interaction Handlers ---

    const handleDrugPress = (drug: Drug) => {
        // This simulates showing the drug details modal (like on the HomeScreen)
        Alert.alert(
            drug.name, 
            `$${drug.price}\n\nUses: ${drug.description}\n\n--- Warnings/Side Effects ---\n${drug.precautions}`,
            [{ text: "Add to Cart", onPress: () => handleAddToCart(drug) }, { text: "Close" }]
        );
    };

    const handleAddToCart = (drug: Drug) => {
        Alert.alert('Added to Cart', `${drug.name} has been added to your cart.`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        Keyboard.dismiss();
    };

    const searchFromRecent = (query: string) => {
        setSearchQuery(query);
        handleApiSearch(query); // Call API with recent search term
    };
    
    // --- Rendering Functions ---

    const renderDrugItem = ({ item }: { item: Drug }) => (
        <TouchableOpacity
            style={styles.drugItem}
            onPress={() => handleDrugPress(item)}
        >
            <View style={styles.itemImage}>
                <Ionicons name="medical" size={32} color="#4CAF50" />
            </View>
            <View style={styles.drugInfo}>
                <Text style={styles.drugName}>{item.name}</Text>
                <Text style={styles.drugDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={styles.drugPrice}>{`₹${item.price}`}</Text>
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
            >
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderRecentSearch = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.recentSearchItem}
            onPress={() => searchFromRecent(item)}
        >
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.recentSearchText}>{item}</Text>
        </TouchableOpacity>
    );

    // --- Main Render ---

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search medications, brands, symptoms..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus={true}
                        returnKeyType="search"
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content Display */}
            <View style={styles.content}>
                {searchQuery === '' ? (
                    // Initial State: Recent Searches and Categories
                    <View style={styles.recentSearches}>
                        <Text style={styles.sectionTitle}>Recent Searches</Text>
                        <FlatList
                            data={recentSearches}
                            renderItem={renderRecentSearch}
                            keyExtractor={(item) => item}
                            style={styles.recentList}
                        />
                        <Text style={styles.sectionTitle}>Popular Categories</Text>
                        <View style={styles.categories}>
                            <TouchableOpacity style={styles.categoryChip} onPress={() => searchFromRecent('pain relief')}>
                                <Text style={styles.categoryText}>Pain Relief</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.categoryChip} onPress={() => searchFromRecent('allergy')}>
                                <Text style={styles.categoryText}>Allergy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.categoryChip} onPress={() => searchFromRecent('vitamins')}>
                                <Text style={styles.categoryText}>Vitamins</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // Search Results View
                    <View style={styles.searchResults}>
                        {loading ? (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#4CAF50" />
                                <Text style={styles.loadingText}>Searching FDA data...</Text>
                            </View>
                        ) : searchResults.length > 0 ? (
                            <>
                                <View style={styles.resultsHeader}>
                                    <Text style={styles.resultsTitle}>
                                        {`Found ${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${searchQuery}"`}
                                    </Text>
                                </View>
                                <FlatList
                                    data={searchResults}
                                    renderItem={renderDrugItem}
                                    keyExtractor={item => item.id}
                                    showsVerticalScrollIndicator={false}
                                />
                            </>
                        ) : (
                            <View style={styles.noResults}>
                                <Ionicons name="search-outline" size={64} color="#ccc" />
                                <Text style={styles.noResultsText}>No medications found</Text>
                                <Text style={styles.noResultsSubtext}>Try different keywords or check spelling</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

// --- Stylesheet ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
    },
    backButton: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginHorizontal: 5,
    },
    content: {
        flex: 1,
    },
    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    recentSearches: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    recentList: {
        marginBottom: 25,
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    recentSearchText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    categoryText: {
        color: '#4CAF50',
        fontWeight: '500',
    },
    searchResults: {
        flex: 1,
    },
    resultsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    resultsTitle: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    drugItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemImage: {
        width: 50,
        height: 50,
        backgroundColor: '#E8F5E8',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    drugInfo: {
        flex: 1,
    },
    drugName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    drugDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        lineHeight: 18,
    },
    drugPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});