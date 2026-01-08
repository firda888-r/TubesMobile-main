import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function SignUp() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      await axios.post("http://YOUR_IP:5000/api/auth/register", formData);
      Alert.alert("Sukses", "Registrasi berhasil, silakan login");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Gagal daftar");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Buat Akun Baru 🚀</Text>

        <TextInput style={styles.input} placeholder="Nama Lengkap"
          onChangeText={(v) => setFormData({ ...formData, name: v })} />

        <TextInput style={styles.input} placeholder="Email"
          keyboardType="email-address"
          onChangeText={(v) => setFormData({ ...formData, email: v })} />

        <TextInput style={styles.input} placeholder="No. HP"
          onChangeText={(v) => setFormData({ ...formData, phone: v })} />

        <TextInput style={styles.input} placeholder="Password"
          secureTextEntry
          onChangeText={(v) => setFormData({ ...formData, password: v })} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Sudah punya akun?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f7f1e8" },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 24 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "#f1f1f1", padding: 14, borderRadius: 12, marginBottom: 12 },
  button: { backgroundColor: "#ED8B3C", padding: 14, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  footer: { textAlign: "center", marginTop: 16 },
  link: { color: "#ED8B3C", fontWeight: "bold" }
});
