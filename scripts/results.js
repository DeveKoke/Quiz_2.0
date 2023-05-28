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

//Observe the user's state
async function getInfoAndDrawChart(){
    try{
        auth.onAuthStateChanged(async function (user) {
            if(user){
                console.log(auth.currentUser.displayName);
                console.log(auth.currentUser.email);
                userName = auth.currentUser.displayName;
                userEmail = auth.currentUser.email;
                console.log('Logged user');
                readUserGamesInfo(userEmail);

                db.collection(userEmail).get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                        console.log({"game id": doc.id, "date": doc.data().date, "score": doc.data().score});

                    })
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
console.log(userName, userEmail)

// Backend
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// Frontend





// *GRAFICO PUNTUACIONES.
// readUserGamesInfo(userEmail)

// let arrUserList = JSON.parse(localStorage.getItem('game5'));
/* let arrUserList = [{
    id: 1,
    date: "05-04-2005",
    score: 9
},
{
    id: 1,
    date: "06-08-2013",
    score: 20
},{
    id: 1,
    date: "04-06-2009",
    score: 15
},{
    id: 1,
    date: "2013-03-23",
    score: 13
},{
    id: 1,
    date: "2009-05-23",
    score: 18
}]
 */


function chartScore (){
    let dateChart = [];
    let scoreChart = [];

    for (i = 0; i < arrUserList.length; i++) {
        dateChart.push(arrUserList[i].date) ;  
        scoreChart.push(arrUserList[i].score) ;
    }
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

chartScore();

