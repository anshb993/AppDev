import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const EmailAuth: React.FC = () => {
    // Explicitly define the string type for state variables
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const auth = getAuth(); 

    // Define function return types as Promise<void>
    const handleSignUp = async (): Promise<void> => {
        if (loading || !email || !password) return;

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created and logged in!");
        } catch (error: any) { // Use 'any' or check 'instanceof Error' for catch block
            console.error("Sign Up Failed:", error.code, error.message);
            Alert.alert("Sign Up Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (): Promise<void> => {
        if (loading || !email || !password) return;
        
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Logged in successfully!");
        } catch (error: any) {
            console.error("Sign In Failed:", error.code, error.message);
            Alert.alert("Sign In Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* ... JSX remains similar, benefiting from typed TextInput onChangeText ... */}
            <Text style={styles.title}>Email & Password</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={styles.buttonContainer}>
                <Button 
                    title={loading ? "..." : "Sign Up"} 
                    onPress={handleSignUp} 
                    disabled={loading} 
                />
                <Button 
                    title={loading ? "..." : "Sign In"} 
                    onPress={handleSignIn} 
                    disabled={loading} 
                    color="#3498db" 
                />
            </View>
            {loading && <ActivityIndicator />}
        </View>
    );
};

export default EmailAuth;

const styles = StyleSheet.create({
    container: {
        width: '300%', // Use 100% width within its parent (AppAuth)
        padding: 20, // ➡️ Add internal padding
        borderRadius: 10, // ➡️ Rounded corners
        backgroundColor: '#ffffff', // ➡️ White background
        borderWidth: 1, // ➡️ Light border
        borderColor: '#ddd', 
        shadowColor: '#000', // ➡️ Subtle shadow for depth (optional)
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Android shadow
        marginBottom: 10, // Ensure space below the card
        marginTop: 10, // Ensure space above the card
        alignItems: "center", // Center content inside the card
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        // Add your title styling
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 0,
    },
    divider: {
        marginVertical: 20,
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