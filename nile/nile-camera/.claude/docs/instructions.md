Project Architecture – Camera Module (React Native)
Module: Camera & Barcode Scanner
Purpose:
Scan ISBN barcodes of textbooks as they are collected.


Prevent duplicate scans.


Confirm scanned books before logging them to the database.


Display book classification (textbook, academic, leisure, or other).



Components
1. Camera Component
Uses react-native-vision-camera for live camera feed.


Integrates barcode scanning to detect ISBNs.


Handles camera permissions automatically.


2. Barcode Scanner Logic
Detects ISBN codes in real-time from the camera feed.


Implements debounce logic to prevent multiple scans of the same book.


Sends scanned ISBNs to the backend API for logging and classification.


3. Confirmation Modal
Displays book details retrieved from the database (title, edition, classification).


Allows users to confirm or reject the scan.


Provides an option for manual barcode input if the barcode is damaged or unreadable.


4. Database Integration
Calls API endpoint to log the book and retrieve classification.


Checks for duplicates before adding a new entry.


Updates quantity if the book already exists in the database.


5. UI Flow
Camera Screen → Scan ISBN → Confirmation Modal → Save to Database → Return to Camera


Dependencies / Tools
react-native-vision-camera – for camera feed.


react-native-reanimated – optional, for animations.


react-native-modal – optional, for confirmation dialogs.


Supabase SDK – for database interaction.



Claude Prompt – Camera Module Code Generation
Prompt:
I am building a hackathon project in React Native. I need the camera module only. The app will scan ISBN barcodes of textbooks and log them to a database.
Requirements for the Camera Module:
Use react-native-vision-camera for the live camera feed.


Scan barcodes (ISBNs) in real-time.


Prevent duplicate scans using debounce logic.


Show a confirmation modal after each scan displaying book information (title, edition, classification) from the database.


Allow manual barcode entry for damaged or unreadable barcodes.


On confirmation, send the ISBN to an API endpoint to log the book.


Return to the camera screen after saving.


Constraints:
Focus only on the camera, scanning, and modal flow.


UI should be minimal but functional.


Assume database API endpoints exist.


Deliverable:
Full React Native component using functional components and hooks.


Include comments explaining each part of the code.


Include placeholder functions for API calls (e.g., saveBookToDatabase(isbn)).


