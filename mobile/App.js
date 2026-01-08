import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Pastikan path import ini sesuai dengan file Anda
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import SignUp from './src/pages/SignUp'; // Tambahkan ini jika ada

const Stack = createStackNavigator();

function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Bisa ganti dengan SplashScreen atau ActivityIndicator
    return null; 
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentUser ? (
        // --- STACK UNTUK USER YANG SUDAH LOGIN ---
        <>
          <Stack.Screen name="Home" component={Home} />
          {/* Tambahkan screen lain yang butuh login disini, misal Profile */}
        </>
      ) : (
        // --- STACK UNTUK USER BELUM LOGIN (Auth) ---
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
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