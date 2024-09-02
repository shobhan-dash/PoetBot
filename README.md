# PoetBot
**Real-time AI Poetry Generation with Emotion Visualization**

## Installation

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/si-dadi/PoetBot.git
   ```

2. **Install Frontend Dependencies:**  
   - Open a terminal in the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Then run:  
      ```bash
      npm install
      ```

3. **Set Up Backend:**

   - Open a terminal in the `backend` directory:
     ```bash
     cd backend
     ```

   - Create and activate a virtual environment:
     - **Linux/MacOS:**
       ```bash
       python3 -m venv poetbot
       source poetbot/bin/activate
       ```
     - **Windows:**
       ```cmd
       python -m venv poetbot
       poetbot\Scripts\activate
       ```

   - Install required libraries:
     ```bash
     pip install -r requirements.txt
     ```
4. Add Secret Keys
  - Rename the ENV files: Rename `.env.example` file in the root and `backend` dirs to `.env`
  - Add the required secret keys (could be procured from relevant sources)
  - Create a new file `poetbot-firebase-adminsdk.json` in `frontend/src/components/auth` and add your admin SDK keys from firebase (required list of keys provided in `frontend/src/components/auth/firebase-admin-sdk-sample.txt`)

  
## Running the App

1. **Start the Frontend:**  
   ```bash
   npm start
   ```

2. **Start the Backend:**  
   In a terminal within the `backend` directory, activate the virtual environment and run:
   ```bash
   source poetbot/bin/activate  # (Use the Windows command if applicable)
   python3 app.py
   ```