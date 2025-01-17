

// components/SearchBar.js
import React from 'react';
import { Searchbar, List } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const SearchBar = ({ query, onQueryChange, onQuerySubmit, suggestions }) => {
    const {theme}=useTheme();
  return (
    <View>
      <Searchbar
        placeholder="Search Movies or TV Shows"
        value={query}
        onChangeText={onQueryChange}
        onSubmitEditing={onQuerySubmit}
        style={[styles.searchBar,{backgroundColor:theme==='dark'?'#303030': '#E8E8E8'}]}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <List.Item
              key={index}
              title={suggestion.title || suggestion.name}
              onPress={() => onQuerySubmit({ nativeEvent: { text: suggestion.title || suggestion.name } })}
              style={styles.suggestionItem}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    margin: 8,
    borderRadius: 8,
    elevation: 2,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 4,
    marginHorizontal: 8,
    maxHeight: 200,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  suggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default SearchBar;
