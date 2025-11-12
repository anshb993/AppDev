import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const EmailAuth: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const auth = getAuth();

    const handleSignUp = async (): Promise<void> => {
        if (loading || !email || !password) return;

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created and logged in!");
        } catch (error: any) {
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
            {}
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
                    color="#3987baff"
                />
            </View>
            {loading && <ActivityIndicator />}
        </View>
    );
};

export default EmailAuth;

const styles = StyleSheet.create({
    container: {
        width: '208%',
        padding: 40,
        borderRadius: 10,
        backgroundColor: '#ffffffff',
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
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '300%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#ffffffff',
        paddingHorizontal: 100,},
    buttonContainer: {
        justifyContent: 'center',
    },
    divider: {
        fontSize: 16,
        color: '#888',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
});