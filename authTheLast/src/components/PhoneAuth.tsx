import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

// NOTE: We no longer need to define a ConfirmationResult type or import FirebasePhoneAuthCredential.

const PhoneAuth: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [code, setCode] = useState<string>('');
    
    // 💡 Use 'any' here to hold the confirmation result object, bypassing the type import error.
    const [confirmResult, setConfirmResult] = useState<any>(null); 
    const [loading, setLoading] = useState<boolean>(false);

    const auth = getAuth();

    // --- 1. Send Verification Code ---
    const handleSendCode = async (): Promise<void> => {
        if (!phoneNumber) {
            Alert.alert("Error", "Please enter a valid phone number.");
            return;
        }

        setLoading(true);
        try {
            // signInWithPhoneNumber returns the object containing the 'confirm' method.
            // 💡 The returned object is implicitly typed as 'any'.
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber); 
            
            setConfirmResult(confirmation);
            Alert.alert("Code Sent", `Verification code sent to ${phoneNumber}.`);
        } catch (error: any) {
            console.error("Phone Auth Error:", error);
            Alert.alert("Verification Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Confirm the Code and Sign In ---
    const handleConfirmCode = async (): Promise<void> => {
        if (!code || !confirmResult) {
            Alert.alert("Error", "Please enter the 6-digit verification code.");
            return;
        }

        setLoading(true);
        try {
            // Because confirmResult is 'any', we can directly call its 'confirm' method.
            await confirmResult.confirm(code);
            
            Alert.alert("Success", "Phone number verified and logged in!");

            // Reset UI state
            setConfirmResult(null);
            setCode('');
            setPhoneNumber('');
        } catch (error: any) {
            console.error("Confirmation Error:", error);
            Alert.alert("Verification Failed", "The verification code was invalid or expired.");
        } finally {
            setLoading(false);
        }
    };

    // --- UI Rendering (remains the same) ---

    // If the code has been sent, show the code input screen
    if (confirmResult) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Enter Verification Code</Text>
                <TextInput
                    style={styles.input}
                    placeholder="6-Digit Code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                />
                <Button 
                    title={loading ? "Verifying..." : "Verify and Sign In"} 
                    onPress={handleConfirmCode} 
                    disabled={loading} 
                    color="#28a745"
                />
            </View>
        );
    }

    // Default screen: show the phone number input
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in with Phone</Text>
            <TextInput
                style={styles.input}
                placeholder="E.g., +1 555 123 4567 (with country code)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoCapitalize="none"
            />
            <Button 
                title={loading ? "Sending Code..." : "Send Verification Code"} 
                onPress={handleSendCode} 
                disabled={loading} 
                color="#007bff"
            />
        </View>
    );
};

export default PhoneAuth;

// ... styles ...
const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 28,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
        marginTop: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    }
});