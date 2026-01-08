import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation(); // Pengganti useNavigate
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // Validasi input sederhana
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    try {
      // --- PERUBAHAN IP DI SINI ---
      const res = await axios.post("http://192.168.64.218:5000/api/auth/login", { 
        email, 
        password 
      });
      
      // Simpan data login ke context (pastikan AuthContext sudah support mobile/AsyncStorage)
      login(res.data);
      
      // Pindah ke halaman Home (gunakan replace agar tidak bisa back ke login)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.error || "Login gagal, periksa koneksi atau kredensial";
      setError(errorMessage);
      Alert.alert("Login Gagal", errorMessage); // Opsional: Tampilkan pop-up alert
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        
        {/* Judul */}
        <Text style={styles.title}>Welcome Back! 👋</Text>

        {/* Pesan Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Input */}
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail} // React Native menggunakan onChangeText
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Untuk menyembunyikan password
          />

          {/* Tombol Login */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Link Daftar */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkText}>Daftar dulu</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

// --- STYLING ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f1e8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 24, // rounded-3xl
    width: "100%",
    maxWidth: 400,
    elevation: 5, // Shadow untuk Android
    shadowColor: "#000", // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ED8B3C",
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2", // bg-red-100
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626", // text-red-600
    fontSize: 14,
    textAlign: 'center',
  },
  formGroup: {
    gap: 16, // Jarak antar input
  },
  input: {
    width: "100%",
    padding: 14,
    backgroundColor: "#F9FAFB", // bg-gray-50
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#ED8B3C",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#6B7280", // text-gray-500
    fontSize: 14,
  },
  linkText: {
    color: "#ED8B3C",
    fontWeight: "bold",
    fontSize: 14,
  },
});