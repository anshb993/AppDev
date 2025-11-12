// AnonAuth.tsx

import { getAuth } from '@react-native-firebase/auth';
import React from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, View } from 'react-native';

// Define the component's props to receive the loading state and setter from the parent
interface AnonAuthProps {
    signingIn: boolean;
    setSigningIn: (loading: boolean) => void;
}

const AnonAuth: React.FC<AnonAuthProps> = ({ signingIn, setSigningIn }) => {
    
    const signInAnonymously = async (): Promise<void> => {
        if (signingIn) return;

        setSigningIn(true);
        try {
            await getAuth().signInAnonymously();
            console.log('User signed in anonymously!');
            // The onAuthStateChanged listener in AppAuth.tsx handles the UI switch
        } catch (error) {
            console.error("Anonymous Sign-In Failed:", error);
            Alert.alert("Error", "Could not start anonymous session.");
        } finally {
            setSigningIn(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title={signingIn ? "Entering..." : "Continue as Guest"}
                onPress={signInAnonymously}
                disabled={signingIn}
                color="#007bff" 
            />
            {signingIn && <ActivityIndicator style={{ marginTop: 5 }} />}
        </View>
    );
};

export default AnonAuth;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
});