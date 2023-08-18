const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
	projectId: 'serverless-kova',
	keyFilename: 'example.json',
});

async function quickstartAddData(db) {
	// [START firestore_setup_dataset_pt1]
	const docRef = db.collection('users').doc('alovelace');

	await docRef.set({
		first: 'Ada',
		last: 'Lovelace',
		born: 1815,
	});
	// [END firestore_setup_dataset_pt1]

	// [START firestore_setup_dataset_pt2]
	const aTuringRef = db.collection('users').doc('aturing');

	await aTuringRef.set({
		first: 'Alan',
		middle: 'Mathison',
		last: 'Turing',
		born: 1912,
	});
	// [END firestore_setup_dataset_pt2]
}
quickstartAddData(db);
