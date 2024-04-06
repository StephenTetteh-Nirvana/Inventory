import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCvyYk0-miBG9nRmZrsXzgP_Swi2OWdtYg",
  authDomain: "inventory-management-84ee3.firebaseapp.com",
  projectId: "inventory-management-84ee3",
  storageBucket: "inventory-management-84ee3.appspot.com",
  messagingSenderId: "799658810823",
  appId: "1:799658810823:web:ddd3728ae8bcdfa1d24de2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {
    auth,
    db,
    storage
}