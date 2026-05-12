import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseAdmin: admin.app.App | null = null;

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'))
  : null;

if (serviceAccount) {
  try {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
} else {
  console.warn('Warning: FIREBASE_SERVICE_ACCOUNT_KEY not found. Auth middleware will not work.');
}

export const getAuth = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT_KEY.');
  }
  return firebaseAdmin.auth();
};

export default admin;
