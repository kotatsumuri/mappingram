import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyBAikhxYv09lHJXAAX-8vdt70ggW3RW7ko",
  authDomain: "mappingram.firebaseapp.com",
  databaseURL: "https://mappingram-default-rtdb.firebaseio.com",
  projectId: "mappingram",
  storageBucket: "mappingram.appspot.com",
  messagingSenderId: "687949004394",
  appId: "1:687949004394:web:196f4485320a7824429413",
  measurementId: "G-KPX3VV8CYK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCa7OSJXJBHDE1KmlTIhJAOOJV5maIlfic",
    libraries: 'places',
    region: 'JP'
  },
  autobindAllEvents: false
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
