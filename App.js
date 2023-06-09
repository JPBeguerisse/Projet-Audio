import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './component/Home';
import Record from './component/Record';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import RecordList from './component/RecordList';
import SendToServer from './component/SendToServer';



const tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator>
      {/* Configurez vos écrans internes avec Stack.Navigator */}
      <Stack.Screen name="Écran 3" component={SendToServer} />
    </Stack.Navigator>
  );
};

export default function App() {
  return ( 
    <NavigationContainer >
      <tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#242424', // Couleur du header
          },
          headerTintColor: 'white', // Couleur du texte du header
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
              iconColor = focused ? '#D9D9D9' : 'white';
            } else if (route.name === 'Record') {
              iconName = focused ? 'mic' : 'mic-outline';
              iconColor = focused ? '#D9D9D9' : 'white';
            } else if (route.name === 'Liste records') {
              iconName = focused ? 'musical-note' : 'musical-note-outline';
              iconColor = focused ? '#D9D9D9' : 'white';
            }
            else if (route.name === 'SendToServer') {
              iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              iconColor = focused ? '#D9D9D9' : 'white';
            }


            // Return the Ionicons component with the appropriate icon name
            return <Ionicons name={iconName} size={size} color={iconColor} />;
          },
          tabBarActiveTintColor: '#D9D9D9', // couleur du texte focus
          tabBarStyle: { 
            backgroundColor: '#242424', // Couleur de fond du Tab.Navigator
            display: 'flex' 
          }, 
        })}
      >
        <tab.Screen name='Accueil' component={Home}/>
        <tab.Screen name='Record' component={Record}/>
        <tab.Screen name='Liste records' component={RecordList}/>
        <tab.Screen name='SendToServer' component={SendToServer}/>
      </tab.Navigator>
    </NavigationContainer>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
