import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";

// Komponen Pembungkus untuk Cek Status Login
const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    
    if (!user && !inAuthGroup ) {
      // Jika user belum login, arahkan ke folder auth/login
      router.replace("../../src/pages/login");
    } else if (user && inAuthGroup) {
      // Jika user sudah login tapi masih di halaman login, arahkan ke home
      router.replace("../../src/pages/home");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ED8B3C" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}