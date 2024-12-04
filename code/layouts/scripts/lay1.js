 
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBy1GnNAIpiTbF8bcE960GROx9JVyyn3Ro",
    authDomain: "testapp-6bd8a.firebaseapp.com",
    databaseURL: "https://testapp-6bd8a-default-rtdb.firebaseio.com",
    projectId: "testapp-6bd8a",
    storageBucket: "testapp-6bd8a.appspot.com",
    messagingSenderId: "1083835564982",
    appId: "1:1083835564982:web:7ef2ecfe620f7f81d43717",
};

// Import Firebase SDK (Modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getDatabase, ref, set,get, update ,remove,onValue } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

let userId = null;

   
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        matchId: urlParams.get('matchId')  // Extract matchId from URL
    };
}

// Once the page loads, extract matchId and set it to the input field
window.onload = function() {
    const params = getQueryParams();
    const matchId = params.matchId;

    // Set the matchId as the value of the matchNameInput field
    if (matchId) {
        document.getElementById('matchNameInput').value = matchId;
    }
};

let matchId = new URLSearchParams(window.location.search).get('matchId'); // Get matchId from URL

// On authentication state change, check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        monitorPlyarchange();
    } else {
        alert("Please log in to continue.");
        window.location.href = "login.html";
    }
});

function monitorPlyarchange() {
   
    const cricketMatchRef = ref(database, `cricketmatch/${userId}/${matchId}/Action/Plyarchange`);
    
    // Listen for changes to the Plyarchange value
    onValue(cricketMatchRef, (snapshot) => {
        const plyarchange = snapshot.val();
        console.log("Plyarchange value:", plyarchange);  // Log the value to ensure it's being retrieved
        
        // Toggle visibility based on the value of Plyarchange
        if (plyarchange === true) {
            // If Plyarchange is true, show .scoreA and hide .score
            document.querySelector('.scoreC').style.display = 'block';
            document.querySelector('.scoreD').style.display = 'none';
        } else if (plyarchange === false) {
            // If Plyarchange is false, show .score and hide .scoreA
            document.querySelector('.scoreD').style.display = 'block';
            document.querySelector('.scoreC').style.display = 'none';
        } else {
            console.log("Unexpected value for Plyarchange:", plyarchange);
        }
    });
}

const currentOverRef = ref(database, `cricketmatch/${userId}/${matchId}/thisover`);

     
onValue(currentOverRef, (snapshot) => {
    const data = snapshot.val();  // Get the data from Firebase

    // Get the container div where we will display the data
    const currentOverDiv = document.getElementById('Ccurrentoverr');
    currentOverDiv.innerHTML = '';  // Clear previous content

    // Iterate over the match ids in the currentover node
    if (data) {
        for (const matchId in data) {
            const matchData = data[matchId]; // This contains the over data for each match

            // Create a div for each match
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.innerHTML = '';  // Display match ID

            // Iterate over the over data for each match and display
            for (const overId in matchData) {
                const overData = matchData[overId];

                // Create a div for each over data (ball-shaped)
                const overDiv = document.createElement('div');
                overDiv.classList.add('over');
                overDiv.innerText = `${overData}`;  // You can display over number or any info here

                // Log the overData to see what value it holds
                console.log("Over Data:", overData);

                // Logic for background color change and image visibility
                if (overData == 6) {
                   
                    document.getElementById('six-image').style.display = "inline-block";  // Show the image
                    
                    // Remove and re-add the animation class to restart the animation
                    const sixImage = document.getElementById('six-image');
                    sixImage.classList.remove('six-animation');
                    // Force reflow by accessing the offsetHeight property before adding class again
                    sixImage.offsetHeight;  // Trigger reflow
                    sixImage.classList.add('six-animation');
                } else {
                    document.getElementById('six-image').style.display = "none";  // Hide the image
                    document.getElementById('six-image').classList.remove('six-animation'); // Remove animation if not 6
                } 
                  

                   // Logic for 4  image visibility
                if (overData == 4) {
                   
                   document.getElementById('four-image').style.display = "inline-block";  // Show the image
                   
                   // Remove and re-add the animation class to restart the animation
                   const sixImage = document.getElementById('four-image');
                   sixImage.classList.remove('four-animation');
                   // Force reflow by accessing the offsetHeight property before adding class again
                   sixImage.offsetHeight;  // Trigger reflow
                   sixImage.classList.add('four-animation');
               } else {
                   document.getElementById('four-image').style.display = "none";  // Hide the image
                   document.getElementById('four-image').classList.remove('four-animation'); // Remove animation if not 6
               }


                    // Logic for W  image visibility
                    if (overData.trim().toUpperCase() === "W") {
                   
                   document.getElementById('out-image').style.display = "inline-block";  // Show the image
                   
                   // Remove and re-add the animation class to restart the animation
                   const sixImage = document.getElementById('out-image');
                   sixImage.classList.remove('out-animation');
                   // Force reflow by accessing the offsetHeight property before adding class again
                   sixImage.offsetHeight;  // Trigger reflow
                   sixImage.classList.add('out-animation');
               } else {
                   document.getElementById('out-image').style.display = "none";  // Hide the image
                   document.getElementById('out-image').classList.remove('out-animation'); // Remove animation if not 6
               }

                // Logic for other values of overData
                if(overData == 6){
                    overDiv.style.backgroundColor = "rgb(186, 7, 240)";  // If value is 6, set background to purple
                }
                 else if (overData == 4) {
                    overDiv.style.backgroundColor = "blue";  // If value is 4, set background to blue
                } else if (overData.trim().toUpperCase() === "W") {  // Check if the value is exactly "W" (case-insensitive)
                    overDiv.style.backgroundColor = "red";  // If value is "W", set background to red
                } else {
                    overDiv.style.backgroundColor = "rgb(26, 25, 25)";  // Default color for other values
                }

                // Append each over div to the match div
                matchDiv.appendChild(overDiv);
            }

            // Append the match div to the main currentOver div
            currentOverDiv.appendChild(matchDiv);
        }
    } else {
        currentOverDiv.innerText = "No ";
    }
});



function updateText(elementId, value) {
    const element = document.getElementById(elementId);

    // Check if the element exists in the DOM
    if (element) {
        element.innerText = value || 'No Data';
    } else {
        console.warn(`Element with id "${elementId}" not found`);
    }
}

// Function to truncate name to first 3 characters and append '...' if required
function truncateName(name) {
    if (name && name.length > 3) {
        return name.substring(0, 3);  // First 3 characters + '...'
    }
    return name || 'No Data';  // If name is less than or equal to 3 characters, return as is
}


const cricketMatchRef = ref(database, `cricketmatch/K8Rq4bHb8sNegkOg51jGI59sjnD2/salar/currentOver`);

onValue(cricketMatchRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
        console.error("No data found or the path does not exist.");
        return; 
    }

    try {
        // Updating elements with data from Firebase
        updateText('Cbtname', truncateName(data.batingteam)); // Truncate batingteam name
        updateText('Cstbastman', data.bestman1);
        updateText('Cfirstbtrun', data.run1);
        updateText('Cfirstbtbowl', data.ball1);
        updateText('Csecbastman', data.bestman2);
        updateText('Csecbtrun', data.run2);
        updateText('Csecbtbwll', data.ball2);
        updateText('CstbastmanA', data.bestman1);
        updateText('CfirstbtrunA', data.run1);
        updateText('CfirstbtbowlA', data.ball1);
        updateText('CsecbastmanB', data.bestman2);
        updateText('CsecbtrunB', data.run2);
        updateText('CsecbtbwllB', data.ball2);
        updateText('Ctotlrun', data.totalScore);
        updateText('Ctovers', data.totalOvers);
        updateText('Cbwlrname', data.name);
        updateText('Crun', data.runsBowler);
        updateText('Cbowlovers', data.ballsBowler);

        // Fetch image URLs from Firebase Storage and update the image elements
        const team1FlagUrl = data.img1 || '';
        const team2FlagUrl = data.img2 || '';

        if (team1FlagUrl) {
            document.getElementById('Cteam1Flag').src = team1FlagUrl;
        }

        if (team2FlagUrl) {
            document.getElementById('Cteam2Flag').src = team2FlagUrl;
        }
    } catch (error) {
        console.error("Error processing data: ", error);
    }
}, (error) => {
    console.error("Error fetching data from Firebase: ", error);
});

// Helper function to update text content in DOM
function updateText(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value !== undefined && value !== null) {
        element.textContent = value;
    } else {
        console.warn(`Element with ID ${elementId} is missing or value is undefined.`);
    }
}

// Helper function to truncate long names (e.g., team names)
function truncateName(name) {
    return name && name.length > 15 ? name.substring(0, 15) + '...' : name;
}