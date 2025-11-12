// @ts-ignore
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut, User } from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Dimensions, StyleSheet, Text, View } from "react-native";
import AnonAuth from './anonAuth';
import EmailAuth from './emailAuth';
import PhoneAuth from './PhoneAuth';

GoogleSignin.configure({
    webClientId: '201245250315-ef0o1b88u900q776gcbv257cqdco8339.apps.googleusercontent.com'
});

const AppAuth: React.FC = () => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const [signingIn, setSigningIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const auth = getAuth();

    function handleAuthStateChanged(firebaseUser: User | null): void {
        setUser(firebaseUser);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
        return subscriber;
    }, []);

    const signInWithGoogle = async (): Promise<void> => {
        if (signingIn) return;

        setSigningIn(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const signInResult = await GoogleSignin.signIn();
            // @ts-ignore
            const { idToken } = signInResult;

            if (!idToken) {
                throw new Error('Google Sign-In failed: No ID token returned.');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, googleCredential);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Google Sign-In failed:", error.message);
            }
        } finally {
            setSigningIn(false);
        }
    };

    const handleSignOut = async (): Promise<void> => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
        const isGoogleUser = currentUser?.providerData.some(
            (provider) => provider.providerId === 'google.com'
        );

        if (isGoogleUser) {
            console.log("Signing out Google user...");
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        }

        await signOut(auth);

        console.log("User successfully signed out from Firebase.");

    } catch (error) {
        console.error("Sign Out Process Error:", error);
    }
};

    if (initializing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Checking authentication status...</Text>
            </View>
        );
    }

    if (user) {
        return (
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Welcome, {user.email || user.displayName || 'Anon User'}!
                </Text>
                <Text style={{ marginBottom: 20 }}>
                    UID: {user.uid}
                </Text>
                <Button
                    title="Sign Out"
                    onPress={handleSignOut}
                    color="red"
                />
            </View>
            
        );
    }

    return (
    <View style={styles.container}>

        <Text style={styles.header}>AuthApp</Text>

        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
            disabled={signingIn}
            style={{ marginBottom: 10 }} 
        />
        {signingIn && <ActivityIndicator />}

        <Text style={styles.divider}>— OR —</Text>

        <EmailAuth /> 
        
        <Text style={styles.divider}>— OR —</Text>
        
        <PhoneAuth />

        <Text style={styles.divider}>— OR —</Text>

        <AnonAuth 
            signingIn={signingIn} 
            setSigningIn={setSigningIn} 
        />
        
        

    </View>
);
};

export default AppAuth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        justifyContent: "center",
        alignItems: "center",
        padding: 150,
        paddingTop: 150,
        backgroundColor: '#fff1fcff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    divider: {
        marginVertical: 0,
        fontSize: 16,
        color: '#888',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
});