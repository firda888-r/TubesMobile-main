import axios from 'axios';

// Ganti '192.168.1.XX' dengan IP Address laptop Anda (cek pakai ipconfig/ifconfig)
// Jangan gunakan 'localhost'
const API_URL = 'http://192.168.64.218:5000'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;