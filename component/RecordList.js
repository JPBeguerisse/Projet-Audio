import { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Ionicons from 'react-native-vector-icons/Ionicons';




const RecordList = ({ navigation, route }) => {
    // État pour stocker la liste des enregistrements
    const [listRecordings, setListRecordings] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    
    // Utilise useEffect pour sauvegarder les enregistrements chaque fois qu'ils changent
    useEffect(() => {
      updateRecordingsList(listRecordings);
    }, [listRecordings]);

    // Utilise useEffect pour mettre à jour la liste des enregistrements lorsque route.params change
    useEffect(() => {
        if (route.params) {
          const { recordings } = route.params;
          setListRecordings([...listRecordings, ...recordings]);
          saveRecording(recordings);
        }
      }, [route.params]);

    //Récupérer les enregistrements sauvegardés pour les afficher même si on quitte l'application
    useEffect(() => {
      const fetchRecordings = async () => {
        try {
          const savedRecordings = await AsyncStorage.getItem('updatedRecordings');
          if (savedRecordings) {
            setListRecordings(JSON.parse(savedRecordings));
            console.log("SAVE", savedRecordings);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des enregistrements:', error);
        }
      };
      fetchRecordings();
    }, []);

      const saveRecording = (recordings) => {
        //const uri = recording.getURI();
        const updatedRecordings = [...listRecordings, ...recordings];
        //setRecordingsSave(updatedRecordings);
      
        // Sauvegarde dans AsyncStorage
        AsyncStorage.setItem('updatedRecordings', JSON.stringify(updatedRecordings))
          .then(() => {
            console.log('Enregistrements sauvegardés avec succès.');
          })
          .catch(error => {
            console.error('Erreur lors de la sauvegarde des enregistrements:', error);
          });
      
        // navigation.navigate('RecordList', { recordings: updatedRecordings });
      };
      

    // Fonction pour lire un enregistrement audio
    const playRecording = async (uri) => {
        try {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync({ uri });
          await soundObject.playAsync();
          // Vous pouvez également gérer d'autres actions telles que la pause, l'arrêt, etc.
        } catch (error) {
          console.error('Erreur lors de la lecture de l\'enregistrement audio:', error.message);
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

    // Fonction pour supprimer un enregistrement de la liste
    const deleteRecording = (recording) => {
        // Recherche de l'index de l'enregistrement dans la liste
        const index = listRecordings.indexOf(recording);
        
        if (index !== -1) {
          // Suppression de l'enregistrement en utilisant la méthode splice
          //const updatedRecordings = [...listRecordings];
          const updatedRecordings = listRecordings.filter(item => item !== recording);

          updatedRecordings.splice(index, 1);
          
          // Mise à jour de la liste des enregistrements
          setListRecordings(updatedRecordings);
          updateRecordingsList(updatedRecordings);
        }
      };


      const sendSelectedRecording = (recording) => {
        // Naviguer vers l'écran où vous souhaitez envoyer l'enregistrement sélectionné
        navigation.navigate('SendToServer', { selectedRecording:  recording});
         console.log(selectedRecording);
      };
      

    // Fonction pour mettre à jour la liste des enregistrements dans le storage
    const updateRecordingsList = async (recordings) => {
      try {
        await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des enregistrements:', error);
      }
    };

    const createDirectory = async () => {
      try {
        const directory = `${FileSystem.documentDirectory}my_directory`; // Remplacez "my_directory" par le nom du dossier que vous souhaitez créer
        await FileSystem.makeDirectoryAsync(directory);
        console.log('Dossier créé avec succès');
      } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);
      }
    }
      
    return (
        <View style={styles.container}>
        <FlatList
          data={listRecordings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <>
            <View style={styles.items}>
              <Text style={styles.item}>{getFileNameFromPath(item)}</Text>
            {/* Bouton pour lire l'enregistrement */}
            <View style={styles.grpBtn}>
              <TouchableOpacity style={styles.read} onPress={() => playRecording(item)}>
                <Text style={styles.txtBtn}>Lire</Text>
              </TouchableOpacity>

            {/* Bouton pour supprimer l'enregistrement */}
              <TouchableOpacity style={styles.delete} onPress={() => deleteRecording(item)}>
                <Text style={styles.txtBtn}>Supprimer</Text>
              </TouchableOpacity>

            {/* Bouton pour tranformer l'enregistrement */}
            <TouchableOpacity style={styles.transform} onPress={() => sendSelectedRecording(item)}>
                <Text style={styles.txtBtn}>Transformer</Text>
              </TouchableOpacity>
              </View>
            </View>
        </>
          )}
        />

      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3A3939',
      alignItems: 'center',
      justifyContent: 'center',
    },

    title: {
        color: '#fff',
        fontSize: '38px',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',

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

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
      },
      checkBoxContainer: {
        width: 24,
        height: 24,
        marginRight: 8,
        backgroundColor: 'red',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
      },

      grpBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      },

      btns: {
        margin: 10,
        borderRadius: 7,
        padding: 10,
        marginTop: 10,
      },

      delete: {
        backgroundColor: 'red',
        color: '#fff',
        margin: 10,
        borderRadius: 7,
        padding: 10,
        marginTop: 10,
      },

      read: {
        backgroundColor: 'green',
        color: '#fff',
        margin: 10,
        borderRadius: 7,
        padding: 10,
        marginTop: 10,
      },

      transform: {
        backgroundColor: 'blue',
        color: '#fff',
        margin: 10,
        borderRadius: 7,
        padding: 10,
        marginTop: 10,
      }, 

      txtBtn: {
        color: '#fff',
        fontWeight: '600',
      }
  });

export default RecordList;