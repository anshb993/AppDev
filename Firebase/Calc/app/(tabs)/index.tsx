// app/(tabs)/index.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

export default function CalculatorApp() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const calculate = async () => {
    try {
      const res = eval(input); // simple parser; safe for controlled input
      setResult(String(res));
      await addDoc(collection(db, "calculations"), {
        expression: input,
        result: String(res),
      });
      fetchHistory();
    } catch {
      setResult("Error");
    }
  };

  const fetchHistory = async () => {
    const snapshot = await getDocs(collection(db, "calculations"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HistoryItem[];
    setHistory(list);
  };

  const clearHistory = async () => {
    for (const item of history) {
      await deleteDoc(doc(db, "calculations", item.id));
    }
    setHistory([]);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter expression (e.g., 2+3*4)"
        value={input}
        onChangeText={setInput}
        keyboardType="default"
      />
      <Button title="Calculate" onPress={calculate} />
      <Text style={styles.result}>Result: {result}</Text>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>History</Text>
        <Button title="Clear" onPress={clearHistory} />
      </View>

      <FlatList
        data={history}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.expression} = {item.result}
          </Text>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", marginTop: 50 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  result: { fontSize: 18, marginVertical: 10, color: "#000" },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  historyTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  item: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
    color: "#000",
  },
});
