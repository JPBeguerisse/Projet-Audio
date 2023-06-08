import { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Filesystem from 'expo-file-system';
import { Asset, useAssets } from 'expo-asset';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FileSystem } from 'expo';


const SendToServer = ({ navigation, route}) => {
    const [recording, setRecording] = useState();
     // Utilise useEffect pour mettre à jour la liste des enregistrements lorsque route.params change
     useEffect(() => {
        if (route.params) {
          const { selectedRecording } = route.params;
          setRecording(selectedRecording);
          console.log("reçu", recording);
        }
      });

      const goBack = () => {
        // Revenir à l'écran précédent
        navigation.goBack();
      };
      
      // // Télécharger un fichier dans le répertoire des documents
      const downloadFile = async () => {
        // Créer un répertoire dans le répertoire des documents de l'application
        let directory = FileSystem.documentDirectory + "my_directory";
        await FileSystem.makeDirectoryAsync(directory);
      
        // Télécharger le fichier
        const serverAddress = "http://127.0.0.1:8000"; // Remplacez "http://example.com" par l'adresse du serveur de téléchargement
        const fileUri = serverAddress + "/download"; // Remplacez serverAddress par l'adresse du serveur de téléchargement
        const { uri } = await FileSystem.downloadAsync(fileUri, directory + "/hey.wav");
      };
      
      // Obtenir l'URI locale du fichier de ressources
      const [assets, error] = useAssets([require('.. /assets/audio.wav')]);
      
      // // Fonction pour envoyer le fichier
      const sendFile = async () => {
        if (assets && assets.length > 0) {
          const fileUri = assets[0].localUri; // L'URI du fichier que vous souhaitez téléverser
          const serverAddress = 'http://127.0.0.1:8000'; // Remplacez par l'adresse du serveur de téléversement
      
          const formData = new FormData();
          formData.append('file', { uri: fileUri, name: 'audio.wav', type: 'audio/wav' });
      
          try {
            const response = await fetch(serverAddress + '/upload', {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            // Gérer la réponse du serveur
            // ...
          } catch (error) {
            console.error('Erreur lors de l\'envoi du fichier:', error);
          }
        }
      };
      
}

export default SendToServer;