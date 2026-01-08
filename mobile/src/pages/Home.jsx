import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';

// If you have local images, import them directly
// import HeroImage from '../../assets/images/home/hero-image.jpg'; 

const Home = () => {
  const navigation = useNavigation();
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Example data (replace with your actual data source/props)
  const heroImages = [
    require('../../public/images/home/hero-image.jpg'), // Ensure paths are correct
    // ... other images
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header / Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Welcome to TubesMobile</Text>
          <Image 
            source={heroImages[0]} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Adopt')}
          >
            <Text style={styles.ctaText}>Adopt a Friend</Text>
          </TouchableOpacity>
        </View>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          {/* Map your news items here replacing <View> with <View> and <Text> with <Text> */}
          <View style={styles.newsCard}>
             <Text>News Item 1...</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50 equivalent
  },
  scrollContent: {
    paddingBottom: 100, // Space for Navbar
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});

export default Home;