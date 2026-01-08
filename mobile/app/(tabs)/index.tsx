import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, {user?.name || "User"}! 👋</Text>
      <Text style={styles.subtitle}>Selamat datang di Tubes Mobile</Text>
      
      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f1e8' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  btn: { backgroundColor: '#FF4444', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: 'bold' }
});