// Import the only functions from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getMessaging ,isSupported,getToken ,onMessage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// for local testing
// const firebaseConfig = {
//     apiKey: "AIzaSyDY8Qs5fNGfRM_XsUcmCgLsEEda13v5uQY",
//     authDomain: "sst-push-notifications-test.firebaseapp.com",
//     projectId: "sst-push-notifications-test",
//     storageBucket: "sst-push-notifications-test.appspot.com",
//     messagingSenderId: "454267449115",
//     appId: "1:454267449115:web:4e76ef0cffe3dd7637edbe",
//     measurementId: "G-3TRPCMTZBS"
// };
const firebaseConfig = {
    apiKey: "AIzaSyA5z5FS7U50eI5S3-H9jRM6g1fYzG0S8Vk",
    authDomain: "smallseotools-1470394573010.firebaseapp.com",
    databaseURL: "https://smallseotools-1470394573010.firebaseio.com",
    projectId: "smallseotools-1470394573010",
    storageBucket: "smallseotools-1470394573010.appspot.com",
    messagingSenderId: "543959747848",
    appId: "1:543959747848:web:83f221c4a7b29c76c1f0bd"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging();
setTimeout(function(){
    function isTokenSaved() {
        return window.localStorage.getItem('fcmTokenSST') == 1;
    }
    if(isSupported()){ //check if notifcations supported by browser
        if(!isTokenSaved()){
            // getToken(messaging, { vapidKey: 'BLS1VsMMhpFJNiWurGN9qmkkS63dm9gjVhabdd7dKpHRsIsKu16K441c3SBmBiiyU_JkA7_JU977rySEAcW4nIQ' })
            getToken(messaging, { vapidKey: 'BD63BuwrjVY0fkIa646mXTNGt1JlZBvj_fgTpe2EwSWV3vvJr_XAzp98YjKVB3R-qm00ElKJS1vpGbQNXluKtQM' })
            .then((currentToken) => {
                if (currentToken) {
                    saveToken(currentToken);  // Send the token to your server and update the UI 
                } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                updateSubscriptionStatus(false);
            });        
        }
    }
    
    function saveToken(currentToken) {
        $.ajax({
            url: base_url+'save-fcm-token/',
            type: 'POST',
            data: {
                device_token: currentToken
            },
            dataType: 'JSON',
            success: function (response) {
                if(response.status == 'success'){
                    updateSubscriptionStatus(true)
                }else{
                    updateSubscriptionStatus(false)
                }
            },
            error: function (err) {
                updateSubscriptionStatus(false);
            }
        });
    }
    function updateSubscriptionStatus(status) {
        window.localStorage.setItem('fcmTokenSST', status ? 1 : 0);
    }
    // once message receives show it 
    onMessage(messaging, (payload) => {
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: payload.data.body,
            tag : ''+payload.data.tag+'',
            icon: payload.data.icon,
            requireInteraction: true
        };
        var notification = new Notification(notificationTitle,notificationOptions);
       
        notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            var theLink = payload.data.link;
            if(theLink){
                window.open(theLink, '_blank');
            }
            notification.close();
        }
    });
},5000);
