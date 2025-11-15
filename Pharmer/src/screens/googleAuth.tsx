import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from "react";
import { View } from "react-native";

GoogleSignin.configure({
    webClientId: '201245250315-ef0o1b88u900q776gcbv257cqdco8339.apps.googleusercontent.com'
});

const GoogleAuth = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>();

    // @ts-ignore
    function handleAuthStateChanged(user) { //ignore ts user error
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
        return subscriber;
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const signInResult = await GoogleSignin.signIn();
            const idToken = signInResult.data?.idToken;

            if (!idToken) {
                throw new Error('Google Sign-In failed: No ID token returned.');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(getAuth(), googleCredential);
            console.log("Successfully signed in with Firebase! User:", userCredential.user.uid);

        } catch (error) {
            console.error("Google Sign-In failed:", error);
        }
    };

    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center"
        }}>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
            />
        </View>
    );
}

// ✅ Minimal addition: named export
export default GoogleAuth;
