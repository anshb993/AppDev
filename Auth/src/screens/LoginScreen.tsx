// src/screens/LoginScreen.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AuthPage</Text>

      {/* Google Login */}
      <TouchableOpacity style={[styles.button, styles.googleButton]}>
        <Text style={[styles.buttonText, styles.googleText]}>
          CONTINUE WITH GOOGLE
        </Text>
      </TouchableOpacity>

      {/* Phone Login */}
      <TouchableOpacity style={[styles.button, styles.phoneButton]}>
        <Text style={styles.buttonText}>
          CONTINUE WITH PHONE NUMBER
        </Text>
      </TouchableOpacity>

      {/* Anonymous Login */}
      <TouchableOpacity style={[styles.button, styles.anonButton]}>
        <Text style={styles.buttonText}>
          CONTINUE ANONYMOUSLY
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdffe6ff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2,
  },
  googleButton: {
    backgroundColor: '#b0e1f0ff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  phoneButton: {
    backgroundColor: '#58b8e1ff',
  },
  anonButton: {
    backgroundColor: '#2c98f6ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  googleText: {
    color: '#000',
  },
});
