import { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




const RecordList = ({ navigation, route }) => {
    // État pour stocker la liste des enregistrements
    const [listRecordings, setListRecordings] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);

    // Utilise useEffect pour sauvegarder les enregistrements chaque fois qu'ils changent
    useEffect(() => {
      updateRecordings(listRecordings);
    }, [listRecordings]);

    // Utilise useEffect pour mettre à jour la liste des enregistrements lorsque route.params change
    useEffect(() => {
        if (route.params) {
          const { recordings } = route.params;
          setListRecordings([...listRecordings, ...recordings]);
        }
      }, [route.params]);

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
          const updatedRecordings = [...listRecordings];
          updatedRecordings.splice(index, 1);
          
          // Mise à jour de la liste des enregistrements
          setListRecordings(updatedRecordings);
        }
      };


      const sendSelectedRecording = (recording) => {
        // Naviguer vers l'écran où vous souhaitez envoyer l'enregistrement sélectionné
        navigation.navigate('SendToServer', { selectedRecording:  recording});
         console.log(selectedRecording);
      };
      
    const toggleRecordingSelection = (recording) => {
        setSelectedRecording(recording === selectedRecording ? null : recording);
        console.log(selectedRecording);
      };
      
      

    // Fonction pour mettre à jour la liste des enregistrements
    const updateRecordings = async (recordings) => {
      try {
        await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des enregistrements:', error);
      }
    };

    

    useEffect(() => {
      const fetchRecordings = async () => {
        try {
          const savedRecordings = await AsyncStorage.getItem('recordings');
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
    

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Vos enregistrements</Text>
        <FlatList
          data={listRecordings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <>
            {/* <TouchableOpacity
                style={[styles.itemContainer, item === selectedRecording && styles.itemSelected]}
                onPress={() => toggleRecordingSelection(item)}
            >
                 <View style={styles.square}></View>
            </TouchableOpacity> */}

            
            {/* <View style={selectedRecording !== null ? styles.checkBoxContainer : null}>
                <CheckBox
                    value={selectedRecording === item}
                    onPress={() => toggleRecordingSelection(item)}
                />
            </View> */}
            
              <Text style={styles.item}>{getFileNameFromPath(item)}</Text>
            {/* Bouton pour lire l'enregistrement */}
              <TouchableOpacity onPress={() => playRecording(item)}>
                <Text>Lire</Text>
              </TouchableOpacity>

            {/* Bouton pour supprimer l'enregistrement */}
              <TouchableOpacity onPress={() => deleteRecording(item)}>
                <Text>Supprimer</Text>
              </TouchableOpacity>

            {/* Bouton pour supprimer l'enregistrement */}
            <TouchableOpacity onPress={() => sendSelectedRecording(item)}>
                <Text>Transformer</Text>
              </TouchableOpacity>
        </>
          )}
        />

        <TouchableOpacity style={styles.btnWrapper} onPress={sendSelectedRecording}>
            <Text style={styles.btn}>Suivant</Text>
        </TouchableOpacity>

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
        fontSize: '38px'
    },

    item: {
        color: '#fff',
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

      selectedCheckbox: {
        // Style pour le checkbox sélectionné
        backgroundColor: 'green', // Modifier la couleur selon votre préférence
      },
      checkbox: {
        // Style pour le checkbox non sélectionné
        color: 'gray', // Modifier la couleur selon votre préférence
      },

      square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
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
  });

export default RecordList;