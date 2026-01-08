import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Report() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    cat_name: "",
    description: "",
    reporterContact: "",
    locationDetail: ""
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin lokasi ditolak");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });
    })();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.7
    });
    if (!res.canceled) setPhoto(res.assets[0]);
  };

  const submit = async () => {
    if (!user) {
      Alert.alert("Harus login dulu");
      navigation.navigate("Login");
      return;
    }
    if (!photo || !location) {
      Alert.alert("Foto & lokasi wajib");
      return;
    }

    const data = new FormData();
    data.append("user_id", user.id);
    data.append("cat_name", form.cat_name || "Kucing Tanpa Nama");
    data.append("description", form.description);
    data.append("reporterContact", form.reporterContact);
    data.append(
      "location",
      `${form.locationDetail} (Lat:${location.latitude}, Lng:${location.longitude})`
    );

    data.append("photos", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg"
    });

    data.append("age", "Unknown");
    data.append("gender", "Unknown");
    data.append("breeds", "Unknown");

    try {
      setLoading(true);
      await axios.post("http://YOUR_IP:5000/api/reports", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      Alert.alert("Sukses", "Laporan terkirim");
      navigation.navigate("Status");
    } catch (e) {
      Alert.alert("Error", "Gagal kirim laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lapor Rescue</Text>

      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.photo} />
        ) : (
          <Text style={{ color: "#999" }}>Ambil Foto</Text>
        )}
      </TouchableOpacity>

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        >
          <Marker coordinate={location} draggable onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)} />
        </MapView>
      )}

      <TextInput style={styles.input} placeholder="Nama/Ciri"
        onChangeText={(v) => setForm({ ...form, cat_name: v })} />
      <TextInput style={styles.input} placeholder="Detail Lokasi"
        onChangeText={(v) => setForm({ ...form, locationDetail: v })} />
      <TextInput style={styles.input} placeholder="No WA"
        onChangeText={(v) => setForm({ ...form, reporterContact: v })} />
      <TextInput style={[styles.input, { height: 80 }]}
        multiline placeholder="Kondisi kucing"
        onChangeText={(v) => setForm({ ...form, description: v })} />

      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kirim Laporan</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f7f1e8" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  photoBox: { height: 180, backgroundColor: "#eee", borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  photo: { width: "100%", height: "100%", borderRadius: 16 },
  map: { height: 220, borderRadius: 16, marginBottom: 12 },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 },
  button: { backgroundColor: "#ED8B3C", padding: 16, borderRadius: 14, marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" }
});
