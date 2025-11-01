😂 Dad Jokes App

A simple React Native app built with Expo that fetches random dad jokes from a public API.

📱 Features

Fetches a new random dad joke with a single tap

Simple, minimal UI

Uses the icanhazdadjoke API

Built with TypeScript and Expo Router

🧩 Tech Stack

React Native (Expo)

TypeScript

Fetch API

Expo Router

🚀 Setup

Clone this repo:

git clone <repo-url>
cd DadJokesApp


Install dependencies:

npm install


Start the project:

npx expo start


Run on Expo Go or an Android/iOS emulator.

🌐 API

The app fetches jokes from:

https://icanhazdadjoke.com/


Make sure to include this in your fetch request’s headers:

fetch("https://icanhazdadjoke.com/", {
  headers: { Accept: "application/json" },
});

🧠 Future Improvements

Add “Favorite” jokes feature

Offline support

Themed UI