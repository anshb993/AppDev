// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
console.log("Firestore connected:", db);

interface Task {
  id: string;
  title: string;
}

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "tasks"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
    setTasks(list);
  };

  const addTask = async () => {
    if (task.trim().length === 0) return;
    await addDoc(collection(db, "tasks"), { title: task });
    setTask("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />
      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Button title="Delete" onPress={() => deleteTask(item.id)} />
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: "#fff", // Light background
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    color: "#000", // Text visible
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
});
