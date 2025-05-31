// screens/HomePage.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';

export default function HomePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication error', 'Please log in again.');
        return navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
      setAuthToken(token);
      await fetchUser();
      await fetchReservations();
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error('[HomePage] fetchUser error:', err);
      Alert.alert('Error', 'Unable to load profile info.');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const res = await api.get('/reservations/my');
      // Sort from oldest to newest
      const sorted = res.data
        .slice() // clone
        .sort((a, b) => {
          // 1) Compare dates
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          // 2) Same date → compare times
          const [ah, am] = a.time.split(':').map(Number);
          const [bh, bm] = b.time.split(':').map(Number);
          if (ah !== bh) return ah - bh;
          return am - bm;
        });
      setReservations(sorted);
    } catch (err) {
      console.error('[HomePage] fetchReservations error:', err);
      Alert.alert('Error', 'Unable to load reservations.');
    } finally {
      setLoadingReservations(false);
    }
  };

  const deleteReservation = async (id) => {
    setLoadingReservations(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) setAuthToken(token);
      api.delete(`/reservations/${id}`);
      Alert.alert('Deleted', 'Reservation cancelled');
      await fetchReservations();
    } catch (err) {
      console.error('[HomePage] deleteReservation error:', err);
      Alert.alert('Error', 'Could not cancel reservation.');
    } finally {
      setLoadingReservations(false);
    }
  };

  const editReservation = (reservation) => {
    const restaurant = {
      name: reservation.restaurant_name,
      location: reservation.location,
      description: reservation.description,
      restaurant_id: reservation.restaurant_id,
    };

    navigation.navigate('ReservationForm', {
      reservation,
      restaurant,
      isEditing: true,
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

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
        <Text>
          <Text style={styles.label}>Date:</Text> {formatDate(item.date)}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Time:</Text> {item.time}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>People:</Text> {item.people_count}
        </Text>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editReservation(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => deleteReservation(item.reservation_id)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
          <TouchableOpacity
            style={styles.profileEditButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.profileEditText}>Edit Profile</Text>
          </TouchableOpacity>
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  navButton: {
    backgroundColor: '#00BFFF',
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
  profileEditButton: {
    backgroundColor: '#FF7F50',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  profileEditText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
