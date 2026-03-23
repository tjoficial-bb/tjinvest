import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { AuketScraper } from './scrapers/auket';
import { SaraivaScraper } from './scrapers/saraiva';

if (!getApps().length) {
  initializeApp({ projectId: firebaseConfig.projectId });
}
const db = getFirestore();
if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
  db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
}

async function run() {
  const snapshot = await db.collection('imoveis').limit(1).get();
  if (snapshot.empty) {
    console.log('No properties found');
    return;
  }
  const url = snapshot.docs[0].data().link_original;
  console.log('Testing URL:', url);
  
  let scraper;
  if (url.includes('auket.com.br')) {
    scraper = new AuketScraper();
  } else {
    scraper = new SaraivaScraper();
  }
  const result = await scraper.scrape(url);
  console.log('Result:', JSON.stringify(result, null, 2));
}
run();
