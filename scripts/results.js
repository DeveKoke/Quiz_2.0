let userName;
let userEmail;


// FIREBASE FIRESTORE
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAKZ-KGDnv0hUzez3Kjya0QJuVmp75387Q",
    authDomain: "quiz-2-14171.firebaseapp.com",
    projectId: "quiz-2-14171",
    storageBucket: "quiz-2-14171.appspot.com",
    messagingSenderId: "338864848243",
    appId: "1:338864848243:web:109afe970ab0a4515cd906"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//Add game to user game info:
function addGameInfoToFirestore(userEmail, gameId, gameInfo){
    db.collection(userEmail).doc(gameId).set(gameInfo).then((docRef) => {
    console.log("Document written with ID: ", docRef.id)
    })
    .catch((error) => console.error("Error adding document: ", error));
};

// Read all the user games info:
function readUserGamesInfo(userEmail){
    db.collection(userEmail).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log({"game id": doc.id, "date": doc.data().date, "score": doc.data().score});
            // USE THE INFO TO DRAW RESULTS GRAPHS! YOU CAN WRITE HERE THE CODE YOU NEED TO DRAW IT.
        })
    })
    .catch((error) => console.error("Error adding document: ", error));
}


// FIREBASE AUTH
//Initialize Auth
const auth = firebase.auth();
const user = auth.currentUser;

//Logout function
let logOutButton = document.getElementById("logout_button");

logOutButton.addEventListener('click', function (){
    auth.signOut().then(() => {
      console.log('Logout user');
      window.location.href = "/pages/question.html";
    }).catch((error) => {
      console.log('Error: ', error)
    });
})

// Is user logged?
function createUserBar(userName){
    const header = document.getElementById('headerQuiz');
    let user_idBar = `<div class="idBar">
                    <p>Hello, ${userName}</p>
                    </div>`;
    header.innerHTML += user_idBar;
}


// GRAFICO PUNTUACIONES.
function chartScore (dateChart, scoreChart){


    var data = {
        // * eje x
        labels: dateChart,
        // * valores para el eje x
        series: [
            scoreChart
        ]
    };
    //* dimensiones de gráfica.
    var options = {};
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object. As a third parameter we pass in our custom options.
    new Chartist.Bar('.ct-chart', data, options);
}


//If user is logged, get info from Firestore and print the chart:
async function getInfoAndDrawChart(){
    try{
        auth.onAuthStateChanged(async function (user) {
            if(user){
                console.log('Logged user');
                userName = auth.currentUser.displayName;
                userEmail = auth.currentUser.email;
                db.collection(userEmail).get().then(querySnapshot => {

                    // Here is where the info is gotten
                    let dateChart = [];
                    let scoreChart = [];
                    querySnapshot.forEach(doc => {
                        dateChart.push(doc.data().date);
                        scoreChart.push(doc.data().score);
                    })
                    // Here is where the chart is printed
                    chartScore (dateChart, scoreChart);
                })
            }else{
                console.log('No logged user');
            }
        })
    } catch (error) {
        console.log(`Ha habido un error: ${error}`)
    }
    
}


getInfoAndDrawChart()
