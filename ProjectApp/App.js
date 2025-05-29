import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RestaurantsListScreen from './screens/RestaurantsListScreen';
import ReservationFormScreen from './screens/ReservationFormScreen';
import HomePage from './screens/HomePage';
import AuthLoadingScreen from './screens/AuthLoadingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Restaurants" component={RestaurantsListScreen} />
        <Stack.Screen name="ReservationForm" component={ReservationFormScreen} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
