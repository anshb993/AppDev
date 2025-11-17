⚕️ Mobile Pharmacy App:
Fast, responsive React Native app for ordering essential medications, integrating Firebase/Google Sign-In for authentication and persistence.

✨ Key Features:
Browsing & Cart: View medications, utilize horizontal scrolling, and manage cart items.
Security: Google Sign-In via Firebase for secure user authentication.
Guest Restriction: Guests can browse, but must log in via the Profile tab to enable cart functionality.

🛠️ Setup and Configuration:
Prerequisites: Requires Node.js, Expo CLI, and a Firebase Project configuration.
Installation: Clone the repository and install dependencies using npm install (or yarn install).
Configure Auth: The webClientId in src/auth/googleAuthFunc.ts must be updated to match your Firebase Web OAuth 2.0 Client ID.

// src/auth/googleAuthFunc.ts
GoogleSignin.configure({
  webClientId: '201245250315-ef0o1b88u900q776gcbv257cqdco8339.apps.googleusercontent.com',
}); 

▶️ Running the Application:
To start the development server, run expo start. The application uses a two-tab bottom navigator for Home and Profile screens. The core security logic in HomeScreen.tsx checks the isLoggedIn state and redirects unauthenticated users to sign in.
You can run the app on:
iOS Simulator
Android Emulator
Web Browser

Setup and Installation:

1. Install Dependencies
Clone the repository and install the necessary dependencies:

npm install
# or
yarn install

2. Configure Google Sign-In
The application uses Google Sign-In with Firebase Authentication. You must configure the webClientId to match your Google Cloud/Firebase setup.
In the file googleAuthFunc.ts, the following webClientId is configured. This ID must correspond to your Web type OAuth 2.0 Client ID generated in your Google Cloud Console/Firebase settings.

// src/auth/googleAuthFunc.ts
GoogleSignin.configure({
  webClientId: '201245250315-ef0o1b88u900q776gcbv257cqdco8339.apps.googleusercontent.com',
}); 

Note: For iOS and Android builds, you may also need to configure the iosClientId and androidClientId in the GoogleSignin.configure block, and perform additional setup steps specific to the platform (e.g., setting up google-services.json or GoogleService-Info.plist).

3. File Structure Summary
File Path
Description

src/screens/HomeScreen.tsx
Main screen, displays products, implements the guest restriction logic, and uses the useAuth hook.

src/HomeScreen/profileScreen.tsx
Placeholder screen for user profile and settings (part of the new tab bar).

src/navigation/RootNavigator.tsx
Defines the new Home and Profile bottom tab navigation structure.

src/screens/googlefuckery.ts
Contains the GoogleAuth function for initiating Firebase sign-in using Google's ID token.

src/cart/contents.tsx
(Assumed) Context/hook for managing the shopping cart state.

▶️ Running the Application
To start the Expo development server, run the following command:

expo start