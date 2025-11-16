// src/screens/SignInScreen.tsx
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", `Logged in as ${userCredential.user.email}`);
      navigation.navigate("Home");
      console.log('User signed in:', userCredential.user.uid);
      return userCredential.user;
    } catch (error: any) {
      let message = "Sign in failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Try again later.";
      }
      Alert.alert("Sign In Error", message);
      console.error("Sign-in error:", error.code, error.message);
    }
  };
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        Sign In
      </Text>

      <TextInput
        placeholder="Email"
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 6,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 6,
          marginTop: 10,
        }}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={{
          marginTop: 15,
          backgroundColor: "#3fcc4fff",
          padding: 15,
          borderRadius: 6,
        }}
        onPress={() => signInWithEmail(email, password)} 
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Continue</Text>
      </TouchableOpacity>

      {/* Navigate to SignUp */}
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={{ marginTop: 15 }}
      >
        <Text style={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Text style={{ fontWeight: "600" }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
