import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Kamu belum login</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login Sekarang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name[0]}</Text>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role || "Adopter"}</Text>

        <View style={styles.info}>
          <Ionicons name="mail" size={20} />
          <Text>{user.email}</Text>
        </View>

        <View style={styles.info}>
          <Ionicons name="call" size={20} />
          <Text>{user.phone || "-"}</Text>
        </View>

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Ionicons name="log-out" size={20} color="red" />
          <Text style={{ color: "red" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f1e8", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#ED8B3C", alignSelf: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 36, textAlign: "center" },
  name: { textAlign: "center", fontSize: 22, fontWeight: "bold", marginTop: 10 },
  role: { textAlign: "center", color: "#666" },
  info: { flexDirection: "row", gap: 10, marginTop: 12 },
  logout: { flexDirection: "row", gap: 8, marginTop: 24, justifyContent: "center" },
  button: { backgroundColor: "#ED8B3C", padding: 14, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
