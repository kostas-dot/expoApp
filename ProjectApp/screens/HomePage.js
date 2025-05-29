import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { api, setAuthToken } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Loaded token:', token);
        if (token) {
          setAuthToken(token);
          console.log('Auth header set:', api.defaults.headers.common.Authorization);
          await fetchUser();
          await fetchReservations();
        } else {
          Alert.alert('Authentication error', 'No token found, please log in again.');
          await AsyncStorage.removeItem('token');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      } catch (err) {
        console.error('[Init Error]', err.message);
        Alert.alert('Error', 'Something went wrong during initialization.');
      }
    };
    initialize();
  }, []);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      console.log('[HomePage] Fetching user...');
      const res = await api.get('/users/me');
      console.log('[HomePage] User response:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('[HomePage] User fetch error:', err);
      Alert.alert('Error', 'Failed to load user info');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      console.log('[HomePage] Fetching reservations...');
      const res = await api.get('/reservations/my');
      console.log('[HomePage] Reservations response:', res.data);
      setReservations(res.data);
    } catch (err) {
      console.error('[HomePage] Reservations error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to load reservations');
    } finally {
      setLoadingReservations(false);
    }
  };

  const deleteReservation = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      setAuthToken(token);
      console.log('[DeleteReservation] Deleting ID:', id);

      const res = await api.delete(`/reservations/${id}`);
      console.log('[DeleteReservation] Response:', res.data);  // ✅ Log the response

      Alert.alert('Deleted', 'Reservation cancelled');
      await fetchReservations();
    } catch (err) {
      console.error('[DeleteReservation Error]', err);
      if (err.response) {
        console.error('[Axios Error Response]', err.response.data);
      }
      Alert.alert('Error', 'Could not cancel reservation');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderReservation = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.restaurant_name}</Text>
      <Text style={styles.restaurantInfo}>
        <Text style={styles.label}>Location:</Text> {item.location}
      </Text>
      <Text style={styles.restaurantInfo}>
        <Text style={styles.label}>Description:</Text> {item.description}
      </Text>
      <View style={styles.reservationDetails}>
        <Text><Text style={styles.label}>Date:</Text> {formatDate(item.date)}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Time:</Text> {item.time}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>People:</Text> {item.people_count}</Text>
      </View>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => deleteReservation(item.reservation_id)}
        activeOpacity={0.8}
      >
        <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.header}>My Profile</Text>

      {loadingUser ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>User info not available</Text>
      )}

      <Text style={[styles.header, { marginTop: 30 }]}>My Reservations</Text>

      {loadingReservations ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : reservations.length === 0 ? (
        <Text style={styles.noReservations}>You have no reservations yet.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderReservation}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Restaurants')}
        >
          <Text style={styles.navButtonText}>Browse Restaurants</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  userInfo: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E90FF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  noReservations: {
    fontSize: 16,
    color: '#888',
    marginTop: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1E90FF',
  },
  restaurantInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  reservationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#B0B0B0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 18,
  },
  footer: {
    marginTop: 25,
    paddingBottom: 35,
  },
});
