
let quizForm = document.querySelector(".quizForm"); 
let acordeon = document.querySelector(".acordeon");


// Questions Info: In "fase 3", a function is needed to call the API for the questions info
let questionsInfo = [{
    question: '¿En qué ciudad se encuentra el edificio Chrysler?',
    correctAnswer: "Nueva York",
    wrongAnswers: ["Chicago","París","Amsterdam"],
},{
    question: '¿En qué año se terminó de construir la Opera de Sidney?',
    correctAnswer: "1973",
    wrongAnswers: ["1898","1952","1999"],
},{
    question: '¿En qué ciudad española se encuentra el edificio comúnmente conocido como "la Corona de Espinas"?',
    correctAnswer: "Madrid",
    wrongAnswers: ["Barcelona","Sevilla","Bilbao"],
},{
    question: '¿A qué se refieren las siglas "AEC" relacionadas con el sector de la construcción a día de hoy?',
    correctAnswer: "Architecture, Engeneering and construction",
    wrongAnswers: ["Acero, Eficiencia y Calor","Air, Elements and Cars","No significan nada"],
},{
    question: '¿Cuál de estos arquitectos es el autor de una de las cuatro torres de Chamartín?',
    correctAnswer: "Norman Foster",
    wrongAnswers: ["Tadao Ando","Juan Herreros","Iñaki Ábalos"],
},{
    question: '¿A qué altura se encuentra el piso más alto de la Torre Eiffel?',
    correctAnswer: "300 metros",
    wrongAnswers: ["200 metros","280 metros","400 metros"],
},{
    question: 'El aire caliente tiende a ...',
    correctAnswer: "Subir",
    wrongAnswers: ["Bajar","Bajar brúscamente","Se queda donde está"],
},{
    question: 'Popularmente se dice que el Monasterio de El Escorial tiene un ...',
    correctAnswer: "Ladrillo de oro",
    wrongAnswers: ["Becerro de oro","Pomo de oro","Inhodoro de oro"],
},{
    question: 'En los túneles que canalizan el agua en los jardines de La Granja en Segovia vive ...',
    correctAnswer: "Una gran comunidad de murciélagos",
    wrongAnswers: ["Los trabajadores que cuidan el jardín","Una jauría de lobos","El Yeti"],
},{
    question: '¿Quién diseñó el Museo Solomon R. Guggenheim de Nueva York construido en 1937?',
    correctAnswer: "Frank Lloyd Wright",
    wrongAnswers: ["Norman Foster","Pablo Picasso","Antoni Gaudí"],
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
    //Instead of creating every card at first, we can "fetch" all de questions and create the cards one at a time. In the end, we show every card.
    //when you click a button ("comenzar" and "siguiente"), the function "createQuestionCards" executes itself and it creates one card. When it's answered 
    //the card is stored and hidden, and its prepared to repeat the process.
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
        //Stop right there! You are missing something... You haven't answered this question!
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
    let {question, correctAnswer, wrongAnswers} = questionObject;
    quesNum = quesIndex + 1;

    let correctAnsIndex = Math.floor(Math.random()*4);
    let answers = wrongAnswers;
    answers.splice(correctAnsIndex, 0, correctAnswer);

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
function markAnswer(questionNum, userAnswer, answerID){ //MEJOR CON BOTONES!!
    userAnsCollection[questionNum] = {"answer": userAnswer, "id": answerID};
    console.log(userAnsCollection)
}
/* // Mark the answer
function markAnswer(event){ //MEJOR CON BOTONES!!
    let questionNum = event.target.class;
    let userAnswer = event.target.value;
    let answerID = event.target.id;

    userAnsCollection[questionNum] = {"answer": userAnswer, "id": answerID};
    console.log(userAnsCollection)
} */



// Check answers
function checkAnswers(){
    let score = 0;
    let questionNumbersArr = Object.keys(correctAnsCollection);
    console.log(questionNumbersArr.length)

    let allCards = document.querySelectorAll(".question_card");
    allCards.forEach(item => item.classList.remove("hideCard"));

    for(let i=0; i<questionNumbersArr.length; i++){
        let correctAnswer = correctAnsCollection[questionNumbersArr[i]].answer
        let correctId = correctAnsCollection[questionNumbersArr[i]].id

        let userAnswer = userAnsCollection[questionNumbersArr[i]].answer
        let userId = userAnsCollection[questionNumbersArr[i]].id

        if(correctAnswer == userAnswer){
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






    




