# 📡 MorphiQqr – Offline Messaging with QR Technology

MorphiQqr is an experimental **offline-first messaging app** that allows users to send and receive messages by leveraging **QR codes** instead of internet or mobile data.  

The goal is to enable communication in low-connectivity or no-network environments (remote areas, disaster zones, flights, etc.) using **innovative device-to-device data transfer methods**.

---

## 🚀 Current Features
- 📱 **Send & receive text messages** via QR code scanning.
- 📦 **Local-first storage** – messages are saved on-device until exchanged.
- 🔒 **Privacy by design** – no central server required.

---

## 🔮 Upcoming Features (Planned Roadmap)
- ✋ **Touch-to-send** → Tap two devices to exchange messages instantly.
- 📡 **Bluetooth message transfer** → Faster exchange without scanning QR.
- 🌐 **Mesh-up network** → Devices form an ad-hoc peer-to-peer network to relay messages without internet.
- 📂 **Media support** → Extend beyond text to send small images/files offline.

---

## 🛠️ How I’m Planning to Build This
- **Touch-to-send** → Use NFC / proximity-based device discovery for initiating quick transfers.
- **Bluetooth sending** → Leverage native Bluetooth APIs for direct peer-to-peer message sync.
- **Mesh-up network** → Experiment with **Wi-Fi Direct + Bluetooth mesh libraries** to form decentralized message relays.
- **Scalability** → Prototype hybrid models where QR is fallback but devices auto-upgrade to faster channels if available.

---

## 💡 Vision
The ultimate vision is to **create a resilient, offline communication system** that can work:
- In disaster relief zones 🌍
- In rural/remote areas 🏞️
- During network shutdowns 🚫📶
- Even in flights ✈️

---

## 🧑‍💻 Tech Stack
- **React native** – mobile cross-platform development
- **QR code libraries** – for encoding/decoding messages
- **Local storage** – for message persistence
- Planned: **Bluetooth, NFC, Wi-Fi Direct**

---

## 📌 Project Status
This app is in **MVP stage**. Core QR message exchange works, and upcoming updates will bring more advanced offline transfer modes.(I'm facing some debugging issues but will get to the root of it soon.)
---

## ⚡ About the Developer
Built by **Ujwal Sharma**, passionate about **AI, offline-first apps, and next-gen communication systems**.  
Currently working on multiple projects including [Metanoia](#) and AI-powered experiments.

---
 Expo users and ask questions.
