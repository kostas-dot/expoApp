import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';
import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons

export default function ReservationFormScreen({ route, navigation }) {
  const { restaurant, reservation, isEditing } = route.params;
  const [date, setDate] = useState(() => {
    try {
      if (isEditing && reservation?.date && /^\d{4}-\d{2}-\d{2}$/.test(reservation.date)) {
        const [year, month, day] = reservation.date.split('-').map(Number);
        return new Date(year, month, day);
      }
    } catch (e) {
      console.warn('Invalid date format:', reservation?.date, e);
    }
    return new Date();
  });
  console.log('Init reservation date:', reservation?.date);
  const [time, setTime] = useState(
    isEditing
      ? new Date(`1970-01-01T${reservation.time}`)
      : new Date()
  );
  const [peopleCount, setPeopleCount] = useState(isEditing ? reservation.people_count.toString() : '2');
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const formatDate = d => d.toISOString().split('T')[0];
  const formatTime = d => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

  const validate = () => {
    if (!date || !time || parseInt(peopleCount, 10) < 1) {
      Alert.alert('Oops', 'Please complete all fields.');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      setAuthToken(token);
      const payload = {
        restaurant_id: restaurant?.restaurant_id || reservation.restaurant_id,
        date: formatDate(date),
        time: formatTime(time),
        people_count: +peopleCount,
      };
      if (isEditing) {
        await api.put(`/reservations/${reservation.reservation_id}`, payload);
        navigation.navigate('Home');
      } else {
        await api.post('/reservations', payload);
        navigation.navigate('Restaurants');
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Reservation' : `Reserve at ${restaurant.name}`}
        </Text>
        {(restaurant || reservation?.restaurant) && (
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>
              {restaurant?.name || reservation.restaurant.name}
            </Text>
            <Text style={styles.restaurantLocation}>
              {restaurant?.location || reservation.restaurant.location}
            </Text>
            <Text style={styles.restaurantDescription}>
              {restaurant?.description || reservation.restaurant.description}
            </Text>
          </View>
        )}
        <View style={styles.card}>
          {/* Date Picker */}
          <TouchableOpacity
            style={styles.field}
            onPress={() => setShowDate(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <Text style={styles.fieldText}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDate}
            mode="date"
            onConfirm={d => { setDate(d); setShowDate(false); }}
            onCancel={() => setShowDate(false)}
            minimumDate={new Date()}
          />

          {/* Time Picker */}
          <TouchableOpacity
            style={styles.field}
            onPress={() => setShowTime(true)}
          >
            <Ionicons name="time-outline" size={20} color="#555" />
            <Text style={styles.fieldText}>
              {formatTime(time)}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showTime}
            mode="time"
            onConfirm={t => { setTime(t); setShowTime(false); }}
            onCancel={() => setShowTime(false)}
            minuteInterval={1}
          />

          {/* People Count */}
          <View style={styles.field}>
            <Ionicons name="people-outline" size={20} color="#555" />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={peopleCount}
              onChangeText={t => /^\d*$/.test(t) && setPeopleCount(t)}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primary]}
            onPress={submit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? 'Please wait...'
                : isEditing ? 'Update' : 'Reserve'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outline]}
            onPress={() => navigation.navigate(isEditing ? 'Home' : 'Restaurants')}
          >
            <Text style={[styles.buttonText, styles.outlineText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: '#F0F4F8',
    flexGrow: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    marginBottom: 12
  },
  fieldText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333'
  },
  input: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4
  },
  primary: {
    backgroundColor: '#007AFF'
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  outlineText: {
    color: '#007AFF'
  },
  restaurantInfo: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#444',
  },
});
