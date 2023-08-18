const firebase = require('firebase');
require('firebase/app');
require('firebase/firestore');

//Firebase configuration
const firebaseConfig = {
	//Credentials will be here
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const mfaAnswerCollection = db.collection('mfa-question-answers');

module.exports = { mfaAnswerCollection };
