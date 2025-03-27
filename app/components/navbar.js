import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={pathname === '/Home' ? styles.active : styles.link}>Home</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/favorites')}>
        <Text style={pathname === '/favorites' ? styles.active : styles.link}>Favori</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  link: {
    fontSize: 16,
    color: '#888',
  },
  active: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});