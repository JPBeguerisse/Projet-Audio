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
     //const [assets, error] = useAssets(require('.. /assets/audio.wav'));


      // // Fonction pour envoyer le fichier
      const sendFile = async (recording) => {
        if (assets && assets.length > 0) {
          const fileUri = recording; // L'URI du fichier à téléverser
          const serverAddress = 'http://127.0.0.1:8000'; 
      
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

      // Fonction pour extraire le nom du fichier à partir du chemin complet
      const getFileNameFromPath = (filePath) => {
        if (!filePath) {
            return '';
          }
          const parts = filePath.split('/');
          return parts[parts.length - 1];
      };
      return(

        <View style={styles.container}>
          <Text style={styles.title}>Votre audio</Text>
          <View style={styles.items}>
            <Text style={styles.item}>{getFileNameFromPath(recording)}</Text>
          </View>
          <TouchableOpacity style={styles.btnWrapper} onPress={() => sendFile(recording)}>
            <Text style={styles.btn}>ENVOYER AU SERVER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnWrapper} onPress={() => downloadFile()}>
            <Text style={styles.btn}>TÉLÉCHARGER</Text>
          </TouchableOpacity>
        </View>

      )
      
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3939',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnWrapper: {
    width: '80%',
    backgroundColor: '#D9D9D9',
    borderRadius: 7,
    padding: 15,
    marginTop: 50,
  },

  btn: {
    color: 'black',
    fontWeight: 800,
    textAlign:'center',
  }, 

  item: {
    color: '#fff',
    borderBottomWidth: 1,
  },

  items: {
    color: '#fff',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginTop: 30,
  },

  title: {
    fontSize: '30px',
    color: '#fff'
  }
})

export default SendToServer;