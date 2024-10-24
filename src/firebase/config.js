import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // Importar v4 para generar nombres únicos

// Configuración del proyecto de Firebase para Storage
const firebaseConfig = {
  apiKey: "AIzaSyC07UJAW4ghnZJlvxoc3P_0sWFDNEQN1fI",
  authDomain: "pdf-eduzona.firebaseapp.com",
  projectId: "pdf-eduzona",
  storageBucket: "pdf-eduzona.appspot.com",
  messagingSenderId: "805160700521",
  appId: "1:805160700521:web:db29476a854b2c777cb0f8"
};

// Inicializar Firebase con un nombre específico para evitar conflictos
const appStorage = initializeApp(firebaseConfig, "appStorage");

export const storage = getStorage(appStorage);

// Función para subir archivo a una carpeta específica en Firebase Storage
export function uploadFile(file) {
  const uniqueFileName = `${uuidv4()}-${file.name}`; // Generar un nombre único para el archivo usando v4
  const storageRef = ref(storage, `agenda/${uniqueFileName}`); // Especificar la carpeta donde se subirá el archivo

  uploadBytes(storageRef, file).then(snapshot => {
    console.log('Archivo subido exitosamente:', snapshot);
  }).catch(error => {
    console.error('Error al subir el archivo:', error);
  });
}
