# Realtime, Web RTC Text and Video Chat

This is a simple web application that allows users to chat with each other in real time.
The application uses Web RTC to establish a peer-to-peer connection between users. Users can send text messages and share their video feed with each other.

# Important

- Please replace the SERVICE_ID and OWNER_ID in the `public/script.js` file with your own values.
You can get these values by signing up, and creating your own service on [Skapi](https://www.skapi.com).

- Web RTC requires a secure connection (HTTPS) to work. Host the application in a secure environment and use the basic node server provided as a dependency to run the application.

# How to run

Install 
```
npm i
```

Run
```
npx bns 3000
```

Open the application in your browser at `https://localhost:3000`