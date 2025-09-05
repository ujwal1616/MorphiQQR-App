// MorphiQ QR - Per-Contact Chat Screen
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encryptMessage, decryptMessage } from "./encryption";

const MAX_QR_CHUNK = 1000;

function splitMessage(message) {
  let chunks = [];
  for (let i = 0; i < message.length; i += MAX_QR_CHUNK) {
    chunks.push(message.substring(i, i + MAX_QR_CHUNK));
  }
  return chunks;
}

function reassembleMessage(chunks) {
  return chunks.join("");
}

export default function ChatScreen({ route }) {
  const { contact } = route.params;
  const [message, setMessage] = useState("");
  const [qrChunks, setQrChunks] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [receivedChunks, setReceivedChunks] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const historyKey = `chat_${contact.id}`;

  useEffect(() => {
    AsyncStorage.getItem(historyKey).then(data => {
      if (data) setChatHistory(JSON.parse(data));
    });
  }, []);

  const saveHistory = async (newHistory) => {
    setChatHistory(newHistory);
    await AsyncStorage.setItem(historyKey, JSON.stringify(newHistory));
  };

  const handleGenerateQR = () => {
    if (!message) return;
    const encrypted = encryptMessage(message, contact.key);
    const chunks = splitMessage(encrypted);
    setQrChunks(chunks);
    setShowQR(true);
  };

  const handleScanQR = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
    setScanning(true);
    setReceivedChunks([]);
  };

  const handleBarCodeScanned = ({ data }) => {
    setReceivedChunks(prev => [...prev, data]);
  };

  const handleFinishReceiving = () => {
    const encrypted = reassembleMessage(receivedChunks);
    const decrypted = decryptMessage(encrypted, contact.key);
    if (decrypted) {
      const newHistory = [
        { type: "received", message: decrypted, time: new Date().toISOString() },
        ...chatHistory
      ];
      saveHistory(newHistory);
      setScanning(false);
      setReceivedChunks([]);
      alert("Message received and saved to history!");
    } else {
      alert("Failed to decrypt. Check secret key!");
    }
  };

  const handleSaveSent = () => {
    const newHistory = [
      { type: "sent", message, time: new Date().toISOString() },
      ...chatHistory
    ];
    saveHistory(newHistory);
    setQrChunks([]);
    setShowQR(false);
    setMessage("");
    alert("Message saved to history!");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <FlatList
          data={chatHistory}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={{ fontWeight: "bold", color: item.type === "sent" ? "#0077b6" : "#009e60" }}>
                {item.type === "sent" ? "Sent" : "Received"}
              </Text>
              <Text style={{ marginVertical: 6 }}>{item.message}</Text>
              <Text style={{ fontSize: 12, color: "#888" }}>{new Date(item.time).toLocaleString()}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginBottom: 10 }}>No messages yet.</Text>}
        />
        <TextInput
          style={styles.input}
          placeholder={`Type a message to ${contact.name}`}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button title="Generate Encrypted QR Codes" onPress={handleGenerateQR} />
        <View style={styles.spacer} />
        <Button title="Scan Encrypted QR Codes" onPress={handleScanQR} />

        {showQR && qrChunks.length > 0 && (
          <View style={styles.qrContainer}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Show all QR codes:</Text>
            {qrChunks.map((chunk, idx) => (
              <View key={idx} style={{ marginBottom: 12, alignItems: "center" }}>
                <QRCode value={chunk} size={200} />
                <Text>Part {idx + 1} of {qrChunks.length}</Text>
              </View>
            ))}
            <Button title="Save to History" onPress={handleSaveSent} />
            <Button title="Cancel" onPress={() => { setShowQR(false); setQrChunks([]); }} color="red" />
          </View>
        )}

        {scanning && hasPermission !== null && (
          <View style={styles.qrScanner}>
            <Text style={{ marginBottom: 8 }}>Scan each QR code part in order</Text>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={{ height: 250, width: 250 }}
            />
            <Text>Scanned parts: {receivedChunks.length}</Text>
            <Button
              title="Finish & Save Message"
              onPress={handleFinishReceiving}
              disabled={receivedChunks.length === 0}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setScanning(false);
                setReceivedChunks([]);
              }}
              color="red"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 10, minHeight: 60, marginBottom: 12 },
  spacer: { height: 10 },
  qrContainer: { alignItems: "center", marginTop: 24, marginBottom: 24 },
  qrScanner: { alignItems: "center", marginTop: 24, marginBottom: 24 },
  historyItem: { borderBottomWidth: 1, borderColor: "#eee", paddingVertical: 12 },
});