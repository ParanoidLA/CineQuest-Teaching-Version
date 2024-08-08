import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { fetchMovieDetails, fetchMovieTrailer, fetchTVShowDetails, fetchShowTrailer, fetchSimilarMovies, fetchSimilarShows } from "../../utils/api";
import { WebView } from 'react-native-webview';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import Carousel from '../components/Carousel';
import { useUser } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '../../context/ThemeContext'; // Import the useTheme hook
import { useRouter } from 'expo-router'; // Make sure to import useRouter

const Detail = () => { 
    const router = useRouter();
    const { movieId, tvShowId } = useLocalSearchParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trailerId, setTrailerId] = useState(null);
    const [similar, setSimilar] = useState([]);
    const { watched, setWatched, toWatch, setToWatch } = useUser();
    const { theme } = useTheme(); // Get the theme from the context

    useEffect(() => {
        const loadDetails = async () => {
            try {
                if (movieId) {
                    const movieDetails = await fetchMovieDetails(movieId);
                    setDetails(movieDetails);

                    const movieTrailerId = await fetchMovieTrailer(movieId);
                    setTrailerId(movieTrailerId);

                    const similarMovies = await fetchSimilarMovies(movieId);
                    setSimilar(similarMovies);
                } else if (tvShowId) {
                    const tvShowDetails = await fetchTVShowDetails(tvShowId);
                    setDetails(tvShowDetails);

                    const showTrailerId = await fetchShowTrailer(tvShowId);
                    setTrailerId(showTrailerId);

                    const showSimilar = await fetchSimilarShows(tvShowId);
                    setSimilar(showSimilar);
                }
            } catch (error) {
                console.error('Failed to fetch details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [movieId, tvShowId]);

    const handleMarkAsWatched = async () => {
        if (details) {
            const newWatched = [...watched, details];
            setWatched(newWatched);
            await AsyncStorage.setItem('watched', JSON.stringify(newWatched));
            console.log(`${details.title || details.name} added to Watched List.`);
        }
    };

    const handleMarkAsToWatch = async () => {
        if (details) {
            const newToWatch = [...toWatch, details];
            setToWatch(newToWatch);
            await AsyncStorage.setItem('toWatch', JSON.stringify(newToWatch));
            console.log(`${details.title || details.name} added to To Watch List.`);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!details) {
        return <Text style={[styles.text, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>No details available</Text>;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' }]}>
            {trailerId ? (
                <View style={styles.videoContainer}>
                    <WebView
                        source={{ uri: `https://www.youtube.com/embed/${trailerId}` }}
                        style={styles.video}
                        javaScriptEnabled
                        domStorageEnabled
                        allowsInlineMediaPlayback
                        onError={(error) => console.error('WebView error:', error)}
                    />
                </View>
            ) : (
                <Text style={[styles.noTrailerText, { color: theme === 'dark' ? '#999999' : '#333333' }]}>No trailer available</Text>
            )}

            <View style={styles.detailsContainer}>
                <Text style={[styles.title, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>{details.title || details.name}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Overview</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.overview}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Rating</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.vote_average}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Release Date</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.release_date || details.first_air_date}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Runtime</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.runtime ? `${details.runtime} minutes` : 'N/A'}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Genres</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.genres?.map((genre) => genre.name).join(', ')}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Production Companies</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.production_companies?.map((company) => company.name).join(', ') || 'N/A'}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Budget</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.budget ? `$${details.budget.toLocaleString()}` : 'N/A'}</Text>
                <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Revenue</Text>
                <Text style={[styles.text, { color: theme === 'dark' ? '#CCCCCC' : '#000000' }]}>{details.revenue ? `$${details.revenue.toLocaleString()}` : 'N/A'}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#444444' : '#DDDDDD' }]} onPress={handleMarkAsWatched}>
                    <Text style={[styles.buttonText, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Mark As Watched</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#444444' : '#DDDDDD' }]} onPress={handleMarkAsToWatch}>
                    <Text style={[styles.buttonText, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Mark As To Watch</Text>
                </TouchableOpacity>    
            </View>
            <View style={styles.similarContainer}>
                <Text style={[styles.similarTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                    {movieId ? 'Similar Movies' : 'Similar Shows'}
                </Text>
                <Carousel
                    data={similar}
                    renderItem={({ item }) =>    
                    (
                        movieId ? (
                            <MovieCard
                                movie={item}
                                onPress={() => router.push(`/detail?movieId=${item.id}`)}
                            />
                        ) : (
                            <TVShowCard
                                show={item}
                                onPress={() => router.push(`/detail?tvShowId=${item.id}`)}
                            />
                        )
                    )}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoContainer: {
        height: 200, 
        marginBottom: 16,
        marginTop:45,
    },
    video: {
        flex: 1,
    },
    detailsContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
    },
    noTrailerText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 16,
    },
    buttonContainer: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    similarContainer: {
        marginTop: 16,
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default Detail;
