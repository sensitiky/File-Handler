## File Upload Application with Vercel Blob Storage
### This project is a web application built with Next.js that allows users to upload files to Vercel Blob Storage, manage the uploaded files, and persist the state across sessions. The application includes features such as file renaming, deletion, and displaying a list of uploaded files with options to download them. Additionally, it integrates with a third-party API at various stages of the upload process.

## Features
1. File Upload: Users can upload files to Vercel Blob Storage. The application ensures that files larger than 5MB are not uploaded.
2. Third-Party API Calls: The application makes calls to a third-party API at the start, success, and failure stages of the upload process.
3. File Management: Users can rename or delete uploaded files. The UI includes a modal for renaming files and ensures actions are reflected in the stored state.
4. State Persistence: The application uses local storage to persist the state of uploaded files, ensuring the data remains available across page reloads.
5. Loading Skeleton: A loading skeleton is displayed while the list of files is being retrieved or loaded.
6. Error Handling: The application includes error boundaries to manage and display errors gracefully.

## Technologies Used
* Next.js: A React framework for building server-side rendered applications.
* Vercel Blob Storage: A cloud storage solution provided by Vercel for storing and serving files.
* React: A JavaScript library for building user interfaces.
* Radix UI: A library of UI components.
* Formidable: A Node.js library for parsing form data, especially file uploads.
* TypeScript: A superset of JavaScript that adds static typing to the language.

## Setup Instructions
### Prerequisites

* Node.js (version 14 or higher recommended)
* NPM or Yarn package manager
* Vercel account (for deploying and managing Vercel Blob Storage)
#### Installation
1. Clone the Repository

```
git clone https://github.com/yourusername/file-upload-app.git
cd file-upload-app
```

2. Install Dependencies

```
npm install
# or
yarn install
```
3. Environment Variables
Create a .env.local file in the root directory and add the following environment variables:

```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
Replace your_vercel_blob_read_write_token with your actual token from Vercel.
```

### Running the Application

To start the development server:

```
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

### File Structure
* /pages: Contains the Next.js pages.
* /api/upload.ts: API route for handling file uploads.
* /components: Contains the React components.
* FileUpload.tsx: Main component for file upload functionality.
* /ui: Contains UI components such as Input, Skeleton, etc.
* /hooks: Contains custom React hooks.
* usePersistedState.ts: Hook for persisting state using local storage.
* /styles: Contains global styles and component-specific styles.

### Detailed Explanation
#### File Upload Process
1. Selecting a File: The user selects a file using an HTML file input. The selected file is stored in the component's state.
2. File Size Check: Before uploading, the application checks if the file size exceeds 5MB. If it does, a modal is displayed, and the upload is prevented.
3. Uploading the File: The file is sent to the /api/upload API route using a PUT request. This API route:
    * Parses the incoming form data using formidable.
    * Uses the Vercel Blob SDK to upload the file to Vercel Blob Storage.
    * Calls the third-party API (example.com) to indicate the start and end of the upload process.
4. Updating State: On successful upload, the file URL is added to the list of uploaded files in the local storage and component state.

### File Management
* Renaming Files: Users can rename files by clicking the pencil icon next to a file. A modal with an input field allows them to enter a new name. The application then updates the file name in Vercel Blob Storage and reflects the change in the state.
* Deleting Files: Users can delete files by clicking the trash icon next to a file. The file is deleted from Vercel Blob Storage and removed from the state.

### State Persistence
The application uses a custom hook, usePersistedState, to manage state persistence. This hook saves the state to local storage whenever it changes, ensuring that the state is preserved across page reloads.

### Error Handling
The application includes error handling mechanisms to catch and display errors. Errors are logged to the console, and user-friendly messages are shown in the UI.

### Deploying to Vercel
To deploy the application to Vercel, follow these steps:

1. Connect to Vercel: Link your GitHub repository to Vercel.
2. Set Environment Variables: In the Vercel dashboard, set the BLOB_READ_WRITE_TOKEN environment variable.
3. Deploy: Initiate the deployment from the Vercel dashboard.
For more detailed instructions, refer to the Vercel Deployment Guide.

### License
This project is licensed under the MIT License.