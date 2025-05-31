import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { api } from '../services/api';

const RestaurantsListScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/restaurants');
      //console.log('[Restaurants] Response:', response.data);
      setRestaurants(response.data);
    } catch (err) {
      console.error('[Restaurants] Error:', err.response?.data || err.message);
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ReservationForm', { restaurant: item })}
    >
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search restaurants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredRestaurants.length === 0 ? (
        <Text style={styles.noResults}>No restaurants found.</Text>
      ) : (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.restaurant_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

export default RestaurantsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  profileButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  noResults: {
    fontSize: 16,
    color: '#777',
    marginTop: 30,
    textAlign: 'center',
  },
});
