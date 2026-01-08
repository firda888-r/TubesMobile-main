// mobile/src/components/Navbar.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, Cat, Siren, User } from 'lucide-react-native'; 

const Navbar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navItems}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Define Icon based on route name
          let IconComponent;
          if (route.name === 'Home') IconComponent = Home;
          else if (route.name === 'Adopt') IconComponent = Cat;
          else if (route.name === 'Report') IconComponent = Siren;
          else if (route.name === 'Profile') IconComponent = User;
          else IconComponent = Home; // Default

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? '#F59E0B' : '#9CA3AF'; // Orange aktif, Gray tidak aktif

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.navItem}
            >
              <IconComponent color={color} size={24} />
              <Text style={[styles.navText, { color }]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20, // Safe area for iOS
    paddingTop: 12,
    height: 85, // Tinggi navbar
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
    fontWeight: '500',
  },
});

export default Navbar;