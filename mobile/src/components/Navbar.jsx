import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// Use lucide-react-native for icons
import { Home, Cat, ClipboardList, Siren, User, LogOut } from 'lucide-react-native'; 

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute(); // To check active tab

  // Helper to determine active color
  const getColor = (screenName) => route.name === screenName ? '#F59E0B' : '#9CA3AF';

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navItems}>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home color={getColor('Home')} size={24} />
          <Text style={[styles.navText, { color: getColor('Home') }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Adopt')}>
          <Cat color={getColor('Adopt')} size={24} />
          <Text style={[styles.navText, { color: getColor('Adopt') }]}>Adopt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Report')}>
          <Siren color={getColor('Report')} size={24} />
          <Text style={[styles.navText, { color: getColor('Report') }]}>Report</Text>
        </TouchableOpacity>

        {/* Add logic for Auth/Profile similar to your web code */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <User color={getColor('Profile')} size={24} />
          <Text style={[styles.navText, { color: getColor('Profile') }]}>Profile</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 20, // For safe area on newer iPhones
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default Navbar;