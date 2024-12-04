
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
        fetchTeamsAndPlayers();
    } else {
        alert("Please log in to continue.");
        window.location.href = "login.html";
    }
});


  // Fetch teams and players from Firebase
  function fetchTeamsAndPlayers() {
    const teamsRef = ref(database, `cricketmatch/${userId}/${matchId}/team`);
    onValue(teamsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const teamSelect = document.getElementById('teamSelect');
            teamSelect.innerHTML = '<option value="">--Select Team--</option>';
            Object.keys(data).forEach(teamName => {
                const option = document.createElement('option');
                option.value = teamName;
                option.textContent = teamName;
                teamSelect.appendChild(option);
            });

            // Set last selected team if exists
            if (lastSelectedTeam) {
                teamSelect.value = lastSelectedTeam;
                if (lastSelectedTeam) {
                    populatePlayerDropdown(lastSelectedTeam, 'matchName1');
                    populatePlayerDropdown(lastSelectedTeam, 'matchName2');
                }
            }
        }
    });
}

// Checkbox event listener (only one can be selected at a time)
document.getElementById('checkboxPlayer1').addEventListener('change', function() {
    // If Player 1 is checked, uncheck Player 2
    if (this.checked) {
        document.getElementById('checkboxPlayer2').checked = false; 
    }
});

document.getElementById('checkboxPlayer2').addEventListener('change', function() {
    // If Player 2 is checked, uncheck Player 1
    if (this.checked) {
        document.getElementById('checkboxPlayer1').checked = false; 
    }
});

// Event listener for team selection
document.getElementById('teamSelect').addEventListener('change', function() {
    const selectedTeam = this.value;
    lastSelectedTeam = selectedTeam; // Store the last selected team

    if (selectedTeam) {
        populatePlayerDropdown(selectedTeam, 'matchName1');
        populatePlayerDropdown(selectedTeam, 'matchName2');
        document.getElementById('matchName1').disabled = false;
        document.getElementById('matchName2').disabled = false;
    } else {
        resetPlayerDropdowns();
        clearPlayerData('matchName1');
        clearPlayerData('matchName2');
    }
});

 // Event listener for team selection


// Populate player dropdown
function populatePlayerDropdown(teamName, selectId) {
    const playersRef = ref(database, `cricketmatch/${userId}/${matchId}/team/${teamName}`);
    onValue(playersRef, (snapshot) => {
        const playersData = snapshot.val();
        const playerSelect = document.getElementById(selectId);
        const currentSelection = playerSelect.value; // Retain current selection if possible
        playerSelect.innerHTML = '<option value="">--Select Player--</option>';
        if (playersData) {
            Object.keys(playersData).forEach(player => {
                const option = document.createElement('option');
                option.value = player;
                option.textContent = player;
                playerSelect.appendChild(option);
            });
        }
        // Restore the previous player selection after populating
        playerSelect.value = currentSelection;
    });
}

// Reset player dropdowns
function resetPlayerDropdowns() {
    const playerSelect1 = document.getElementById('matchName1');
    const playerSelect2 = document.getElementById('matchName2');
    playerSelect1.innerHTML = '<option value="">--Select Player--</option>';
    playerSelect2.innerHTML = '<option value="">--Select Player--</option>';
}

// Clear player data inputs
function clearPlayerData(selectId) {
    if (selectId === 'matchName1') {
        document.getElementById('run1').value = '';
        document.getElementById('ball1').value = '';
        document.getElementById('four1').value = '';
        document.getElementById('six1').value = '';

       
    } else if (selectId === 'matchName2') {
        document.getElementById('run2').value = '';
        document.getElementById('ball2').value = '';
        document.getElementById('four2').value = '';
        document.getElementById('six2').value = '';
       
    }
}

// Display player data in input fields for selected player
function displayPlayerData(playerName, selectId) {
    const selectedTeam = document.getElementById('teamSelect').value;
    const playerRef = ref(database, `cricketmatch/${userId}/${matchId}/team/${selectedTeam}/${playerName}`);
    onValue(playerRef, (snapshot) => {
        const playerData = snapshot.val();
        if (selectId === 'matchName1') {
            document.getElementById('run1').value = playerData.batRun || '0';
            document.getElementById('ball1').value = playerData.bball || '0';
           
            document.getElementById('four1').value = playerData.four || '0';
            document.getElementById('six1').value = playerData.six || '0';
        } else if (selectId === 'matchName2') {
            document.getElementById('run2').value = playerData.batRun || '0';
            document.getElementById('ball2').value = playerData.bball || '0';
         
            document.getElementById('four2').value = playerData.four || '0';
            document.getElementById('six2').value = playerData.six || '0';
        }
    });
}

// Event listener for player selection
document.getElementById('matchName1').addEventListener('change', function() {
    const selectedPlayer = this.value;
    lastSelectedPlayer1 = selectedPlayer; // Store the last selected player for matchName1
    if (selectedPlayer) {
        displayPlayerData(selectedPlayer, 'matchName1');
    } else {
        clearPlayerData('matchName1');
    }
});

document.getElementById('matchName2').addEventListener('change', function() {
    const selectedPlayer = this.value;
    lastSelectedPlayer2 = selectedPlayer; // Store the last selected player for matchName2
    if (selectedPlayer) {
        displayPlayerData(selectedPlayer, 'matchName2');
    } else {
        clearPlayerData('matchName2');
    }
});

 
function updatePlayerData(teamName, playerName, runId, ballId, fourId, sixId) {
    // Get the current values of the fields
    const run = document.getElementById(runId).value;
    const ball = document.getElementById(ballId).value;
    const four = document.getElementById(fourId).value;
    const six = document.getElementById(sixId).value;

    // Define the reference to the player's data in Firebase
    const playerRef = ref(database, `cricketmatch/${userId}/${matchId}/team/${teamName}/${playerName}`);

    // Use the `update()` method to update only the specified fields
    update(playerRef, {
        batRun: run,    // Update the run
        bball: ball,    // Update the ball count
        four: four,     // Update the four count
        six: six        // Update the six count
    })
    .then(() => {
        console.log('Player data updated successfully');
    })
    .catch((error) => {
        console.error('Error updating player data:', error);
    });
}