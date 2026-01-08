import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    image: "",
  });

  const handleSubmit = async () => {
    try {
      await fetch("http://10.0.2.2:5000/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      Alert.alert("Sukses", "News berhasil ditambahkan");
      setForm({ title: "", desc: "", image: "" });
    } catch (err) {
      Alert.alert("Error", "Gagal menambahkan news");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Judul"
        style={styles.input}
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
      />

      <TextInput
        placeholder="Deskripsi"
        style={[styles.input, styles.textArea]}
        multiline
        value={form.desc}
        onChangeText={(text) => setForm({ ...form, desc: text })}
      />

      <TextInput
        placeholder="URL Gambar"
        style={styles.input}
        value={form.image}
        onChangeText={(text) => setForm({ ...form, image: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add News</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  textArea: { height: 100 },
  button: {
    backgroundColor: "#F97316",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
