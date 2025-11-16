// src/animatedThiing/quote.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface AnimatedQuoteProps {
  quotes: string[];
  intervalMs?: number; // Time in milliseconds before changing quote (default 5000ms = 5s)
}

const AnimatedQuote: React.FC<AnimatedQuoteProps> = ({ quotes, intervalMs = 5000 }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for the first quote

  useEffect(() => {
    const advanceQuote = () => {
      // Fade out current quote
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out over 0.5 seconds
        useNativeDriver: true,
      }).start(() => {
        // After fade out, change quote index
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        
        // Fade in new quote
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500, // Fade in over 0.5 seconds
          useNativeDriver: true,
        }).start();
      });
    };

    // Set up interval to change quotes
    const intervalId = setInterval(advanceQuote, intervalMs);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [quotes, intervalMs, fadeAnim]); // Depend on quotes, intervalMs, and fadeAnim

  const currentQuote = quotes[currentQuoteIndex];
  
  // Splitting the quote to highlight a specific word in green, if desired.
  // This assumes the format "Your essential pharmacy, delivered fast."
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\b(?:essential|delivered)\b)/g); // Split by "essential" or "delivered"
    return parts.map((part, index) => {
      if (part === 'essential' || part === 'delivered') {
        return <Text key={index} style={styles.highlightText}>{part}</Text>;
      }
      return part;
    });
  };

  return (
    <View style={styles.quoteContainer}>
      <Animated.Text style={[styles.quoteText, { opacity: fadeAnim }]}>
        {renderHighlightedText(currentQuote)}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    minHeight: 100, // Ensure enough height to prevent layout shifts during transition
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    lineHeight: 32,
    textAlign: 'left', // Ensure text aligns consistently
  },
  highlightText: {
    color: '#4CAF50', // Green color for highlighted words
  },
});

export default AnimatedQuote;