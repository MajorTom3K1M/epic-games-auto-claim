# Epic Games Auto Claim

**Note:** *This project is no longer functional due to API and security changes implemented by Epic Games.*

![Logo](client/src/images/epic-auto-claim.png)

## Overview

Epic Games Auto Claim is a web application that automatically claims free games from the Epic Games Store on your behalf. By logging in with your Epic Games account, the application periodically checks for new free games and adds them to your library, ensuring you never miss out on any giveaways.

## Features

- **Automated Claims:** Automatically claim free games as they become available.
- **User Authentication:** Secure login using your Epic Games credentials.
- **Periodic Checks:** Uses cron jobs to routinely check for new free game offers.
- **User-Friendly Interface:** Built with React for a smooth and responsive frontend experience.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Scheduling:** Cron jobs for periodic tasks
- **API Interaction:** Epic Games API (deprecated and no longer fully accessible)

## Screenshots

![Login Page](screenshots/screenshot-1.png)
*Login page where users authenticate with their Epic Games account.*

![Dashboard](screenshots/screenshot-2.png)
*User dashboard showing the status of game claims.*

## Installation

*Note: Due to the deprecation of the necessary Epic Games APIs, the installation steps are provided for historical reference only.*

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MajorTom3K1M/epic-games-auto-claim.git
   ```
2. **Navigate to the Project Directory**
   ```bash
   cd epic-games-auto-claim
   ```
3. **Install Backend Dependencies**
   ```bash
   npm install
   ```
4. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```
5. **Run the Application**
   - **Backend**
     ```bash
     cd ..
     npm start
     ```
   - **Frontend**
     ```bash
     cd client
     npm start
     ```