// src/screens/HomeScreen.tsx
import { signOut } from "firebase/auth";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../../src/firebaseConfig";

const HomeScreen = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out");
    } catch (error: any) {
      console.log("Logout error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You’re logged in as: anonymous</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff5e8ff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
