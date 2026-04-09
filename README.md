# 🔐 Authentication System

A secure and scalable **Authentication System** built using modern backend technologies. This project implements user registration, login, and session management using **JWT (JSON Web Tokens)**.

---

## 🚀 Features

* User Registration with encrypted password
* Secure Login system
* JWT-based Authentication (Access + Refresh Tokens)
* Session Management with database storage
* Logout functionality (single session / all sessions)
* Password hashing using SHA-256
* Middleware-based route protection

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (Access & Refresh Tokens)
* **Security:** Crypto (SHA-256 hashing)

---

## 📂 Project Structure

```
├── controllers/
├── models/
├── routes/
├── config/
├── app.js / server.js
```

---

## ⚙️ Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/ashwanikumar107/Authentication.git
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

4. Run the server:

```bash
npm run dev
```

---

## 🔑 API Endpoints

### ➤ Register

```
POST /api/auth/Practice/register
```

### ➤ Login

```
POST /api/auth/Practice/login
```

### ➤ Logout

```
POST /api/auth/Practice/logout
```

---

## 🔐 Security Features

* Password hashing before storing in DB
* Refresh token stored as hashed value
* Token expiration handling
* Secure session tracking (IP + User Agent)

---

## 📌 Future Improvements

* OAuth (Google/GitHub login)
* Email verification
* Password reset functionality
* Role-based authorization

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## ⭐ Acknowledgment

If you found this project helpful, consider giving it a ⭐ on GitHub!

---
