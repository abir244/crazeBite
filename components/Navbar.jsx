import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';

export default function Navbar() {
  return (
    <View style={[
      styles.container,
      Platform.OS === 'web' ? styles.topNav : styles.bottomNav
    ]}>
      <Pressable style={styles.button}>
        <Text style={styles.label}>Home</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.label}>Menu</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.label}>Contact</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
  },

  // ✅ Navbar for Web (TOP)
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  // ✅ Navbar for Mobile (BOTTOM)
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
button: {
  backgroundColor: 'rgba(255,255,255,0.15)',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 30,        // ✅ Makes it rounded
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 5,            // ✅ Android shadow
},

label: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
  letterSpacing: 0.5,
},
});