import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import AnonAuth from './anonAuth';
import EmailAuth from './emailAuth';
import GoogleAuth from './googleAuth';
import PhoneAuth from './PhoneAuth';

const AppAuth: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [signingIn, setSigningIn] = useState<boolean>(false);
    const [initializing, setInitializing] = useState<boolean>(true);

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), (user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });

        return subscriber;
    }, [initializing]);


    if (initializing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Initializing Auth...</Text>
            </View>
        );
    }

    if (user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.welcomeText}>
                    Welcome, {user.isAnonymous ? 'Guest' : user.email || user.uid}!
                </Text>
                <Text style={styles.subtitleText}>
                    You are signed in with **{user.isAnonymous ? 'Anonymous' : user.providerData[0]?.providerId.split('.')[0] || 'Email/Password'}**.
                </Text>
                <View style={styles.signOutButton}>
                    <Button
                        title="Sign Out"
                        onPress={() => getAuth().signOut()}
                        color="#dc3545"
                    />
                </View>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>Choose a Sign-In Method</Text>

            <View >
                {}
                <GoogleAuth />
            </View>

            <View >
                <EmailAuth />
            </View>

            <View >
                <PhoneAuth />
            </View>

            <View style={styles.authBlock}>
                <Text style={styles.blockTitle}>Anonymous / Guest</Text>
                {}
                <AnonAuth signingIn={signingIn} setSigningIn={setSigningIn} />
            </View>
        </ScrollView>
    );
};

export default AppAuth;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 0,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#343a40',
        marginTop: 40,
    },
    authBlock: {
        width: '100%',
        maxWidth: 350,
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    blockTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#495057',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        width: '100%',
        textAlign: 'center',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#28a745',
    },
    subtitleText: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 30,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#0000ff',
    },
    signOutButton: {
        width: 150,
        marginTop: 20,
    }
});