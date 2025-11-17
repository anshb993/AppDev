// src/screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth'; // 1. IMPORT AUTH
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AnimatedQuote from '../animatedThiing/quote';
import { useCart } from '../cart/contents';
// Types for our drug data
interface Drug {
  id: string;
  name: string;
  description: string;
  price: number;
  isEssential: boolean;
  precautions?: string;
}
interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  date: Date;
  items: OrderItem[];
  total: number;
}

// --- FULL MOCK EMERGENCY DRUGS LIST ---
const MOCK_EMERGENCY_DRUGS: Drug[] = [
  {
    id: '1',
    name: 'Low Dose Aspirin Enteric Safety-Coated',
    description: 'For heart health maintenance.',
    price: 80.99,
    isEssential: true,
    precautions: 'Do not use if allergic to aspirin.'
  },
  {
    id: '2',
    name: 'Ibuprofen Tablets (200mg)',
    description: 'Pain reliever and fever reducer.',
    price: 75.99,
    isEssential: true,
    precautions: 'Take with food. Do not exceed recommended dosage.'
  },
  {
    id: '3',
    name: 'Allergy Relief Antihistamines',
    description: 'For temporary relief of allergy symptoms.',
    price: 124.50,
    isEssential: true,
    precautions: 'May cause drowsiness. Avoid alcohol.'
  },
  {
    id: '4',
    name: 'Antacid Chewable Tablets',
    description: 'For heartburn relief and acid indigestion.',
    price: 57.99,
    isEssential: true,
    precautions: 'Consult doctor if symptoms persist.'
  },
  {
    id: '5',
    name: 'Antiseptic Cream (Topical)',
    description: 'For minor cuts, scrapes, and burns.',
    price: 44.50,
    isEssential: true,
    precautions: 'For external use only.'
  },
  {
    id: '6',
    name: 'Assorted Bandages',
    description: 'Sterile wound dressing for minor cuts.',
    price: 39.99,
    isEssential: true,
    precautions: 'Change daily.'
  },
  {
    id: '7',
    name: 'Epinephrine Auto-Injector (EpiPen)',
    description: 'Emergency treatment of severe allergic reactions.',
    price: 199.99,
    isEssential: true,
    precautions: 'Prescription required. Seek immediate medical attention after use.'
  }
];
// -------------------------------------


export default function HomeScreen() {
  const navigation = useNavigation();
  const { addToCart, cartItems } = useCart();
  // State declarations
  const [emergencyDrugs, setEmergencyDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // Check if the user is signed in anonymously
        setIsGuest(user.isAnonymous);
      } else {
        // If no user, treat as a signed-out state (can also be treated as guest if that's the default flow)
        setIsGuest(false);
      }
    });

    // Clean up the listener when the component unmounts
    return subscriber;
  }, []);


  // Fetch drugs (using mock data for now)
  useEffect(() => {
    fetchEmergencyDrugs();
  }, []);

  const fetchEmergencyDrugs = async () => {
    try {
      setLoading(true);
      // Use the new, fuller mock data list
      setEmergencyDrugs(MOCK_EMERGENCY_DRUGS);
    } catch (error) {
      console.error('Failed to fetch drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrugPress = (drug: Drug) => {
    setSelectedDrug(drug);
    setModalVisible(true);
  };

  const handleAddToCart = (drug: Drug) => {
    // 4. GUARD CLAUSE for guest users
    if (isGuest) {
      Alert.alert(
        "Action Required",
        "Please sign in or create an account to use the cart and place orders.",
        [
          {
            text: "Later",
            style: "cancel"
          },
          {
            text: "Sign Up/Sign In",
            onPress: () => navigation.navigate('SignUp' as never) // Navigate to the sign up screen
          }
        ]
      );
      return; // STOP execution for guest users
    }

    // Only runs if the user is NOT a guest
    addToCart({ id: drug.id, name: drug.name, price: drug.price });
    Alert.alert('Added to Cart', `${drug.name} has been added to your cart.`);
  };
  const appQuotes = [
    "Your essential pharmacy, delivered fast.",
    "Quality care, right at your doorstep.",
    "Order Medicines in Minutes",
    "Health and convenience, hand in hand.",
    "Your Health, Delivered Fast",
    "Reliable medication, when you need it most.",
  ];

  const MOCK_PAST_ORDERS: Order[] = [
    {
      id: 'ORD1001',
      date: new Date(2025, 10, 10), // November 10, 2025
      items: [{ name: 'Ibuprofen Tablets', quantity: 1 }, { name: 'Antiseptic Cream', quantity: 2 }],
      total: 16.99,
    },
    {
      id: 'ORD1002',
      date: new Date(2025, 10, 5), // November 5, 2025
      items: [{ name: 'Low Dose Aspirin', quantity: 1 }],
      total: 9.99,
    },
  ];

  const [pastOrders, setPastOrders] = useState<Order[]>(MOCK_PAST_ORDERS);
  const renderEmptyOrders = () => (
    <View style={styles.pastOrdersEmpty}>
      <Ionicons name="receipt-outline" size={60} color="#ccc" />
      <Text style={styles.emptyOrderTitle}>You haven&apos;t ordered yet.</Text>
      <Text style={styles.emptyOrderSubtitle}>Let&apos;s find your essentials.</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Search' as never)}
      >
        <Text style={styles.browseButtonText}>Browse Essentials</Text>
      </TouchableOpacity>
    </View>
  );
  const renderRecentOrder = (order: Order) => {
    const formattedDate = order.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const itemSummary = order.items.map(i => `${i.name} (${i.quantity})`).join(', ');

    return (
      <TouchableOpacity
        style={styles.pastOrdersRecent}
        onPress={() => Alert.alert('Order Details', `Order ID: ${order.id}\nItems: ${itemSummary}`)}
      >
        <View style={styles.recentHeader}>
          <Ionicons name="time-outline" size={24} color="#666" />
          <Text style={styles.recentDate}>{formattedDate}</Text>
          <Text style={styles.recentTotal}>{`₹${order.total.toFixed(2)}`}</Text>
        </View>
        <Text style={styles.recentItems} numberOfLines={1}>
          {itemSummary}
        </Text>
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    );
  };
  // Renders a single emergency drug card
  const renderEmergencyItem = ({ item }: { item: Drug }) => (
    <TouchableOpacity
      style={styles.emergencyItem} // Width is set here to allow side-by-side scrolling
      onPress={() => handleDrugPress(item)}
    >
      <View style={styles.itemImage}>
        <Ionicons name="medical" size={32} color="#4CAF50" />
      </View>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={1}>
        {item.description}
      </Text>
      <View style={styles.priceCartRow}>
        <Text style={styles.itemPrice}>{`₹${item.price}`}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate('Search' as never)}
        >
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search medications...</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart' as never)}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <AnimatedQuote quotes={appQuotes} intervalMs={10000} />
        {/* Emergency Must-Have Items Section - NOW HORIZONTAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Must-Haves</Text>

          {/* Key Change: FlatList is now horizontal */}
          <FlatList
            data={emergencyDrugs}
            renderItem={renderEmergencyItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emergencyGrid}
            key={"horizontal-emergency-list"} // <--- ADD THIS KEY
          />
        </View>

        {/* Past Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orders</Text>

          {pastOrders.length > 0 ? renderRecentOrder(pastOrders[0]) : renderEmptyOrders()}
        </View>
      </ScrollView>

      {/* Drug Details Modal (No changes needed here) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedDrug && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalImage}>
                    <Ionicons name="medical" size={48} color="#4CAF50" />
                  </View>
                  <Text style={styles.modalTitle}>{selectedDrug.name}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Description</Text>
                  <Text style={styles.modalText}>{selectedDrug.description}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Precautions</Text>
                  <Text style={styles.modalText}>
                    {selectedDrug.precautions || 'Consult your doctor before use. Keep out of reach of children.'}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Price</Text>
                  <Text style={styles.modalPrice}>{`₹${selectedDrug.price}`}</Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.addCartButton]}
                    onPress={() => {
                      handleAddToCart(selectedDrug);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.addCartButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
// (Only relevant styles were modified to achieve the horizontal effect)

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
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
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
  priceCartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 0, // Adjusted padding
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  // --- MODIFIED STYLE FOR HORIZONTAL SCROLLING ---
  emergencyGrid: {
    paddingRight: 20, // Adds padding to the end of the horizontal list
  },
  emergencyItem: {
    // Crucial: Set a fixed width smaller than the screen width
    width: 150,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 12,
    marginRight: 15, // Space between cards
    marginBottom: 20, // Pushes items up from the bottom of the section
    alignItems: 'center',
    height: 220, // Fixed height to keep cards uniform
  },
  // ------------------------------------------------

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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
    height: 32, // Fixed height for 2 lines of text
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pastOrdersEmpty: {
    padding: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 0, // Keep section padding
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyOrderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptyOrderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- STYLES FOR RECENT ORDER PREVIEW ---
  pastOrdersRecent: {
    padding: 15,
    backgroundColor: '#e8f5e8', // Light green background
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  recentTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  recentItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    alignSelf: 'flex-start',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cartButton: {
    padding: 5,
    position: 'relative', //  REQUIRED: Sets up the coordinate system for the badge
    marginRight: 10,
  },

  cartBadge: {
    position: 'absolute', //  REQUIRED: Allows precise placement
    right: 0,
    top: 0,
    backgroundColor: 'red', // Or any color you prefer
    borderRadius: 10,
    minWidth: 18, // Ensures small numbers like are visible
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Modal Styles (Unchanged)
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E8F5E8',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  modalSection: {
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  addCartButton: {
    backgroundColor: '#4CAF50',
  },
  addCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});