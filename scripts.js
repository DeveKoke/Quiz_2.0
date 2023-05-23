

let quizForm = document.querySelector(".quizForm"); 
let acordeon = document.querySelector(".acordeon");


// Questions Info: In "fase 3", a function is needed to call the API for the questions info
let questionsInfo = [{
    question: '¿En qué ciudad se encuentra el edificio Chrysler?',
    correct_answer: "Nueva York",
    incorrect_answers: ["Chicago","París","Amsterdam"],
},{
    question: '¿En qué año se terminó de construir la Opera de Sidney?',
    correct_answer: "1973",
    incorrect_answers: ["1898","1952","1999"],
},{
    question: '¿En qué ciudad española se encuentra el edificio comúnmente conocido como "la Corona de Espinas"?',
    correct_answer: "Madrid",
    incorrect_answers: ["Barcelona","Sevilla","Bilbao"],
},{
    question: '¿A qué se refieren las siglas "AEC" relacionadas con el sector de la construcción a día de hoy?',
    correct_answer: "Architecture, Engeneering and construction",
    incorrect_answers: ["Acero, Eficiencia y Calor","Air, Elements and Cars","No significan nada"],
},{
    question: '¿Cuál de estos arquitectos es el autor de una de las cuatro torres de Chamartín?',
    correct_answer: "Norman Foster",
    incorrect_answers: ["Tadao Ando","Juan Herreros","Iñaki Ábalos"],
},{
    question: '¿A qué altura se encuentra el piso más alto de la Torre Eiffel?',
    correct_answer: "300 metros",
    incorrect_answers: ["200 metros","280 metros","400 metros"],
},{
    question: 'El aire caliente tiende a ...',
    correct_answer: "Subir",
    incorrect_answers: ["Bajar","Bajar brúscamente","Se queda donde está"],
},{
    question: 'Popularmente se dice que el Monasterio de El Escorial tiene un ...',
    correct_answer: "Ladrillo de oro",
    incorrect_answers: ["Becerro de oro","Pomo de oro","Inhodoro de oro"],
},{
    question: 'En los túneles que canalizan el agua en los jardines de La Granja en Segovia vive ...',
    correct_answer: "Una gran comunidad de murciélagos",
    incorrect_answers: ["Los trabajadores que cuidan el jardín","Una jauría de lobos","El Yeti"],
},{
    question: '¿Quién diseñó el Museo Solomon R. Guggenheim de Nueva York construido en 1937?',
    correct_answer: "Frank Lloyd Wright",
    incorrect_answers: ["Norman Foster","Pablo Picasso","Antoni Gaudí"],
}
]

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



// Create question cards:
let quesIndex = 0;
let quesNum = quesIndex + 1;

let totalQuestions = questionsInfo.length;//NUMERO DE PREGUNTAS!!
let pressedNext = -1;
let correctAnsCollection = {};
let userAnsCollection = {};

//"Next" button: if you have not answered the question you can't get the next one.
function pressNextButton(){
    let userChoices = Object.keys(userAnsCollection).length;
    pressedNext++;
    if (quesIndex == 0){
        createQuestionCards(questionsInfo);
    } else if (userChoices != pressedNext){
        //Sweet Alert!!
        console.log("Stop right there! You are missing something... You haven't answered this question!");
        pressedNext--;
    } else {
        //Hide the previous card and go on with the next one 
        let currentCard = document.querySelector(`#question_card_${quesNum}`);
        currentCard.classList.add("hideCard");
        createQuestionCards(questionsInfo);
        if (quesIndex == questionsInfo.length){
            document.querySelector(".button").classList.add("hideCard");
            let divButton = document.querySelector("#divButton");
            divButton.innerHTML += '<button id="endQuiz" onclick="checkAnswers()" class="button">Finalizar Quiz</button>';
            acordeon.appendChild(divButton); 
        }
    }
}


function createQuestionCards(questionsInfo){
    let correctAnsId;
    let questionObject = questionsInfo[quesIndex];
    let {question, correct_answer, incorrect_answers} = questionObject;
    quesNum = quesIndex + 1;

    let correctAnsIndex = Math.floor(Math.random()*4);
    let answers = incorrect_answers;
    answers.splice(correctAnsIndex, 0, correct_answer);

    let questionCard = `<article id="question_card_${quesNum}" class="question_card">
        <h3>${quesNum}. ${question}</h3>
        <div class="radio_div">
            <button id="answer${quesNum}-0" class="question${quesNum}" onclick="markAnswer('question${quesNum}', '${answers[0]}', 'answer${quesNum}-0')">${answers[0]}</button>
            <button id="answer${quesNum}-1" class="question${quesNum}" onclick="markAnswer('question${quesNum}', '${answers[1]}', 'answer${quesNum}-1')">${answers[1]}</button>
            <button id="answer${quesNum}-2" class="question${quesNum}" onclick="markAnswer('question${quesNum}', '${answers[2]}', 'answer${quesNum}-2')">${answers[2]}</button>
            <button id="answer${quesNum}-3" class="question${quesNum}" onclick="markAnswer('question${quesNum}', '${answers[3]}', 'answer${quesNum}-3')">${answers[3]}</button>
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



// Check answers
function checkAnswers(){
    let score = 0;
    let questionNumbersArr = Object.keys(correctAnsCollection);
    console.log(questionNumbersArr.length)

    let allCards = document.querySelectorAll(".question_card");
    allCards.forEach(item => item.classList.remove("hideCard"));

    for(let i=0; i<questionNumbersArr.length; i++){
        let correct_answer = correctAnsCollection[questionNumbersArr[i]].answer
        let correctId = correctAnsCollection[questionNumbersArr[i]].id

        let userAnswer = userAnsCollection[questionNumbersArr[i]].answer
        let userId = userAnsCollection[questionNumbersArr[i]].id

        if(correct_answer == userAnswer){
            score++;
            let correctAnsButton = document.querySelector(`#${correctId}`);
            correctAnsButton.style.background = "green";
        } else {
            let correctAnsButton = document.querySelector(`#${correctId}`);
            correctAnsButton.style.background = "green";
            let incorrectAnsButton = document.querySelector(`#${userId}`);
            incorrectAnsButton.style.background = "red";
        }
    }
    return score;
}






    


  




// Función para seleccionar preguntas random desde la API
async function getQuestionsAndBegin(){
    let getQuestionsButton = document.querySelector(".kindWrapper");
    getQuestionsButton.classList.add("hideCard")

    const difficulty = document.getElementById('difficulty').value   //  input user para elegir dificultad.
    let numQuestions = document.getElementById('userNum').value;  // input user para elegir # de preguntas.
    try{    
        let response = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=23&difficulty=${difficulty}&type=multiple`);
        let data = await response.json();
        let allQuestions = data.results;

        console.log(allQuestions)

        return allQuestions
    }
    catch(error){
        console.log(`There is an error: ${error}`)
    }
}



// Función para pintar los números de la barra de progreso
// getRandomQuestions().then(item => console.log(item))
async function numBar (numberQuest) {
    try{
        let numBar = numberQuest(getRandomQuestions());
        for (let i = 1; i <= numBar; i++) {
            const spanBar = `<span id="sp${i}" class="progressBef">${i}</span>`  
            const progressBar = document.getElementById('progressWrapper');
            progressBar.innerHTML += spanBar;     //TODO si no salen todas, usar un appendChild()
        }
    }
    catch (error){
        console.log('error')
    }
}



// función para cambiar color de span según el progreso
function changeSpanBar() {
    const spanNum = document.getElementById(`sp${quesIndex+1}`);
    spanNum.classList.remove('progressBef');
    spanNum.classList.add('progressAft'); //* comprobar si valdría solo con añadir la clase que contenga en CSS el cambio de background en vez de quitar una y poner otra.

}





// Cambio a main.HTML al hacer clic en botón COMENZAR ----> IMPORTANTE: TIENE QUE IR AL FINAL DEL SCRIPT
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function(){
    // window.location.href = 'main.html';
});
