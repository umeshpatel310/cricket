// Declare userId in a higher scope
let userId;

// Firebase configuration and imports remain the same
const firebaseConfig = {
    apiKey: "AIzaSyBy1GnNAIpiTbF8bcE960GROx9JVyyn3Ro",
    authDomain: "testapp-6bd8a.firebaseapp.com",
    databaseURL: "https://testapp-6bd8a-default-rtdb.firebaseio.com",
    projectId: "testapp-6bd8a",
    storageBucket: "testapp-6bd8a.appspot.com",
    messagingSenderId: "1083835564982",
    appId: "1:1083835564982:web:7ef2ecfe620f7f81d43717",
};

// Importing Firebase services (modular approach)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;  // Set userId if the user is logged in
    } else {
        alert("Please log in to continue.");
        window.location.href = "login.html";
    }
});

// Define the uploadImages function
async function uploadImages() {
    if (!userId) {
        alert("User not authenticated. Please log in first.");
        return;
    }

    const matchName = document.getElementById('matchName').value;  // Get match name from input field
    const fileInput1 = document.getElementById('imageInput1');
    const fileInput2 = document.getElementById('imageInput2');

    const file1 = fileInput1.files[0];
    const file2 = fileInput2.files[0];

    if (!file1 || !file2) {
        alert("Please select two images to upload.");
        return;
    }

    if (!matchName) {
        alert("Please enter a match name.");
        return;
    }

    try {
        // Show the uploading notification
        document.getElementById('uploadingNotification').style.display = 'block';

        // Get progress bars
        const progressBar1 = document.getElementById('progressBar1');
        const progressBar2 = document.getElementById('progressBar2');

        // Upload first image with progress
        const storageRef1 = storageRef(storage, `cricket-match-images/${file1.name}`);
        const uploadTask1 = uploadBytesResumable(storageRef1, file1);

        uploadTask1.on('state_changed', (snapshot) => {
            const progress1 = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar1.value = progress1;
        });

        await uploadTask1;
        const downloadURL1 = await getDownloadURL(uploadTask1.snapshot.ref);

        // Upload second image with progress
        const storageRef2 = storageRef(storage, `cricket-match-images/${file2.name}`);
        const uploadTask2 = uploadBytesResumable(storageRef2, file2);

        uploadTask2.on('state_changed', (snapshot) => {
            const progress2 = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar2.value = progress2;
        });

        await uploadTask2;
        const downloadURL2 = await getDownloadURL(uploadTask2.snapshot.ref);

        // Save URLs in Firebase Realtime Database under match name
        const matchRef = ref(database, `cricketmatch/${userId}/${matchName}/currentOver/`);
        await update(matchRef, {
            img1: downloadURL1,
            img2: downloadURL2
        });

        console.log("Images uploaded successfully!");
        displayUploadedImages(downloadURL1, downloadURL2);

        // Hide the uploading notification once upload is complete
        document.getElementById('uploadingNotification').style.display = 'none';

    } catch (error) {
        console.error("Error uploading images:", error);

        // In case of error, hide the uploading notification and show an error message
        document.getElementById('uploadingNotification').style.display = 'none';
        alert("Error uploading images. Please try again.");
    }
}

// Function to display uploaded images on the page
function displayUploadedImages(url1, url2) {
    const uploadedImage1 = document.getElementById('uploadedImage1');
    const uploadedImage2 = document.getElementById('uploadedImage2');

    uploadedImage1.src = url1;
    uploadedImage2.src = url2;

    uploadedImage1.style.display = 'block';
    uploadedImage2.style.display = 'block';
}

// Add event listener to the button
document.getElementById('uploadButton').addEventListener('click', uploadImages);
