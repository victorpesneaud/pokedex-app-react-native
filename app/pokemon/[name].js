import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import axios from 'axios';
import { useNavigation } from 'expo-router';

export default function PokemonDetail() {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState('');
  const [evolutions, setEvolutions] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const scale = useSharedValue(1);
  const navigation = useNavigation();

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: scale.value }],
    opacity: scale.value < 1 ? 0.5 : 1,
  };
});
  

const animate = () => {
  scale.value = 0.8;
  setTimeout(() => {
    scale.value = withSpring(1);
  }, 50);
};

const handleAddToFavorites = () => {
  dispatch(addFavorite({
    name: pokemon.name,
    image: pokemon.sprites.front_default,
  }));
  animate();
};

const handleRemoveFromFavorites = () => {
  dispatch(removeFavorite({ name: pokemon.name }));
  animate();
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(res.data);

        if (res.data?.name) {
          navigation.setOptions({
            title: res.data.name.charAt(0).toUpperCase() + res.data.name.slice(1),
          });
        }

        const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        const frEntry = species.data.flavor_text_entries.find(
          (entry) => entry.language.name === 'fr'
        );
        setDescription(frEntry?.flavor_text.replace(/\f/g, ' ') || '');

        const evolutionRes = await axios.get(species.data.evolution_chain.url);
        const chain = evolutionRes.data.chain;

        const extractEvolutions = (node) => {
          const evoList = [];
          let current = node;
          while (current) {
            evoList.push(current.species.name);
            current = current.evolves_to?.[0];
          }
          return evoList;
        };

        const evolutionNames = extractEvolutions(chain);
        const evolutionDetails = await Promise.all(
          evolutionNames.map(async (evoName) => {
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
            return {
              name: evoName,
              image: res.data.sprites.front_default,
            };
          })
        );

        setEvolutions(evolutionDetails);
      } catch (err) {
        console.error('Erreur lors du chargement du Pokémon', err);
      }
    };

    fetchData();
  }, [name]);

  if (!pokemon) return <Text>Chargement...</Text>;

  const isAlreadyFavorite = favorites.some((fav) => fav.name === pokemon.name);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{pokemon.name}</Text>
      <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.section}>Ligne évolutive :</Text>
      <View style={styles.evolutions}>
        {evolutions.map((evo) => (
          <View key={evo.name} style={styles.evoCard}>
            <Image source={{ uri: evo.image }} style={styles.evoImage} />
            <Text style={styles.evoName}>{evo.name}</Text>
          </View>
        ))}
      </View>
      {!isAlreadyFavorite ? (
        <Animated.View style={[animatedStyle]}>
          <Pressable onPress={handleAddToFavorites} style={styles.favButton}>
            <Text style={styles.favButtonText}>Ajouter aux favoris +</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View style={[animatedStyle]}>
          <Pressable onPress={handleRemoveFromFavorites} style={[styles.favButton, { backgroundColor: '#ff6666' }]}>
            <Text style={styles.favButtonText}>Retirer des favoris -</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 24, 
    alignItems: 'center' 
  },
  name: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textTransform: 'capitalize', 
    marginBottom: 12 
  },
  image: { 
    width: 150, 
    height: 150, 
    marginBottom: 16 
  },
  description: { 
    fontSize: 16, 
    fontStyle: 'italic', 
    textAlign: 'center' 
  },
  section: { 
    marginTop: 24, 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  evolutions: { 
    flexDirection: 'row', 
    gap: 16, 
    marginTop: 12 
  },
  evoCard: { 
    alignItems: 'center' 
  },
  evoImage: { 
    width: 80, 
    height: 80 
  },
  evoName: { 
    marginTop: 4, 
    textTransform: 'capitalize' 
  },
  favButton: {
    marginTop: 24,
    backgroundColor: '#ffcc00',
    padding: 12,
    borderRadius: 8,
  },
  favButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

