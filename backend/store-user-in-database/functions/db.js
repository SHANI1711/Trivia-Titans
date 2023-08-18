const firebase = require('firebase');
require('firebase/app');

require('firebase/firestore');

//Firbase database configuration to fetch and store data in given collection
const firebaseConfig = {
	//credentials here
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userCollection = db.collection('user-data');

module.exports = { userCollection };
