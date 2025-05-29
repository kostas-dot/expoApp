import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export default function ReservationFormScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [time, setTime] = useState(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (dateObj) =>
    dateObj ? dateObj.toISOString().split('T')[0] : '';

  const formatTime = (dateObj) => {
    if (!dateObj) return '';
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);

  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleConfirmTime = (selectedTime) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  const validateInputs = () => {
    if (!date) {
      Alert.alert('Missing Date', 'Please select a reservation date.');
      return false;
    }
    if (!time) {
      Alert.alert('Missing Time', 'Please select a reservation time.');
      return false;
    }
    if (!peopleCount || parseInt(peopleCount, 10) <= 0) {
      Alert.alert('Invalid Number', 'Please enter a valid number of people.');
      return false;
    }
    return true;
  };

  const handleReserve = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const reservationData = {
        restaurant_id: restaurant.restaurant_id,
        date: formatDate(date),
        time: formatTime(time),
        people_count: parseInt(peopleCount, 10),
      };

      console.log('[Submitting]', reservationData);
      const response = await api.post('/reservations', reservationData);

      const successMessage =
        response?.data?.message || `Reservation at ${restaurant.name} confirmed!`;

      Alert.alert('Success', successMessage);
      navigation.navigate('Restaurants');
    } catch (error) {
      console.error('Reservation error:', error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Unknown error occurred';
      Alert.alert('Reservation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isReserveDisabled =
    loading || !date || !time || !peopleCount || parseInt(peopleCount, 10) <= 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Reserve at {restaurant.name}</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={showDatePicker}
          activeOpacity={0.7}
        >
          <Text style={date ? styles.selectedText : styles.placeholderText}>
            {date ? formatDate(date) : 'Select Date'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={showTimePicker}
          activeOpacity={0.7}
        >
          <Text style={time ? styles.selectedText : styles.placeholderText}>
            {time ? formatTime(time) : 'Select Time'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
          minuteInterval={15}
          is24Hour={false}
        />

        <TextInput
          placeholder="Number of People"
          keyboardType="numeric"
          value={peopleCount}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setPeopleCount(text);
          }}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Submitting...' : 'Reserve'}
            onPress={handleReserve}
            disabled={isReserveDisabled}
            color={isReserveDisabled ? '#a0cfff' : '#007AFF'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    color: '#333',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
