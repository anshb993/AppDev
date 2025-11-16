// src/screens/CartScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Import Cart Context
import { CartItem, useCart } from '../cart/contents';
// Assuming your CartContext.tsx is located at ../context/CartContext

// --- Constants ---
const TAX_RATE = 0.08; // Example 8% tax rate

export default function CartScreen() {
    const navigation = useNavigation();
    const {
        cartItems,
        getCartTotal,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const subtotal = getCartTotal();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // --- Handlers ---

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert("Empty Cart", "Please add items to your cart before checking out.");
            return;
        }
        Alert.alert(
            "Checkout Complete",
            `Order Total: $${total.toFixed(2)}\n\nThank you for your order! (Demo complete)`,
            [
                {
                    text: "Done",
                    onPress: () => {
                        clearCart(); // Clear the cart after successful checkout
                        navigation.navigate('Home' as never);
                    }
                }
            ]
        );
    };

    const handleQuantityChange = (item: CartItem, change: number) => {
        const newQuantity = item.quantity + change;
        updateQuantity(item.id, newQuantity);
    };

    const handleRemoveItem = (itemId: string, name: string) => {
        Alert.alert(
            "Remove Item",
            `Are you sure you want to remove ${name} from your cart?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => removeFromCart(itemId),
                    style: "destructive"
                }
            ]
        );
    };


    // --- Renderer ---

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItemContainer}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPricePerUnit}>
                    {`₹${item.price.toFixed(2)} per unit`}
                </Text>
            </View>

            <View style={styles.quantityControls}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item, -1)}
                    disabled={item.quantity <= 1} // Disable minus button if quantity is 1
                >
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.itemQuantity}>{item.quantity}</Text>

                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item, 1)}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.itemPriceContainer}>
                <Text style={styles.itemTotalPrice}>
                    {`₹${(item.price * item.quantity).toFixed(2)}`}
                </Text>
                <TouchableOpacity
                    onPress={() => handleRemoveItem(item.id, item.name)}
                    style={styles.removeButton}
                >
                    <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // --- Main Render ---

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Your Cart ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})</Text>
                <TouchableOpacity onPress={clearCart}>
                    <Text style={styles.clearCartText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyCart}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Your cart is currently empty.</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Home' as never)}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Checkout Footer */}
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>{`₹${subtotal.toFixed(2)}`}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Tax ({TAX_RATE * 100}%)</Text>
                        <Text style={styles.priceValue}>{`₹${tax.toFixed(2)}`}</Text>                    </View>
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={handleCheckout}
                    >
                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    clearCartText: {
        color: '#D32F2F',
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    cartItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    itemDetails: {
        flex: 3,
        paddingRight: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemPricePerUnit: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2,
        justifyContent: 'center',
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemQuantity: {
        fontSize: 16,
        marginHorizontal: 15,
        fontWeight: '500',
    },
    itemPriceContainer: {
        flex: 2,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemTotalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginRight: 10,
    },
    removeButton: {
        padding: 5,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 16,
        color: '#666',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    checkoutButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 20,
        marginBottom: 30,
    },
    shopButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 10,
    },
    shopButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});