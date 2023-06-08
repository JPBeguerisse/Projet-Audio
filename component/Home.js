import { StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import axios from 'axios';
import { useState } from 'react';


const Home = ({navigation, route}) => {

    const [ipAddress, setIpaddress] = useState('');
    const [port, setPort] = useState('');

    //Véfication de la connexion au server
    // envoie de notification si connexion réussi ou non
    const checkServerConnexion = () => {
        axios.get(`http://${ipAddress}:${port}`)
        .then(response => {
            console.log("Connexion au server réussi");
            alert("Connexion au server réussi");
        })
        .catch(error => {
            console.log("Connexion au server non réussi");
            alert("Connexion au server impossible! Veuillez vérifier l'adresse IP ou le port");
        })
    }

    console.log(ipAddress);
    console.log(port);


    return(
        <SafeAreaView style={styles.containerSafearea} >
            {/* Affichage de l'image */}
            <Image
                source={require('../assets/rave.png')} // ou {uri: 'https://example.com/image.png'} pour une image à partir d'une URL
            />

            {/* Champ de texte pour l'adresse IP */}
            <TextInput style={styles.input} placeholder='Adresse IP' placeholderTextColor="white" onChangeText={(text) => {setIpaddress(text)}}></TextInput>
            
            {/* Champ de texte pour le port */}
            <TextInput style={styles.input} placeholder='Port' placeholderTextColor="white" onChangeText={(text) => {setPort(text)}}></TextInput>
            
            {/* Bouton pour tester la connexion au server */}
            <TouchableOpacity style={styles.btnWrapper} onPress={checkServerConnexion}>
                <Text style={styles.btnConnexion}>Tester la connexion au server</Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3A3939',
      alignItems: 'center',
      justifyContent: 'center',
    },

    containerSafearea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3A3939',
    },

    input: {
        borderWidth: 1,
        padding: 15,
        marginTop: 30,
        width: '80%',
        borderColor: '#D9D9D9',
        borderRadius: 7,
        color: 'white'
    },

    btnWrapper: {
        width: '80%',
        backgroundColor: '#D9D9D9',
        borderRadius: 7,
        padding: 15,
        marginTop: 30,
      },
  
      btnConnexion: {
        color: 'black',
        fontWeight: 800,
        textAlign:'center'

      }, 
  });

export default Home;