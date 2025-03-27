import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPokemon } from '../store/pokemonSlice';
import { useRouter } from 'expo-router';


export default function PokemonList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, status } = useSelector((state) => state.pokemon);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchPokemon());
  }, []);

  const filteredList = list.filter(pokemon =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <Image source={require('../../assets/images/poke-ball.png')} style={styles.pokeball} />
        <Text style={styles.loadingText}>Chargement…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un Pokémon"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable onPress={() => router.push(`/pokemon/${item.name}`)}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </Pressable>
            <Pressable onPress={() => router.push(`/pokemon/${item.name}`)}>
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
  },
  name: {
    marginTop: 8,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  pokeball: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});