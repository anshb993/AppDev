import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function JokeScreen() {
  const [joke, setJoke] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchJoke = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      setJoke("Failed to load joke. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Text style={styles.joke}>{joke}</Text>
      )}
      <Pressable style={styles.button} onPress={fetchJoke}>
        <Text style={styles.buttonText}>Tell me another</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  joke: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
