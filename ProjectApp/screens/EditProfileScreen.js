// screens/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // load existing profile
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      setAuthToken(token);
      try {
        const res = await api.get('/users/me');
        setName(res.data.name);
        setEmail(res.data.email);
      } catch {
        Alert.alert('Error', 'Failed to load profile');
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      return Alert.alert('Validation', 'Name and email cannot be empty');
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      setAuthToken(token);
      await api.put('/users/me', { name, email });
      Alert.alert('Success', 'Profile updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#00BFFF',
  },
  cancelButton: {
    backgroundColor: '#DC143C',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
