 
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
    } else {
        alert("Please log in to continue.");
        window.location.href = "login.html";
    }
});

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const tossButton = document.getElementById("tossButton");
    const optionButton = document.getElementById("optionButton");
    const optionContainer = document.getElementById("optionContainer");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const winTeamInput = document.getElementById("winTeam");
    const chooseTeamInput = document.getElementById("chooseTeam");
    const updateButton = document.getElementById("updateButton");
    const closeTossButton = document.getElementById("closeTossButton");
    const scoreboardButton = document.getElementById("scoreboardC");
    const scoreboardButtonB = document.getElementById("scoreboardB");
    const plyermgsbutton = document.getElementById("plyerimgS");

    // Function to update toss status in Firebase
    const updateTossStatus = (status) => {
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const tossRef = ref(database, `cricketmatch/${userId}/${matchId}/Action/Toss`);

        set(tossRef, status).then(() => {
            console.log(`Toss status updated to ${status}`);
        }).catch((error) => {
            console.error("Error updating toss status: ", error);
        });
    };

    // Function to update the win and choose team in Firebase
    const updateTeamsInFirebase = () => {
        const winTeam = winTeamInput.value.trim();
        const chooseTeam = chooseTeamInput.value.trim();

        if (!winTeam || !chooseTeam) {
            alert("Please fill out both fields.");
            return;
        }

        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const matchInfoRef = ref(database, `cricketmatch/${userId}/${matchId}/matchinfo`);

        // Only update win and choose fields, not resetting other child data
        update(matchInfoRef, {
            win: winTeam,
            choose: chooseTeam
        }).then(() => {
            console.log("Toss details updated in Firebase.");
            closePopup(); // Close popup after update
        }).catch((error) => {
            console.error("Error saving toss details: ", error);
        });
    };

      // Function to update the scoreboard status in Firebase
      const updateScoreboardStatus = (status) => {
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const scoreboardRef = ref(database, `cricketmatch/${userId}/${matchId}/Action/score`);

        set(scoreboardRef, status).then(() => {
            console.log(`Scoreboard status updated to ${status}`);
        }).catch((error) => {
            console.error("Error updating scoreboard status: ", error);
        });
    };

      // Function to toggle the scoreboard button status
      const toggleScoreboardButton = () => {
        const currentStatus = scoreboardButton.textContent === "Scoreboard Show";

        // Update Firebase scoreboard status
        updateScoreboardStatus(currentStatus);

        // Toggle the button text
        scoreboardButton.textContent = currentStatus ? "Scoreboard Close" : "Scoreboard Show";
    };

    const updateScoreboardBStatus = (status) => {
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const scoreboardRef = ref(database, `cricketmatch/${userId}/${matchId}/Action/scoreB`);

        set(scoreboardRef, status).then(() => {
            console.log(`Scoreboard status updated to ${status}`);
        }).catch((error) => {
            console.error("Error updating scoreboard status: ", error);
        });
    };

      // Function to toggle the scoreboard button status
      const toggleScoreboardBButton = () => {
        const currentStatus = scoreboardButtonB.textContent === "Team B Scorebord Show";

        // Update Firebase scoreboard status
        updateScoreboardBStatus(currentStatus);

        // Toggle the button text
        scoreboardButtonB.textContent = currentStatus ? "Scoreboard Close" : "Team B Scorebord Show";
    };

    
      // Function to update the scoreboard status in Firebase
      const updateplyerimgStatus = (status) => {
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const scoreboardRef = ref(database, `cricketmatch/${userId}/${matchId}/Action/scrimg`);

        set(scoreboardRef, status).then(() => {
            console.log(`Scoreboard status updated to ${status}`);
        }).catch((error) => {
            console.error("Error updating scoreboard status: ", error);
        });
    };

    
      // Function to toggle the scoreboard button status
      const toggleplyearimgButton = () => {
        const currentStatus = plyermgsbutton.textContent === "Team Show";

        // Update Firebase scoreboard status
        updateplyerimgStatus(currentStatus);

        // Toggle the button text
        plyermgsbutton.textContent = currentStatus ? "Team Close" : "Team Show";
    };


    // Function to toggle the visibility of option container buttons
    const toggleOptionContainer = () => {
        const buttons = optionContainer.querySelectorAll("button");
        const isVisible = buttons[0].style.display !== "none"; // Check if buttons are currently visible

        // Toggle visibility of buttons inside the option container
        buttons.forEach(button => {
            button.style.display = isVisible ? "none" : "inline-block";
        });

        // Change text of Option button to reflect current state
        optionButton.textContent = isVisible ? "Show Options" : "Close Options";
    };

    // Toggle the visibility of buttons inside the option container
    optionButton.addEventListener("click", toggleOptionContainer);

    // Show popup when Toss button is clicked
    tossButton.addEventListener("click", () => {
        updateTossStatus(true);  // Update toss status to true
        showPopup();  // Show the popup for win and choose team inputs
    });

    // Update button to save win and choose team
    updateButton.addEventListener("click", () => {
        updateTeamsInFirebase();  // Save data to Firebase
    });

    // Close toss button to set toss to false and close the popup
    closeTossButton.addEventListener("click", () => {
        updateTossStatus(false);  // Update toss status to false
        closePopup();  // Close the popup
    });

      // Toggle scoreboard button functionality
      scoreboardButton.addEventListener("click", toggleScoreboardButton);

       // Toggle scoreboard button functionality
       plyermgsbutton.addEventListener("click", toggleplyearimgButton);
       scoreboardButtonB.addEventListener("click", toggleScoreboardBButton);

    // Function to show the popup
    const showPopup = () => {
        popup.style.display = "block";
        overlay.style.display = "block";
    };

    // Function to close the popup
    const closePopup = () => {
        popup.style.display = "none";
        overlay.style.display = "none";
    };
});


  // Wait for the DOM to be fully loaded before executing the script
  document.addEventListener('DOMContentLoaded', () => {
    // References to the checkboxes
    const checkbox1 = document.getElementById("checkboxPlayer1");
    const checkbox2 = document.getElementById("checkboxPlayer2");

    // Ensure checkboxes exist
    if (!checkbox1 || !checkbox2) {
        console.error("Checkboxes are missing!");
        return;
    }

    // Function to update the checkbox state in Firebase
    const updateCheckboxStatus = () => {
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const plyarchangeRef = ref(database, `cricketmatch/${userId}/${matchId}/Action/Plyarchange`);

        // If checkbox1 is checked, save true in Firebase
        if (checkbox1.checked) {
            set(plyarchangeRef, true).then(() => {
                console.log("Plyarchange status set to true (Checkbox 1 checked).");
            }).catch((error) => {
                console.error("Error saving plyarchange status: ", error);
            });
        } 
        // If checkbox2 is checked, save false in Firebase
        else if (checkbox2.checked) {
            set(plyarchangeRef, false).then(() => {
                console.log("Plyarchange status set to false (Checkbox 2 checked).");
            }).catch((error) => {
                console.error("Error saving plyarchange status: ", error);
            });
        }
    };

    // Event listeners for checkbox changes
    checkbox1.addEventListener("change", () => {
        updateCheckboxStatus();  // Update Firebase based on checkbox 1 state
    });

    checkbox2.addEventListener("change", () => {
        updateCheckboxStatus();  // Update Firebase based on checkbox 2 state
    });
});

   // Wait for the DOM to be fully loaded before executing the script
   document.addEventListener('DOMContentLoaded', () => {
    // Reference to the input fields and buttons
    const teamSelect = document.getElementById("teamSelect");
    const matchScoreInput = document.getElementById("totalScore");

    // Ensure elements exist
    if (!teamSelect || !matchScoreInput) {
        console.error("One or more elements are missing!");
        return;
    }

    // Function to update match data (optional additional logic)
   

    // Function to save data to Firebase
    const saveMatchScore = () => {
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        const teamname = teamSelect.value.trim();
        const matchScore = matchScoreInput.value.trim();

        if (teamname === "" || matchScore === "") {
            alert("Please select a team and enter a score.");
            return; // Don't save if any field is empty
        }

        // Reference to Firebase path for storing match scores
        const userRef = ref(database, `cricketmatch/${userId}/${matchId}/Teamscor`);

        // Fetch existing data for the match scores
        get(userRef).then((snapshot) => {
            let existingData = snapshot.val() || {};  // Default to an empty object if no data exists

            // Add or update the team score
            existingData[teamname] = matchScore;

            // Save the updated object back to Firebase
            set(userRef, existingData).then(() => {
                console.log("Match score saved successfully!");
            }).catch((error) => {
                console.error("Error saving data: ", error);
            });
        }).catch((error) => {
            console.error("Error fetching data: ", error);
        });
    };
     // Button click events for scoring and wickets
     document.getElementById('scoreboardC').addEventListener('click', () => {
       
        saveMatchScore(); 
    });

   
});


    // Function to update the scoreboard status in Firebase
   
 // Toggle scoreboard button functionality
 


