import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  "projectId": "maester-navigator",
  "appId": "1:860076682513:web:f1cfaa0e162534ba67b0b0",
  "databaseURL": "https://maester-navigator-default-rtdb.firebaseio.com",
  "storageBucket": "maester-navigator.appspot.com",
  "apiKey": "AIzaSyDr8rByy09_PtEVNCuhxl9KqsJsG6W8ado",
  "authDomain": "maester-navigator.firebaseapp.com",
  "messagingSenderId": "860076682513"
}

export const firebaseApp = initializeApp(firebaseConfig);