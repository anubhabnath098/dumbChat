# 💬 Real-Time Chat App

A real-time, full-stack chat application with user authentication, contact list, messaging, image uploads, and responsive mobile view. Built with **React**, **Node.js**, **Socket.io**, **MongoDB**, and **Cloudinary**.

---

## ✨ Features

* ✅ Realtime 1-to-1 messaging
* 🖼️ send images to other
* 🢑 Contact list of all registered users
* 💬 Message history
* 📱 Fully responsive mobile-first design
* 🔐 Authenticated chat experience

---

## 📁 Project Structure

```
/
├── client   # React frontend
└── server   # Express backend with Socket.IO, MongoDB and cloudinary
```

---

## ⚙️ Installation & Setup

### 🖥️ Frontend (Client)

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `client` directory and add:

   ```env
   REACT_APP_HOST=http://localhost:5000
   ```

4. Start the client:

   ```bash
   npm run start
   ```

📍 The client will run on: **[http://localhost:3000](http://localhost:3000)**

---

### 🔧 Backend (Server)

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory and add:

   ```env
   PORT=5000
   MONGO_URL=your_mongo_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

📍 The server will run on: **[http://localhost:5000](http://localhost:5000)**

---

## 🧪 Sample `.env` Configuration

### `client/.env`

```env
REACT_APP_HOST=http://localhost:5000
```

### `server/.env`

```env
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/chatapp
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📸 Screenshots


### 🏠 Welcome Page

![Welcome](screenshots/welcome.png)

---

### 📇 Contacts List

![Contacts](screenshots/contacts.png)

---

### 💬 Chat Interface

![Chats](screenshots/chats.png)

---

### 🖼️ Image Upload Feature

![Image Upload](screenshots/image-upload.png)

---

### 📱 Mobile View

<div align="center">
  <img src="screenshots/mobile1.png" width="30%" />
  <img src="screenshots/mobile2.png" width="30%" />
  <img src="screenshots/mobile3.png" width="30%" />
</div>

---

## 💠 Tech Stack

* **Frontend:** React, Styled-Components
* **Backend:** Node.js, Express.js, Socket.IO
* **Database:** MongoDB (Mongoose)
* **File Hosting:** Cloudinary
* **Authentication:** Simple password authentication

