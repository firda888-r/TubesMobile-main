import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah user sudah login saat aplikasi dibuka
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          setCurrentUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.log("Error loading user:", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    // Simpan data user ke penyimpanan HP
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = async () => {
    // Hapus data user dari HP
    await AsyncStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};