# 👚 ReWear - Community Clothing Exchange Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

ReWear is a full-stack web application designed to promote sustainable fashion by enabling users to exchange unused clothing. It provides a platform for users to list their pre-loved garments and swap them with other community members through direct trades or a point-based redemption system.

This project was built to reduce textile waste and encourage a circular economy for clothing, giving wearable garments a second life.

---

## ✨ Features

-   **User Authentication:** Secure user registration and login system using JWT.
-   **Item Management:** Users can create, upload, and manage listings for their clothing, including multiple images and detailed descriptions.
-   **Direct Swapping:** Initiate direct swap requests with other users, offering one of your available items in exchange.
-   **Points System:**
    -   Each item is assigned a point value by its owner.
    -   Users can redeem items from others using their accumulated points.
-   **Interactive Dashboard:** A personalized dashboard to view listed items, track ongoing swaps, and see the current points balance.
-   **Admin Role:** An admin panel for moderating the platform by approving or rejecting newly listed items.

---

## 🛠️ Tech Stack

This project is a monorepo containing two separate applications: a React frontend and a Node.js backend.

#### **Frontend**
-   **React.js:** A JavaScript library for building user interfaces.
-   **React Router:** For client-side routing and navigation.
-   **Tailwind CSS:** A utility-first CSS framework for modern and responsive styling.
-   **Lucide React:** A beautiful and consistent icon library.

#### **Backend**
-   **Node.js & Express.js:** For building the REST API.
-   **MongoDB & Mongoose:** For the NoSQL database and object data modeling.
-   **JWT (jsonwebtoken):** For generating and verifying authentication tokens.
-   **Bcrypt.js:** For hashing user passwords securely.
-   **Multer:** A middleware for handling file uploads.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
-   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/prapti2385/ReWear.git
    cd ReWear
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Start the server
    npm run dev
    ```
    > The backend will be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Start the client
    npm start
    ```
    > The application will open at `http://localhost:3000`.
