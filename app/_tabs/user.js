import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useUser } from '../../context/UserContext';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import Carousel from '../components/Carousel';
import { MaterialIcons, Feather } from '@expo/vector-icons'; 
import { useTheme } from '../../context/ThemeContext'; 
import { useRouter } from 'expo-router';

const UserScreen = () => {
  const { theme, toggleTheme } = useTheme(); 
  const { username, updateUsername, watched, setWatched, toWatch, setToWatch } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const router=useRouter();

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    updateUsername(newUsername);
    setIsEditing(false);
  };

  const handleAddToWatched = (item) => {
    setWatched((prev) => [...prev, item]);
    setToWatch((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleAddToToWatch = (item) => {
    setToWatch((prev) => [...prev, item]);
    setWatched((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleRemoveFromWatched = (item) => {
    setWatched((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleRemoveFromToWatch = (item) => {
    setToWatch((prev) => prev.filter((i) => i.id !== item.id));
  };

  const renderItem = (item, listType) => {
    const isWatched = listType === 'watched';
    const isToWatch = listType === 'toWatch';

    return (
      <View style={styles.cardContainer} key={item.id}>
        {item.title ? (
          <MovieCard movie={item}  onPress={() => router.push(`/detail?movieId=${item.id}`)} />
        ) : (
          <TVShowCard show={item} onPress={() => router.push(`/detail?tvShowId=${item.id}`)} />
        )}
        <View style={styles.cardActions}>
          {isToWatch && !isWatched && (
            <TouchableOpacity onPress={() => handleAddToWatched(item)}>
              <MaterialIcons name="check-circle" size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          )}
          {isWatched && !isToWatch && (
            <TouchableOpacity onPress={() => handleRemoveFromWatched(item)}>
              <MaterialIcons name="remove-circle" size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          )}
          {isWatched && !isToWatch && (
            <TouchableOpacity onPress={() => handleAddToToWatch(item)}>
              <MaterialIcons name="remove-circle-outline" size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          )}
          {isToWatch && !isWatched && (
            <TouchableOpacity onPress={() => handleRemoveFromToWatch(item)}>
              <MaterialIcons name="check-circle-outline" size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' }]}>
      <View style={styles.topPadding} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isEditing ? (
            <TextInput
              style={[styles.usernameInput, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}
              value={newUsername}
              onChangeText={setNewUsername}
              onSubmitEditing={handleSavePress}
              returnKeyType="done"
            />
          ) : (
            <Text style={[styles.username, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Hi {username}</Text>
          )}
          <TouchableOpacity onPress={isEditing ? handleSavePress : handleEditPress}>
            <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>Watched Movies and TV Shows</Text>
      {watched.length > 0 ? (
        <Carousel
          data={watched}
          renderItem={({ item }) => renderItem(item, 'watched')}
        />
      ) : (
        <Text style={[styles.noItemsText, { color: theme === 'dark' ? '#FFFFFF' : 'grey' }]}>No watched items</Text>
      )}
      <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>To Watch Movies and TV Shows</Text>
      {toWatch.length > 0 ? (
        <Carousel
          data={toWatch}
          renderItem={({ item }) => renderItem(item, 'toWatch')}
        />
      ) : (
        <Text style={[styles.noItemsText, { color: theme === 'dark' ? '#FFFFFF' : 'grey' }]}>No items to watch</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topPadding: {
    paddingTop: 40, // Adjust the padding value as needed
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add this line
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 35,
    fontWeight: 'bold',
    marginRight: 8,
  },
  usernameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
    borderBottomWidth: 1,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  noItemsText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  cardContainer: {
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  themeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default UserScreen;
