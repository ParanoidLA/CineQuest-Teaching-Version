import axios from 'axios';

const API_KEY = '9005d7d3f4f30fa7f744e1392c061c4a';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});


export const fetchSearchResults=async(query)=>
{
  try{

    const response=await axios.get(`${BASE_URL}/search/multi`,{
      params:{
        api_key:API_KEY,
        query: query,
      },
    });
    return response.data.results;

  }catch(error)
  {
    console.error('Error Fetching Search results:',error);
    throw error;
  }
}




export const fetchPopularMovies = async () => {
  try {
    const response = await api.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const fetchPopularTVShows = async () => {
  try {
    const response = await api.get('/tv/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};
export const fetchRecommendedMovies=async()=>{
  try {
    const response = await api.get('/movie/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching Recommended Movies:', error);
    throw error;
  }
};

export const fetchRecommendedShows=async()=>{
  try {
    const response = await api.get('/tv/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching Recommended Shows:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};


export const fetchTVShowDetails = async (tvShowId) => {
  try {
    const response = await api.get(`/tv/${tvShowId}`, {
      params: {
        append_to_response: 'videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
};

export const fetchMovieTrailer= async(movieId) =>{
  try{
    const response=await api.get(`/movie/${movieId}/videos`,{
      params:{
        language:'en-US',
      },
    });

    const trailers=response.data.results.filter(
      (video)=> video.site ==='YouTube' && video.type==='Trailer');
      return trailers.length?trailers[0].key:null;
    
  }catch(error
  )
  {
    console.error('Failed to fetch movie trailer:',error);
    throw error;
  }
};

export const fetchShowTrailer= async(tvShowId) =>{
  try{
    const response=await api.get(`/tv/${tvShowId}/videos`,{
      params:{
        language:'en-US',
      },
    });

    const trailers=response.data.results.filter(
      (video)=> video.site ==='YouTube' && video.type==='Trailer');
      return trailers.length?trailers[0].key:null;
    
  }catch(error
  )
  {
    console.error('Failed to fetch show trailer:',error);
    throw error;
  }
};

export const fetchSimilarMovies = async(movieId) =>{
  try{
    const response=await axios.get(`${BASE_URL}/movie/${movieId}/similar`,{
      params:{
        api_key:API_KEY,
      },
    });
    return response.data.results;
  }catch(error)
  {
    console.error('Error Fetching Similar Movies:',error);
    return [];
  }
};

export const fetchSimilarShows = async(tvShowId) =>{
  try{
    const response=await axios.get(`${BASE_URL}/tv/${tvShowId}/similar`,{
      params:{
        api_key:API_KEY,
      },
    });
    return response.data.results;
  }catch(error)
  {
    console.error('Error Fetching Similar shows:',error);
    return [];
  }
};


