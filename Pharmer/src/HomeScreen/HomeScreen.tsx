// src/screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Types for our drug data
interface Drug {
  id: string;
  name: string;
  description: string;
  price: number;
  isEssential: boolean;
}

export default function HomeScreen() {
  // State declarations
  const [emergencyDrugs, setEmergencyDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllEmergency, setShowAllEmergency] = useState(false);

  // Fetch drugs from API
  useEffect(() => {
    fetchEmergencyDrugs();
  }, []);

  const fetchEmergencyDrugs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual OpenFDA API call
      const mockDrugs: Drug[] = [
        {
          id: '1',
          name: 'Aspirin',
          description: 'For heart attack symptoms',
          price: 8.99,
          isEssential: true
        },
        {
          id: '2', 
          name: 'Paracetamol',
          description: 'Headache & fever relief',
          price: 5.99,
          isEssential: true
        },
        {
          id: '3',
          name: 'Ibuprofen',
          description: 'Pain & inflammation relief',
          price: 7.99,
          isEssential: true
        },
        {
          id: '4',
          name: 'Bandages',
          description: 'Wound dressing kit',
          price: 6.99,
          isEssential: true
        },
        {
          id: '5',
          name: 'Antiseptic Cream',
          description: 'Infection prevention',
          price: 7.49,
          isEssential: true
        }
      ];
      
      setEmergencyDrugs(mockDrugs);
    } catch (error) {
      console.error('Failed to fetch drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedEmergencyDrugs = showAllEmergency ? emergencyDrugs : emergencyDrugs.slice(0, 3);

  const renderEmergencyItem = ({ item }: { item: Drug }) => (
    <TouchableOpacity style={styles.emergencyItem}>
      <View style={styles.itemImage}>
        <Ionicons name="medkit" size={32} color="#4CAF50" />
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Loading medications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search and Cart */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medications..."
          />
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Must-Have Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Must-Haves</Text>
            {emergencyDrugs.length > 3 && (
              <TouchableOpacity 
                onPress={() => setShowAllEmergency(!showAllEmergency)}
                style={styles.viewMoreButton}
              >
                <Text style={styles.viewMoreText}>
                  {showAllEmergency ? 'View Less' : 'View More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={displayedEmergencyDrugs}
            renderItem={renderEmergencyItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.emergencyGrid}
          />
        </View>

        {/* Past Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orders</Text>
          <View style={styles.pastOrders}>
            <Text style={styles.placeholderText}>Your previous orders will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  cartButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewMoreText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  emergencyGrid: {
    justifyContent: 'space-between',
  },
  emergencyItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#E8F5E8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pastOrders: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
});