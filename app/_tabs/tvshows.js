
import React,{useState,useEffect} from "react";
import { View, Text, StyleSheet,ScrollView } from 'react-native';
import Carousel from '../components/Carousel';
import { fetchPopularTVShows,fetchRecommendedShows } from "../../utils/api";
import TVShowCard from '../components/TVShowCard';
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
const TVshow =() => {
    const router=useRouter();
    const [popularShow,setPopularShow]=useState([]);
  const [recommendedShow,setRecommendedShow]=useState([]);
  const {theme}=useTheme();

  useEffect(()=>{
    const loadData=async()=>{
      try {
        const popshows=await fetchPopularTVShows();
        setPopularShow(popshows);
        const recshow=await fetchRecommendedShows();
        setRecommendedShow(recshow);
      }catch(error)
      {
        console.error('failed to load data:',error);
      }
    };
    loadData();
  },[]);

  const renderShowItem = ({ item }) => (
    <TVShowCard
      show={item}
      onPress={() => router.push(`/detail?tvShowId=${item.id}`)}
    />
  );


  return (
    <ScrollView style={[styles.container,{backgroundColor:theme==='dark'?'#000000':'#FFFFFF'}]}>
      <Text style={[styles.headerText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Recommended Shows</Text>
      <Carousel
        data={recommendedShow}
        renderItem={renderShowItem}
      />
      <Text style={[styles.sectionText,{color:theme==='dark'?'#FFFFFF':'#000000'}]}>Popular Shows</Text>
      <Carousel
        data={popularShow}
        renderItem={renderShowItem}
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
  
export default TVshow;