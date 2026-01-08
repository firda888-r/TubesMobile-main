import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AdoptDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://10.0.2.2:5000/api/adoption/${id}`
        );
        setCat({
          ...res.data,
          image: `http://10.0.2.2:5000/images/${res.data.image}`,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAdopt = () => {
    Alert.alert(
      "Konfirmasi",
      `Ajukan adopsi untuk ${cat.name}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          onPress: async () => {
            await axios.post("http://10.0.2.2:5000/api/adopt", {
              user_id: 1,
              cat_id: cat.id,
            });
            Alert.alert("Berhasil", "Pengajuan adopsi dikirim");
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View>
      <Image source={{ uri: cat.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{cat.name}</Text>
        <Text>{cat.description}</Text>

        <TouchableOpacity style={styles.button} onPress={handleAdopt}>
          <Text style={styles.buttonText}>Ajukan Adopsi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 300 },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  button: {
    backgroundColor: "#F97316",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
