// MorphiQ QR - Main App Navigation & Contacts
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";

const Stack = createStackNavigator();

function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactKey, setNewContactKey] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("contacts").then(data => {
      if (data) setContacts(JSON.parse(data));
    });
  }, []);

  const saveContacts = async (updated) => {
    setContacts(updated);
    await AsyncStorage.setItem("contacts", JSON.stringify(updated));
  };

  const addContact = () => {
    if (
      newContactName.trim().length > 0 &&
      newContactKey.trim().length > 0 &&
      !contacts.find(c => c.name === newContactName.trim())
    ) {
      const newContact = {
        id: Date.now().toString(),
        name: newContactName.trim(),
        key: newContactKey.trim()
      };
      const updated = [newContact, ...contacts];
      saveContacts(updated);
      setNewContactName("");
      setNewContactKey("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>MorphiQ QR Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => navigation.navigate("Chat", { contact: item })}
          >
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No contacts yet. Add one below!</Text>}
      />
      <TextInput
        placeholder="Contact name"
        value={newContactName}
        onChangeText={setNewContactName}
        style={styles.input}
      />
      <TextInput
        placeholder="Shared secret key"
        value={newContactKey}
        onChangeText={setNewContactKey}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Add Contact" onPress={addContact} />
      <Text style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
        Use the same 'secret key' on both devices for this contact.
      </Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({ title: route.params.contact.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 18, textAlign: "center", color: "#0077b6" },
  contactItem: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  contactName: { fontSize: 20, fontWeight: "500", color: "#023e8a" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 10, marginBottom: 12 },
});