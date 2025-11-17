// D:\temp\Pharmer\src\screens\SignUpScreen.tsx
import { getApps } from '@react-native-firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { GoogleAuth } from "./googlefuckery"; // import the function

console.log('Firebase apps:', getApps());
type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleGoogleSignIn = async () => {
    // await GoogleSignin.signOut(); uncomment when demostrating
    await GoogleAuth(); // your existing function
    navigation.navigate("Home");
  };

  const handleEmailSignUp = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Home"); 
    } catch (error: any) {
      console.error("Sign Up Failed:", error.code, error.message);

        // Friendly error handling
        let message = "Sign Up Failed. Please try again.";
        if (error.code === "auth/email-already-in-use") {
            message = "This email is already registered. Please sign in instead.";
        } else if (error.code === "auth/invalid-email") {
            message = "The email address is invalid.";
        } else if (error.code === "auth/weak-password") {
            message = "Password is too weak. Use at least 6 characters.";
        }

        Alert.alert("Sign Up Error", message);
    }
  };
  const handleGuestLogin = async () => { // <-- New Handler for Guest Login
    try {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      // The user is signed in, and their state (isAnonymous: true) can be used
      // to restrict cart functionality later in the app.
      navigation.navigate("Home");
    } catch (error: any) {
      console.error("Guest Sign In Failed:", error.code, error.message);
      // NOTE: Using custom modal/message box is recommended over Alert
      Alert.alert("Error", "Could not sign in as a guest. Please try again.");
    }
  };
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      {/* Top Left Title */}
      <View style={{ position: "absolute", top: 40, left: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Phar-mer</Text>
      </View>

      {/* About Button */}
      <TouchableOpacity
        style={{ position: "absolute", top: 40, right: 20 }}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={{ fontSize: 16 }}>About</Text>
      </TouchableOpacity>

      {/* Main Box */}
      <View
        style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
        }}
      >

        {/* GOOGLE BUTTON */}
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 6,
            borderWidth: 1,
            marginBottom: 15,
          }}
          onPress={handleGoogleSignIn} // just call the function
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* EMAIL INPUT */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            marginTop: 0,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 6,
          }}
        />

        {/* PASSWORD INPUT */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            marginTop: 10,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 6,
          }}
        />

        {/* CONTINUE (EMAIL SIGNUP) */}
        <TouchableOpacity
          style={{
            backgroundColor: "#3fcc4fff",
            marginVertical: 10,
            padding: 15,
            borderRadius: 6,
          }}
          onPress={handleEmailSignUp}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            Continue
          </Text>
        </TouchableOpacity>

                {/* CONTINUE AS GUEST BUTTON */}
        <TouchableOpacity
          style={{
            backgroundColor: "#ddd", // Neutral color for guest login
            marginTop: 5,
            padding: 15,
            borderRadius: 6,
          }}
          onPress={handleGuestLogin} // <-- New handler
        >
          <Text style={{ color: "#333", textAlign: "center", fontWeight: "bold" }}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>

      {/* SIGN IN NAVIGATION */}
      <TouchableOpacity
        onPress={() => navigation.navigate("SignIn")}
        style={{ marginTop: 15 }}
      >
        <Text style={{ textAlign: "center" }}>
          Already have an account? <Text style={{ fontWeight: "bold" }}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
