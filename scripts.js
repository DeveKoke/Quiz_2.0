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

//Add game to a user
function addGameInfo(userName, gameId, gameInfo){
    db.collection(userName).doc(gameId).set(gameInfo).then((docRef) => {
    console.log("Document written with ID: ", docRef.id)
    })
    .catch((error) => console.error("Error adding document: ", error));
};

//Delete a game of a user
function deleteGame(userName, gameId){
    db.collection(userName).doc(gameId).delete().then(() => {
      alert(`Documento ${gameId} ha sido borrado`);
      //Read all again
      readAll();
    })
      .catch(() => console.log('Error borrando documento'));
  };



  


// Backend
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// Frontend






// Initialize variables:
let userName = "Elena";
let gameId = "game_1";
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


function createCongratsCard(score){
    let finalQuizMessages = [{
        title: "Congratulations!",
        message: "You are practically an architect!",
        score: 9
    },{
        title: "Well done!",
        message: "You seem to like it!",
        score: 7
    },{
        title: "You have passed the test!",
        message: "Just what everyone knows.",
        score: 5
    },{
        title: "Not good enough...",
        message: "Obviously, it's not your favorite topic...",
        score: 3
    },{
        title: "Really?!",
        message: "Come on! You haven't even tried!",
        score: 0
    }]

    let index;
    for (let i=0; i<finalQuizMessages.length; i++){
        if(score >= finalQuizMessages[i].score){
            index = i;
            break;
        }
    }

    let title = finalQuizMessages[index].title;
    let message = finalQuizMessages[index].message;
    let congratsCard = `<article id="congrats_card" class="question_card">
        <h3>${title}</h3>
        <p>${message}</p>
        <p>${score}/${totalPoints}</p>
        <button onclick="showAnswers()">Check answers</button>
    </article>`
    acordeon.innerHTML += congratsCard;
}


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
    console.log(item)
}

function saveGameInLocalStorage(item, name){ // Data tree for firestore: get prev.Games, then add new one and store
    let arr = [];
    arr.push(item);
    localStorage[name] = JSON.stringify(arr);
    console.log(item)
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

    } else if (userChoices != pressedNext){
        //Sweet Alert!!
        Swal.fire({
            title: '¡No tan rápido, Napoleón! ',
            text: "Debes responder todas las preguntas.",
            icon: 'warning',
            imageUrl: 'https://s2.abcstatics.com/media/historia/2019/03/09/napoleon-bonaparte-kwYB--1248x698@abc.jpg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            confirmButtonColor: 'rgb(111, 65, 65)',
            confirmButtonText: 'OK'
          })
        pressedNext--;
    } else {
        //Hide the previous card and go on with the next one 
        let currentCard = document.querySelector(`#question_card_${quesNum}`);
        currentCard.classList.add("hideCard");
        changeSpanBar();

        let questionFromLocalStorage = getLocalStorageQuestion(newGameKey, quesIndex);
        createQuestionCards(questionFromLocalStorage);

        if(quesIndex == numberOfQuestions){
        document.querySelector(".button").classList.add("hideCard");
        let divButton = document.querySelector("#divButton");
        divButton.innerHTML += '<button id="endQuiz" onclick="checkAnswers()" class="button">Finalizar Quiz</button>';
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
    score = score*100/numberOfQuestions;

    gameInfo = {id, date, score};
}

// Check answers
function checkAnswers(){
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
    
    getGameInfo(score, numberOfQuestions);
    saveGameInLocalStorage(gameInfo, "gamesInfo");
    addGameInfo(userName, gameId, gameInfo)
    acordeonFunctionality();
}












