// index.js (Home Screen)
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import SearchBar from '../components/SearchBar'; // Import SearchBar component
import { fetchPopularMovies, fetchPopularTVShows, fetchSearchResults } from "../../utils/api";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const Home = () => {
  const router = useRouter(); 
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularTVShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const {theme}=useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const movies = await fetchPopularMovies();
        setPopularMovies(movies);
        const shows = await fetchPopularTVShows();
        setPopularTVShows(shows);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  const handleQueryChange = async (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const searchResults = await fetchSearchResults(query);
        setSuggestions(searchResults);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleQuerySubmit = (event) => {
    const query = event.nativeEvent.text.trim();
    if (query.length > 0) {
      router.push(`/searchScreen?query=${encodeURIComponent(query)}`);
    }
  };

  const renderMovieItem = ({ item }) => (
    <MovieCard
      movie={item}
      onPress={() => router.push(`/detail?movieId=${item.id}`)}
    />
  );

  const renderShowItem = ({ item }) => (
    <TVShowCard
      show={item}
      onPress={() => router.push(`/detail?tvShowId=${item.id}`)}
    />
  );

  return (
    <ScrollView style={[styles.container,{backgroundColor:theme==='dark'?'#000000':'#FFFFFF'}]}>
      <Text style={[styles.headerText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>CineQuest</Text>
      <SearchBar
        query={searchQuery}
        onQueryChange={handleQueryChange}
        onQuerySubmit={handleQuerySubmit}
        suggestions={suggestions}
      />
      <Text style={[styles.sectionText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Popular Movies</Text>
      <Carousel
        data={popularMovies}
        renderItem={renderMovieItem}
      />
      <Text style={[styles.sectionText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Popular TV Shows</Text>
      <Carousel
        data={popularShows}
        renderItem={renderShowItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff'
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 45,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left'
  },
});

export default Home;