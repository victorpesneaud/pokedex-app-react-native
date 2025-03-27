import { useSelector, useDispatch } from 'react-redux';
import { View, Text, FlatList, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { removeFavorite } from './store/favoritesSlice';
import Navbar from './components/navbar'

export default function FavoritesScreen() {
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const router = useRouter();

  const renderRightActions = (pokemon) => {
    return (
      <Pressable
        onPress={() => dispatch(removeFavorite({ name: pokemon.name }))}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Supprimer ❌</Text>
      </Pressable>
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun favori pour l’instant</Text>
        <Navbar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list} 
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Pressable onPress={() => router.push(`/pokemon/${item.name}`)}>
                <Text style={styles.name}>{item.name}</Text>
              </Pressable>
            </View>
          </Swipeable>
        )}
      />
    <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 },
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  image: { width: 80, height: 80 },
  name: {
    marginTop: 8,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 12,
    marginVertical: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
  container: {
    flex: 1,
    paddingBottom: 60, // Laisse de la place pour la navbar
    backgroundColor: '#f5f5f5', // Optionnel : joli fond
  },
});