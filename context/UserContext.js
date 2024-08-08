import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('User');
  const [watched, setWatched] = useState([]);
  const [toWatch, setToWatch] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const watchedData = await AsyncStorage.getItem('watched');
        const toWatchData = await AsyncStorage.getItem('toWatch');
        const storedUsername = await AsyncStorage.getItem('username'); // Corrected variable

        if (watchedData) setWatched(JSON.parse(watchedData));
        if (toWatchData) setToWatch(JSON.parse(toWatchData));
        if (storedUsername) setUsername(storedUsername); // Use storedUsername
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  const updateUsername = async (newUsername) => {
    try {
      setUsername(newUsername);
      await AsyncStorage.setItem('username', newUsername);
    } catch (error) {
      console.error('Error saving username to AsyncStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ username, updateUsername, watched, toWatch, setToWatch, setWatched }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
