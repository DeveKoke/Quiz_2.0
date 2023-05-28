/* 
// FIREBASE FIRESTORE AND AUTH
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAKZ-KGDnv0hUzez3Kjya0QJuVmp75387Q",
    authDomain: "quiz-2-14171.firebaseapp.com",
    projectId: "quiz-2-14171",
    storageBucket: "quiz-2-14171.appspot.com",
    messagingSenderId: "338864848243",
    appId: "1:338864848243:web:109afe970ab0a4515cd906"
  };

// Initialize Firebase Firestore and Auth
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const user = auth.currentUser;

// Set "userEmail" to user email:
async function getUserEmail(){
    userEmail = auth.currentUser.email;
}

// Set game ID:
async function readAllDocuments(userEmail){
    console.log(userEmail);
    await db.collection().get().then(querySnapshot => {
        gameId = `game_${querySnapshot.size + 1}`;
        console.log(gameId);
    })
    console.log(gameId);
}

//Logout function
logOutButton.addEventListener('click', function (){
    auth.signOut().then(() => {
        window.location.href = "/pages/question.html"
        console.log('Logout user');
    }).catch((error) => {
      console.log('Error: ', error)
    });
})
 
function createUserBar(userName){
    const header = document.getElementById('headerQuiz');
    let user_idBar = `<div class="idBar">
                    <p>Hello, ${userName}</p>
                    </div>`;
    header.innerHTML += user_idBar;
}

//Observe the user's state
let state = auth.onAuthStateChanged(user => {
    if(user){
        console.log('Logged user');
        let userName = auth.currentUser.displayName;
        createUserBar(userName);
    }else{
        console.log('No logged user');
    }
})

 */

