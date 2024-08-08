import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme from your ThemeContext

const TVShowCard = ({ show, onPress }) => {
  const { theme } = useTheme(); // Use the custom useTheme hook from your ThemeContext

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.shadowContainer}>
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme === 'dark' ? '#121212' : '#E8E8E8',
            },
          ]}
        >
          <Card.Cover
            source={{ uri: `https://image.tmdb.org/t/p/w500/${show.poster_path}` }}
            style={styles.cover}
          />
          <Card.Content style={styles.content}>
            <Title
              style={[
                styles.title,
                {
                  color: theme === 'dark' ? '#FFFFFF' : '#000000',
                },
              ]}
            >
              {show.name}
            </Title>
            <Paragraph
              style={[
                styles.paragraph,
                {
                  color: theme === 'dark' ? '#B0B0B0' : '#666666', // Adjusted color for better contrast
                },
              ]}
            >
              Rating: {show.vote_average}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 150, // Fixed width
    margin: 8,
  },
  shadowContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3, // Adjust shadow elevation
  },
  card: {
    flex: 1,
    borderRadius: 8,
    width: 150, // Fixed width
    height: 300, // Fixed height
  },
  cover: {
    width: '100%',
    height: 200, // Fixed height for the cover
  },
  content: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centered text
  },
  paragraph: {
    fontSize: 14,
    textAlign: 'center', // Centered text
  },
});

export default TVShowCard;