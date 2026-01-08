import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import Context dan Halaman yang baru dibuat
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
// import SignUp from './src/pages/SignUp'; // Buat file ini nanti jika ingin fitur daftar

const Stack = createStackNavigator();

// Komponen untuk mengatur alur navigasi (User login -> Home, Belum -> Login)
function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // Atau ganti dengan Loading Spinner
  }

  return (
    <Stack.Navigator>
      {currentUser ? (
        // Jika User SUDAH Login, tampilkan Home
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      ) : (
        // Jika User BELUM Login, tampilkan Login
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          {/* <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} /> */}
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}