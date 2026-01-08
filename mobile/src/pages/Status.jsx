import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Status() {
  const { user } = useAuth();
  const [tab, setTab] = useState("adoptions");
  const [adoptions, setAdoptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const load = async () => {
    try {
      setLoading(true);
      const [a, r] = await Promise.all([
        axios.get(`http://YOUR_IP:5000/api/my-adoptions/${user.id}`),
        axios.get(`http://YOUR_IP:5000/api/my-reports/${user.id}`)
      ]);
      setAdoptions(a.data);
      setReports(r.data);
    } catch {}
    setLoading(false);
  };

  if (!user) {
    return <Text style={{ marginTop: 100, textAlign: "center" }}>Login dulu</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Tab label="Adopsi" active={tab === "adoptions"} onPress={() => setTab("adoptions")} />
        <Tab label="Rescue" active={tab === "reports"} onPress={() => setTab("reports")} />
      </View>

      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={tab === "adoptions" ? adoptions : reports}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: tab === "adoptions"
                  ? `http://YOUR_IP:5000/images/${item.cat_image}`
                  : `http://YOUR_IP:5000/uploads/${JSON.parse(item.image)?.[0]}` }}
                style={styles.img}
              />
              <View>
                <Text style={styles.bold}>{item.cat_name || "Rescue"}</Text>
                <Text style={styles.small}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function Tab({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={{ color: active ? "#fff" : "#999" }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f1e8" },
  tabs: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12 },
  tab: { flex: 1, padding: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#ED8B3C", borderRadius: 12 },
  card: { backgroundColor: "#fff", flexDirection: "row", padding: 12, borderRadius: 16, marginVertical: 6 },
  img: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
  bold: { fontWeight: "bold" },
  small: { color: "#666", fontSize: 12 }
});
