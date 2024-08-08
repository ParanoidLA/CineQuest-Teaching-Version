
import React,{useState,useEffect} from "react";
import { View, Text, StyleSheet,ScrollView } from 'react-native';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';
import { fetchPopularMovies,fetchRecommendedMovies } from "../../utils/api";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";


const Movies = () => {
  const router=useRouter();

  const [popularMovies,setPopularMovies]=useState([]);
  const [recommendedMovies,setRecommendedMovies]=useState([]);
  const {theme}=useTheme();

  useEffect(()=>{
    const loadData=async()=>{
      try {
        const popmovies=await fetchPopularMovies();
        setPopularMovies(popmovies);
        const recmovies=await fetchRecommendedMovies();
        setRecommendedMovies(recmovies);
      }catch(error)
      {
        console.error('failed to load data:',error);
      }
    };
    loadData();
  },[]);

  const renderMovieItem = ({ item }) => (
    <MovieCard
      movie={item}
      onPress={() => router.push(`/detail?movieId=${item.id}`)}
    />
  );


  return (
    <ScrollView style={[styles.container,{backgroundColor:theme==='dark'?'#000000':'#FFFFFF'}]}>
      <Text style={[styles.headerText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Recommended Movies</Text>
      <Carousel
        data={recommendedMovies}
        renderItem={renderMovieItem}
      />
      <Text style={[styles.sectionText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Popular Movies</Text>
      <Carousel
        data={popularMovies}
        renderItem={renderMovieItem}
      />


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'#fffff'
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:45,
  },
  sectionText:{
    fontSize: 22,
    fontWeight: 'bold',
    marginTop:20,
    marginBottom:10,
    textAlign:'left'
  }
});

export default Movies;
