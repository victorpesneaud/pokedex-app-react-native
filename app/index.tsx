import React from 'react';
import PokemonList from './components/PokemonList';
import Navbar from './components/navbar';

export default function HomeScreen() {
  return (
    <>
      <PokemonList />
      <Navbar />
    </>
  );
}