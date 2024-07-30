importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js')

    // Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC8R9fJFmjp0JtpRUQl3hrIhzGtiDc_sl8",
    authDomain: "s198app.firebaseapp.com",
    databaseURL: "https://s198app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "s198app",
    storageBucket: "s198app.appspot.com",
    messagingSenderId: "782505244414",
    appId: "1:782505244414:web:2b036b36bbcb9b9d9d97af",
    measurementId: "G-1HX7FEWFB3"
  });    
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  console.log(payload);
  // Customize notification here
  const notificationTitle = payload?.notification?.title || payload?.data?.title || 'Background Message Title';
  const notificationOptions = {
    body:  payload?.notification?.body  || payload?.data?.subtitle  || 'Background Message body.',
    icon: '/assets/images/logo/logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});