
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBDZZIFayKJ9T2eZja8s3QLrYOK1-Spr3U",
  authDomain: "prueba-tecnica-11-02.firebaseapp.com",
  projectId: "prueba-tecnica-11-02",
  storageBucket: "prueba-tecnica-11-02.appspot.com",
  messagingSenderId: "760760916139",
  appId: "1:760760916139:web:69a60987972eef5d4e3fee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {
  app,
  db
}