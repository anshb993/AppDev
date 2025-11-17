import { Ionicons } from '@expo/vector-icons';
import { getAuth, User } from '@react-native-firebase/auth';
import { StackActions, useNavigation } from '@react-navigation/native'; // Added StackActions for navigation control
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isPremium, setIsPremium] = useState(false); 

    // Listen to auth state changes to get the current user
    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            // Simulate premium status fetch
            if (user && user.uid === 'some_premium_user_id') {
                 setIsPremium(true);
            } else {
                 setIsPremium(false);
            }
        });
        return subscriber;
    }, []);

    const handleSignOut = async () => {
        try {
            // 1. Terminate the Firebase session for security.
            await auth.signOut();
            
            // 2. EXPLICIT NAVIGATION: This ensures the user is immediately taken to the 
            // SignUp screen, clearing the current navigation stack (Home/Profile tabs).
            navigation.dispatch(StackActions.replace('SignUp')); 

        } catch (error) {
            console.error('Sign Out Failed', error);
            Alert.alert("Sign Out Error", "Could not sign out. Please try again.");
        }
    };

    const handleSubscribe = () => {
        if (currentUser?.isAnonymous) {
             Alert.alert(
                "Sign In Required",
                "Please sign in or create an account to subscribe to Pharma Pro.",
                [{ text: "OK" }]
            );
            return;
        }

        if (isPremium) {
            Alert.alert("Pharma Pro Active", "You already have Pharma Pro! Enjoy your exclusive benefits.");
        } else {
            Alert.alert(
                "Unlock Pharma Pro!",
                "Get instant access to 10% OFF all orders, and Express Delivery for just ₹499/month.",
                [
                    { text: "Later", style: "cancel" },
                    { 
                        text: "Subscribe Now", 
                        onPress: () => {
                            // Simulate subscription success
                            setIsPremium(true); 
                            Alert.alert("Success! 🌟", "Welcome to Pharma Pro! Your benefits are now active.");
                        } 
                    },
                ]
            );
        }
    };

    const isGuest = currentUser?.isAnonymous;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Info Card */}
                <View style={styles.sectionCard}>
                    <Ionicons name="person-circle-outline" size={60} color="#4CAF50" style={styles.cardIcon} />
                    <Text style={styles.cardTitle}>Account Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email/User ID:</Text>
                        <Text style={styles.detailValue}>{currentUser?.email || (isGuest ? 'Guest User' : 'Not Available')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <Text style={styles.detailValue}>{isGuest ? 'Anonymous (Guest)' : 'Signed In'}</Text>
                    </View>
                </View>
                
                {/* PREMIUM FEATURES CARD */}
                <View style={[styles.premiumFeaturesCard, isPremium && styles.premiumFeaturesCardActive]}>
                    <View style={styles.premiumHeader}>
                        <Ionicons name={isPremium ? "star" : "ribbon-outline"} size={30} color="#fff" />
                        <Text style={styles.premiumMainTitle}>
                            {isPremium ? "Pharma Pro ACTIVE!" : "Unlock Pharma Pro Premium"}
                        </Text>
                    </View>
                    <Text style={styles.premiumDescription}>
                        {isPremium 
                            ? "Congratulations! You're enjoying the best of Pharma. Keep healthy!"
                            : "Elevate your experience with exclusive features and save big!"
                        }
                    </Text>

                    <View style={styles.featureList}>
                        <View style={styles.featureItem}>
                            <Ionicons name="pricetag-outline" size={20} color={isPremium ? '#fff' : '#ddd'} />
                            <Text style={[styles.featureText, isPremium && {color: '#fff'}]}>
                                {isPremium ? "10% Exclusive Discounts" : "Special Discounts (10% OFF)"}
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="speedometer-outline" size={20} color={isPremium ? '#fff' : '#ddd'} />
                            <Text style={[styles.featureText, isPremium && {color: '#fff'}]}>
                                {isPremium ? "Express Delivery Option" : "Faster Delivery Options"}
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="leaf-outline" size={20} color={isPremium ? '#fff' : '#ddd'} />
                            <Text style={[styles.featureText, isPremium && {color: '#fff'}]}>
                                {isPremium ? "Priority Customer Support" : "Priority Support"}
                            </Text>
                        </View>
                    </View>

                    {/* Subscribe Button (only if not premium) */}
                    {!isPremium && (
                        <TouchableOpacity 
                            style={styles.subscribeButton} 
                            onPress={handleSubscribe}
                            disabled={isGuest}
                        >
                            <Text style={styles.subscribeButtonText}>
                                {isGuest ? "Sign In to Subscribe" : "Subscribe Now - ₹499/month"}
                            </Text>
                            <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity 
                    style={styles.signOutButton} 
                    onPress={handleSignOut}
                >
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                    <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0', backgroundColor: '#fff',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    sectionCard: {
        backgroundColor: '#f9f9f9', padding: 20, borderRadius: 12, marginBottom: 20,
        alignItems: 'center', borderWidth: 1, borderColor: '#eee',
    },
    cardIcon: { marginBottom: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8, paddingHorizontal: 10 },
    detailLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#333', flexShrink: 1, textAlign: 'right' },
    premiumFeaturesCard: {
        backgroundColor: '#6A5ACD', padding: 20, borderRadius: 15, marginBottom: 20,
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 10, elevation: 8,
    },
    premiumFeaturesCardActive: {
        backgroundColor: '#4CAF50', borderColor: '#3fcc4fff', borderWidth: 1,
    },
    premiumHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    premiumMainTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginLeft: 10 },
    premiumDescription: { fontSize: 14, color: '#eee', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
    featureList: { width: '100%', marginBottom: 25 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 },
    featureText: { fontSize: 16, color: '#ddd', marginLeft: 15, fontWeight: '500' },
    subscribeButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD700',
        paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 10,
    },
    subscribeButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    signOutButton: {
        backgroundColor: '#E74C3C', padding: 15, borderRadius: 10, flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center', marginTop: 10,
    },
    signOutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});