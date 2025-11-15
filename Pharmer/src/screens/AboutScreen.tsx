// src/screens/AboutScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Phar-mer</Text>
      
      <Text style={styles.text}>
        Phar-mer is an app designed to help users manage their pharmacy-related tasks efficiently. 
        You can sign up, sign in, and manage your data seamlessly. 
      </Text>

      <Text style={styles.text}>
        Features:
      </Text>
      <Text style={styles.text}>- Sign up and sign in with email/password or Google</Text>
      <Text style={styles.text}>- View and manage your account</Text>
      <Text style={styles.text}>- Quick and intuitive interface</Text>

      <Text style={styles.text}>
        This app is a demonstration project for learning React Native, Firebase, and Expo development builds.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
});
