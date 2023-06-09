import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';


const Record = ({ route}) => {
    // const [isRecord, setIsRecord] = useState(false);
    const [isStart, setIsStart] = useState(false);
    // const [isPlay, setIsPlay] = useState(false);
    
    // prend en paramètre un tableau pour y stocker les enregistrement
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [recordingsSave, setRecordingsSave] = useState([]);
 
    const [isRecording, setIsRecording] = useState(false);

    const navigation = useNavigation();

    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [soundObject, setSoundObject] = useState(null);
    const [currentRecording, setCurrentRecording] = useState(null);

    const [isRecordingFinished, setIsRecordingFinished] = useState(false);


    useEffect(() => {
        if (soundObject) {
          // Écoute les mises à jour de l'état de lecture
          soundObject.setOnPlaybackStatusUpdate((status) => {
            if (!status.isPlaying && status.didJustFinish) {
              // Si la lecture est terminée, réinitialise la position de lecture à zéro
              soundObject.setPositionAsync(0);
              setIsPlaying(false);
            }
          });
        }
        
        return () => {
          if (soundObject) {
            soundObject.unloadAsync(); // Décharge l'objet soundObject lorsqu'il n'est plus nécessaire
            setIsPlaying(false);
          }
        };
      }, [soundObject]);
      


    useEffect(() => {
        const requestAudioPermission = async () => {
          const { status } = await Audio.requestPermissionsAsync();
          if (status !== 'granted') {
            console.error("Permission d'enregistrement audio non accordée");
            return;
          }
        };
      
        const setAudioMode = async () => {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true, // Activer l'enregistrement audio sur iOS
            playsInSilentModeIOS: true, // Lecture en mode silencieux sur iOS
          });
        };
      
        const initializeAudio = async () => {
          await Promise.all([requestAudioPermission(), setAudioMode()]);
        };
      
        initializeAudio();
      }, []);


    const startRecording = async () => {
        try{
            // Options de configuration pour l'enregistrement audio
            const recordingOptions = {
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                  },
                  ios: {
                    extension: '.m4a',
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                  },
            };
            setIsRecordingFinished(false); // Enregistrement terminé

            // Création d'une nouvelle instance d'enregistrement audio
            const recording = new Audio.Recording();

            // Préparation de l'enregistrement avec les options de configuration
            await recording.prepareToRecordAsync(recordingOptions);

            // Démarrage de l'enregistrement
            await recording.startAsync();

            // Mise à jour des variables d'état pour enregistrer l'instance d'enregistrement et indiquer que l'enregistrement est en cours
            setRecording(recording);
            setIsRecording(true);
        console.log('Enregistrement audio en cours...');
        } catch (error) {
            console.error('Erreur lors du démarrage de l\'enregistrement audio:', error.message);
        }
    }


    //FONCTION POUR ARRETER L'ENREGISTREMENT
    const stopRecording = async () => {
    try{
         // Arrêt et déchargement de l'enregistrement audio
        await recording.stopAndUnloadAsync();

        // Récupération de l'URI (Uniform Resource Identifier) de l'enregistrement
        const uri = recording.getURI();
        
        // Mise à jour de la variable d'état pour indiquer que l'enregistrement est terminé
        setIsRecording(false);
        console.log('Enregistrement audio terminé:', uri);

        setRecordings([...recordings, uri]);
        // console.log('LES ENREGISTREMENTS', recordings);

       //setIsPlaying(true);
       setIsRecordingFinished(true); // Enregistrement terminé



    }catch (error) {
        console.error('Erreur lors de l\'arrêt de l\'enregistrement audio:', error.message);
    }
   }
   
   //Fonction pour sauvegarder l'enregistrement dans une liste de sauvegarde qu'on envoie vers la 3e tab pour les afficher
    const saveRecording = async () => {
      try {
        const uri = recording.getURI();

        const fileName = 'audio.wav'; // Nom du fichier d'enregistrement
        //const directory = `${FileSystem.documentDirectory}recordings/`; // Chemin du dossier de sauvegarde
        const directory = FileSystem.documentDirectory + "my_directory";

        // Créer le dossier s'il n'existe pas
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

        // Copier le fichier d'enregistrement dans le dossier de sauvegarde
        const savedFileUri = `${directory}${fileName}`;
        await FileSystem.copyAsync({ from: uri, to: savedFileUri });

        const updatedRecordings = [...recordingsSave, uri]; // Ajoute le nouvel enregistrement à la liste des enregistrements sauvegardés
        setRecordingsSave(updatedRecordings);
        
        //console.log('LES ENREGISTREMENTS SAUVEGARDES', updatedRecordings);

        setIsRecordingFinished(false); // Enregistrement terminé 

        navigation.navigate('Liste records', { recordings: updatedRecordings });
        setRecordingsSave([]);

      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'enregistrement:', error);
      }
        //console.log('LES ENREGISTREMENTS SAUVEGARDES', updatedRecordings);
    };
  

   //fonction POUR LIRE l'enregistremenr
        const playRecording = async () => {
            try {
              const lastRecording = recordings[recordings.length - 1]; // Récupère le dernier enregistrement de la liste
                console.log("LAST RECORD", lastRecording);
                if (!soundObject || lastRecording !== currentRecording) {
                    // Si l'objet soundObject n'est pas encore initialisé ou si le dernier enregistrement est différent de l'enregistrement actuel
                    
                    // Décharge l'ancien soundObject s'il existe
                    if (soundObject) {
                      await soundObject.unloadAsync();
                    }
                    
                // Crée un nouveau soundObject et charge l'enregistrement audio
                const newSoundObject = new Audio.Sound();
                await newSoundObject.loadAsync({ uri: lastRecording });
                setSoundObject(newSoundObject);
                setCurrentRecording(lastRecording);

                // Démarre la lecture
                await newSoundObject.playAsync();
                setIsPlaying(true);
              } else {
                if (isPlaying) {
                  // Si la lecture est en cours, mettre l'audio en pause
                  await soundObject.pauseAsync();
                  setIsPlaying(false);
                } else {
                  // Si la lecture est en pause, reprenez la lecture
                  await soundObject.playAsync();
                  setIsPlaying(true);
                }
              }
            } catch (error) {
              console.error('Erreur lors de la lecture de l\'enregistrement audio:', error.message);
            }
          };
          


    //FONCTION POUR NAVIGUER
    const navigateToRecordings = () => {
        navigation.navigate('RecordList', {recordings: recordings});
    };

    return(
        <SafeAreaView style={styles.container}>
            {/* Affichage de l'image */}
    

            <Image
                source={require('../assets/rave.png')} 
                style={{marginBottom: 10}}
            />

            {
            isRecording  && 
                <Image
                    source={require('../assets/voice-recorder.png')} 
                    style={{ width: 185, height: 185 }} 
                />
            }

            {
            !isRecording  && 
            <Image
                source={require('../assets/record.png')} 
                style={{ width: 185, height: 185 }}
                />
            }

            {
                isRecording ? (
                    <TouchableOpacity style={styles.btnWrapper} onPress={stopRecording}>
                        <Text style={styles.btn}>TERMINER</Text>
                    </TouchableOpacity>
                ) : (
                   

                    <TouchableOpacity style={styles.btnWrapper} onPress={startRecording}>
                        <Text style={styles.btn}>COMMENCER L'ENREGISTREMENT</Text>
                    </TouchableOpacity>
                )
                
            }

            {
                isRecordingFinished && (
                    <>
                        {!isPlaying && (
                            <TouchableOpacity onPress={playRecording} style={styles.btnWrapper}>
                                <Text style={styles.btn}>LECTURE</Text>
                            </TouchableOpacity>
                            )}
                
                        {isPlaying && !isPaused && (
                            <TouchableOpacity onPress={playRecording} style={styles.btnWrapper}>
                                <Text style={styles.btn}>PAUSE</Text>
                            </TouchableOpacity>
                        )}
                
                            <TouchableOpacity style={styles.btnWrapper} onPress={saveRecording}>
                                <Text style={styles.btn}>SAUVEGARDER</Text>
                            </TouchableOpacity>
                    </>
                )
                    
            }            
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
  });

export default Record;