// googleAuthFunc.ts
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '201245250315-ef0o1b88u900q776gcbv257cqdco8339.apps.googleusercontent.com',
}); 

export const GoogleAuth = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) throw new Error('No ID token returned.');
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(getAuth(), credential);

    console.log('Signed in:', userCredential.user.uid);
  } catch (err) {
    console.error(err);
  }
};
