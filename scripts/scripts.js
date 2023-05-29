// Initialize variables:
let userEmail;
let gameId;
let newGameKey = "new_game";

let score = 0;
let gameInfo;

let quesIndex = 0;
let quesNum = quesIndex + 1;

let pressedNext = -1;
let correctAnsCollection = {};
let userAnsCollection = {};


// Main elements
let quizForm = document.querySelector(".quizForm"); 
let acordeon = document.querySelector("#acordeon");




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

// Set "userEmail" to user email:
async function getUserEmail(){
    userEmail = auth.currentUser.email;
}

// Set game ID:
async function readNumberOfUserGames(userEmail){
    console.log(userEmail);
    await db.collection(`${userEmail}`).get().then(querySnapshot => {
        gameId = `game_${querySnapshot.size + 1}`;
        console.log(gameId);
    })
    console.log(gameId);
}

//Add game to user game info:
function addGameInfoToFirestore(userEmail, gameId, gameInfo){
    console.log(userEmail, gameId, gameInfo)
    db.collection(userEmail).doc(gameId).set(gameInfo).then((docRef) => {
    console.log("Document written with ID: ", docRef.id)
    })
    .catch((error) => console.error("Error adding document: ", error));
};

/* //Add userID to admins user document:
function addUserToAdmin(userEmail){
    // Get previous users ID:
    let prevUsers = [];
    db.collection("admin").doc("users").get().then((item) => {
        let prevUsers = item.data()
        let addData = [...prevUsers, {"userID": userEmail}];
        db.collection("admin").doc("users").set(addData).then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            })
            .catch((error) => console.error("Error adding document: ", error));
        
        })
        .catch((error) => console.error("Error adding document: ", error));
    // Add new user ID:

};
 */




// FIREBASE AUTH
//Initialize Auth
const auth = firebase.auth();
const user = auth.currentUser;

let signUpForm = document.getElementById("signup_form");
let logInForm = document.getElementById("login_form");
let logOutButton = document.getElementById("logout_button")


//Sign up function --------------------------------There is a strange error here
signUpForm.addEventListener("submit", async function (event){
    event.preventDefault();

    let name = document.getElementById("signIn_user_name").value;
    let email = document.getElementById("signIn_email").value;
    let password = document.getElementById("signIn_password").value;
    let repPassword = document.getElementById("signIn_repeat_password").value;

    if(password != repPassword){
        alert("Repeated password did not match with the first one.")
        return;
    }

    try {
        //Create auth user
        await auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                userCredential.user.updateProfile({
                    displayName: name
                });
                console.log('User registered');
                let user = userCredential.user;
                console.log(user);
                signUpForm.reset();
            });
    } catch(error) {
        console.log(`There has been an error with code: ${error.code}: ${error.message}`)
    }

})

//Log in function
logInForm.addEventListener("submit", async function (event){
    event.preventDefault();

    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;

    /* //Call the collection in the DB
    const docRef = doc(db, "users", email);
    //Search a document that matches with our ref
    const docSnap = await getDoc(docRef); */

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('User authenticated')
      const user = userCredential.user;
      console.log(userCredential);
      userEmail = email;
      console.log(`Hello, ${email}`);
      //logInForm.reset();
    })
    .then(() => {
        
      })
    .catch((error) => {
      console.log('Invalid user or password');
      const errorCode = error.code;
      const errorMessage = error.message;
    });

})

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
        document.querySelector(".kindWrapper").classList.remove("hideCard");
        document.querySelector(".auth_form").classList.add("hideCard");
        let userName = auth.currentUser.displayName;
        createUserBar(userName);

    }else{
        console.log('No logged user');
        document.querySelector(".kindWrapper").classList.add("hideCard");
        document.querySelector(".auth_form").classList.remove("hideCard");
    }
})




// Backend
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// Frontend




// Función para seleccionar preguntas random desde la API
async function getQuestionsAndBegin(){
    let getQuestionsButton = document.querySelector(".kindWrapper");
    getQuestionsButton.classList.add("hideCard")

    let difficulty = document.getElementById('difficulty').value;  //  input user para elegir dificultad.
    let numQuestions = document.getElementById('userNum').value;  // input user para elegir # de preguntas.
    try{    
        let response = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=23&difficulty=${difficulty}&type=multiple`);
        let data = await response.json();
        let allQuestions = data.results;

        return allQuestions
    }
    catch(error){
        console.log(`There is an error: ${error}`)
    }
}


// Local Storage functions
function saveQuestionsInLocalStorage(item, name){
    let arr = [];
    for(let i in item){
        arr.push(item[i]);
    }
    localStorage[name] = JSON.stringify(arr);
}

function saveGameInLocalStorage(item, name){ // Data tree for firestore: get prev.Games, then add new one and store
    let arr = [];
    arr.push(item);
    localStorage[name] = JSON.stringify(arr);
}

function getLocalStorageQuestion(name, index){
    let questions = JSON.parse(localStorage.getItem(name));
    return questions[index]
}

function localStorageLength(name){ //if undefined => length=0
    let questions = JSON.parse(localStorage.getItem(name));
    if (questions){
        let total = questions.length;
        return total;
    } else {
        return 0;
    }
}

function readAllLocalStorage(){
    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        alert(`${key}: ${localStorage.getItem(key)}`);
    }
}




// Función para pintar los números de la barra de progreso:
function numBar(numberQuest) {
    for (let i = 1; i <= numberQuest; i++) {
        let spanBar = `<span id="sp${i}" class="progressBef">${i}</span>`  
        let progressBar = document.getElementById('progressWrapper');
        progressBar.innerHTML += spanBar;     //TODO si no salen todas, usar un appendChild()
    }
}

// función para cambiar color de span según el progreso
function changeSpanBar() {
    let spanNum = document.getElementById(`sp${quesIndex}`);
    spanNum.classList.remove('progressBef');
    spanNum.classList.add('progressAft'); //* comprobar si valdría solo con añadir la clase que contenga en CSS el cambio de background en vez de quitar una y poner otra.
}

// Sweet alert:
const sweetAlert = (titleAlert, textAlert, imageAlert)=>{
    Swal.fire({
        title: titleAlert,
        text: textAlert,
        icon: 'warning',
        imageUrl: imageAlert,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        confirmButtonColor: 'rgb(111, 65, 65)',
        confirmButtonText: 'OK'
      })
}	


// Function that manage what happens when you press "Next" button:
async function pressNextButton(){
    let userChoices = Object.keys(userAnsCollection).length;
    
    pressedNext++;
    let numberOfQuestions = localStorageLength(newGameKey);

    if (quesIndex == 0){
        
        await getQuestionsAndBegin().then(item => saveQuestionsInLocalStorage(item, newGameKey));
        let questionFromLocalStorage = getLocalStorageQuestion(newGameKey, quesIndex);
        createQuestionCards(questionFromLocalStorage);
        numberOfQuestions = localStorageLength(newGameKey);
        numBar(numberOfQuestions);

        let progressBar = document.querySelector('#progressWrapper.hideCard');
        progressBar.classList.remove("hideCard");

        let nextButton = document.getElementById('nextButton');
        nextButton.classList.remove("hideCard");

    } else if (userChoices != pressedNext){
        //Sweet Alert!!
        let titleAlert = '¡No tan rápido, Napoleón!';
        let textAlert = "Debes responder todas las preguntas.";
        let imageAlert = 'https://s2.abcstatics.com/media/historia/2019/03/09/napoleon-bonaparte-kwYB--1248x698@abc.jpg'
        sweetAlert(titleAlert, textAlert, imageAlert);

        pressedNext--;
    } else {
        //Hide the previous card and go on with the next one 
        let currentCard = document.querySelector(`#question_card_${quesNum}`);
        currentCard.classList.add("hideCard");
        changeSpanBar();

        let questionFromLocalStorage = getLocalStorageQuestion(newGameKey, quesIndex);
        createQuestionCards(questionFromLocalStorage);
    
        if (quesIndex == numberOfQuestions){
            document.querySelector(".button").classList.add("hideCard");
            let divButton = document.querySelector("#divButton");
            divButton.innerHTML += '<button id="endQuiz" onclick="checkAnswers()" class="button">END QUIZ</button>';
            acordeon.appendChild(divButton); 
        }
    }
}


function createQuestionCards(questionsInfo){
    let correctAnsId;
    let {question, correct_answer, incorrect_answers} = questionsInfo;
    quesNum = quesIndex + 1;

    let correctAnsIndex = Math.floor(Math.random()*4);
    let answers = incorrect_answers;
    answers.splice(correctAnsIndex, 0, correct_answer);

    let questionCard = `<article id="question_card_${quesNum}" class="question_card">
        <h3>${quesNum}. ${question}</h3>
        <div class="radio_div">
            <button id="answer${quesNum}-0" class="answerButton" onclick="markAnswer('question${quesNum}', '${answers[0]}', 'answer${quesNum}-0')">${answers[0]}</button>
            <button id="answer${quesNum}-1" class="answerButton" onclick="markAnswer('question${quesNum}', '${answers[1]}', 'answer${quesNum}-1')">${answers[1]}</button>
            <button id="answer${quesNum}-2" class="answerButton" onclick="markAnswer('question${quesNum}', '${answers[2]}', 'answer${quesNum}-2')">${answers[2]}</button>
            <button id="answer${quesNum}-3" class="answerButton" onclick="markAnswer('question${quesNum}', '${answers[3]}', 'answer${quesNum}-3')">${answers[3]}</button>
        </div>
    </article>`
    acordeon.innerHTML += questionCard;

    correctAnsId = `answer${quesNum}-${correctAnsIndex}`;
    correctAnsCollection[`question${quesNum}`] = {"answer": answers[correctAnsIndex], "id": correctAnsId};
    quesIndex++;
}

// Mark the answer
function markAnswer(questionNum, userAnswer, answerID){ 
    userAnsCollection[questionNum] = {"answer": userAnswer, "id": answerID};
}

//At the end, all questions are showed up and you can see the answers, but it will be better if they open with a transition
function acordeonFunctionality() {
    let questionCards = document.querySelectorAll(".question_card");
    for (let i in questionCards){
        questionCards[i].classList.add("acordeon_function");
    }
};
    



// Put the main game info in an object to store and print the graph
function getGameInfo(score, numberOfQuestions){
    let id = gameId;
    let date = new Date;
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    date = `${year}-${month}-${day} (${hours}:${minutes})`;
    score = Math.round(score*100/numberOfQuestions);

    gameInfo = {id, date, score};
}

// Check answers
async function checkAnswers(){
    changeSpanBar();
    let questionNumbersArr = Object.keys(correctAnsCollection);
    let numberOfQuestions = questionNumbersArr.length;

    let allCards = document.querySelectorAll(".question_card");
    allCards.forEach(item => item.classList.remove("hideCard"));
    
    for(let i=0; i<questionNumbersArr.length; i++){
        i;
        let correct_answer = correctAnsCollection[questionNumbersArr[i]].answer
        let correctId = correctAnsCollection[questionNumbersArr[i]].id
        let userAnswer = userAnsCollection[questionNumbersArr[i]].answer
        let userId = userAnsCollection[questionNumbersArr[i]].id

        if(correct_answer == userAnswer){ //A solution to colour the answers would be give them a correct-incorrect class, but I've tried and I dont get the class added
            score++;
            let correctAnsButton = document.querySelector(`#${correctId}`);
            correctAnsButton.classList.add("correct_answer");
        } else {
            let correctAnsButton = document.querySelector(`#${correctId}`);
            correctAnsButton.classList.add("correct_answer");
            let incorrectAnsButton = document.querySelector(`#${userId}`);
            incorrectAnsButton.classList.add("incorrect_answer");
        }
    }
    // hide "End quiz" button and show "My results" anchor:
    let endQuizButton = document.querySelector("#endQuiz");
    endQuizButton.classList.add("hideCard");

    let divButton = document.querySelector("#divButton");
    divButton.innerHTML += '<button id="my_results" class="button"><a href="results.html">MY RESULTS</a></button>';
    acordeon.appendChild(divButton);

    //Sweet alert: congrats card:
    createCongratsCard(score)
    
    try {
        
    // Get game info and save it in Local storage and in Firestore:
    await getUserEmail();
    await readNumberOfUserGames(userEmail);
    getGameInfo(score, numberOfQuestions);
    saveGameInLocalStorage(gameInfo, "gamesInfo");
    addGameInfoToFirestore(userEmail, gameId, gameInfo);


    // Acordeon functionality: there is some error but it is not relevant:
    acordeonFunctionality();

    } catch (error){
        console.log(`Ha habido un error: ${error}`)
    }

}



function createCongratsCard(score){
    let finalQuizMessages = [{
        title: "Congratulations!",
        message: `You are practically as wise as Herodotus. Your final score is ${score}.`,
        score: 90,
        imageUrl: "https://www.worldhistory.org/img/r/p/1000x1200/6501.jpg.webp?v=1672313107"
    },{
        title: "Well done!",
        message: `You nailed it. Your final score is ${score}.`,
        score: 75,
        imageUrl: "https://www.nasa.gov/sites/default/files/styles/full_width/public/thumbnails/image/apollo_14_flag_on_the_moon_w_shepard_as14-66-9231.jpg?itok=TN1Lo0zP"
    },{
        title: `You have passed the test! Your final score is ${score}.`,
        message: "You made it to the shore",
        score: 50,
        imageUrl: "https://cflvdg.avoz.es/sc/bucGdbY4RdMDyXECJi6iR2IgEcM=/768x/2018/11/17/00121542482282564373967/Foto/FN18C11F2_201631.jpg"
    },{
        title: `Not good news... Your final score is just ${score}.`,
        message: "Seems you ran into an iceberg",
        score: 30,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/St%C3%B6wer_Titanic.jpg/450px-St%C3%B6wer_Titanic.jpg"
    },{
        title: `Really?! Your final score is just ${score}.`,
        message:"You've disintegrated before even start the adventure",
        score: 0,
        imageUrl: "https://www.history.com/editorial/_next/image?url=https%3A%2F%2Fassets.editorial.aetnd.com%2Fuploads%2F2009%2F11%2Fthe-space-shuttle-challenger-exploded.jpg&w=1080&q=75"
    }]

    let index;
    for (let i=0; i<finalQuizMessages.length; i++){
        if(score >= finalQuizMessages[i].score){
            index = i;
            break;
        }
    }

    let titleAlert = finalQuizMessages[index].title;
    let textAlert = finalQuizMessages[index].message;
    let imageAlert = finalQuizMessages[index].imageUrl;
    
    sweetAlert(titleAlert, textAlert, imageAlert);
}

