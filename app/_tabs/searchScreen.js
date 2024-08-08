import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import { fetchSearchResults, fetchSimilarMovies, fetchSimilarShows } from "../../utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const SearchScreen = () => {
  const { query } = useLocalSearchParams(); // Access the query from the router
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);
  const [itemType, setItemType] = useState(null); // Keep track of whether the item is a movie or a TV show
  const {theme}=useTheme();
  useEffect(() => {
    const searchMoviesOrShows = async () => {
      try {
        const results = await fetchSearchResults(query);
        setSearchResults(results);

        if (results.length > 0) {
          // Determine the type of the first search result
          const firstItem = results[0];
          const isMovie = !!firstItem.title;

          setItemType(isMovie ? 'movie' : 'tv');


          if (isMovie) {
            const similarMovies = await fetchSimilarMovies(firstItem.id);
            setSimilarItems(similarMovies);
          } else {
            const similarShows = await fetchSimilarShows(firstItem.id);
            setSimilarItems(similarShows);
          }
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
    searchMoviesOrShows();
  }, [query]);


  const renderSearchResultItem = ({ item }) => {

    const isMovie = !!item.title; 

    return isMovie ? (
      <MovieCard
        movie={item}
        onPress={() => router.push(`/detail?movieId=${item.id}`)}
      />
    ) : (
      <TVShowCard
        show={item}
        onPress={() => router.push(`/detail?tvShowId=${item.id}`)}
      />
    );
  };

  const renderSimilarItem = ({ item }) => {
    return itemType === 'movie' ? (
      <MovieCard
        movie={item}
        onPress={() => router.push(`/detail?movieId=${item.id}`)}
      />
    ) : (
      <TVShowCard
        show={item}
        onPress={() => router.push(`/detail?tvShowId=${item.id}`)}
      />
    );
  };

  return (
    <ScrollView style={[styles.container,{backgroundColor:theme==='dark'?'#000000':'#FFFFFF'}]}>
      <Text style={[styles.headerText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Search Results for "{query}"</Text>
      <Carousel
        data={searchResults}
        renderItem={renderSearchResultItem}
      />
      {similarItems.length > 0 && (
        <>
          <Text style={[styles.sectionText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>
            Similar {itemType === 'movie' ? 'Movies' : 'TV Shows'}
          </Text>
          <Carousel
            data={similarItems}
            renderItem={renderSimilarItem}
          />
        </>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left'
  },
});

export default SearchScreen;
