import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function Adopt() {
  const navigation = useNavigation();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("http://10.0.2.2:5000/api/cats");
        const data = res.data.map((cat) => ({
          ...cat,
          image: cat.image
            ? `http://10.0.2.2:5000/images/${cat.image}`
            : null,
        }));
        setCats(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const filteredCats = cats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cari nama kucing..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredCats}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AdoptDetail", { id: item.id })}
          >
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.breed}>{item.breed || "Campuran"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  image: { width: "100%", height: 150, borderRadius: 10 },
  name: { fontWeight: "bold", marginTop: 8 },
  breed: { color: "#6B7280" },
});
