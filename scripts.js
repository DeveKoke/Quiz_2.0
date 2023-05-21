
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

// Create question cards:
    //Instead of creating every card at first, we can "fetch" all de questions and create the cards one at a time. In the end, we show every card.
    //when you click a button ("comenzar" and "siguiente"), the function "createQuestionCards" executes itself and it creates one card. When it's answered 
    //the card is stored and hidden, and its prepared to repeat the process.
let quesIndex = 0;
let quesNum = quesIndex + 1;
let correctAnsId;
let correctAnsIdColection = [];

//"Next" button: if you have not answered the question you can't get the next one.
function pressNextButton(){
    if (quesIndex == 0){
        createQuestionCards(questionsInfo);
    } else if (correctAnsIdColection.length < quesIndex){
        // This could be a Sweet Alert!!
        let alertMessage = `<article class="alertCard">
            <h3>Stop right there!</h3>
            <p>You are missing something... You haven't answered this question!</p>
        </article>`
        acordeon.innerHTML += alertMessage;
    } else if (quesIndex == questionsInfo.length-1){
        let allCards = document.querySelectorAll(".question_card");
        allCards.forEach(item => item.classList.remove("hideCard"));
        checkAnswers(questionsArr)
    } else {
        //Hide the previous card and go on with the next one
        let currentCard = document.querySelector(`#question_card_${quesNum}`);
        currentCard.classList.add("hideCard");
        createQuestionCards(questionsInfo);
    }
}


function createQuestionCards(questionsInfo){
    let questionObject = questionsInfo[quesIndex];
    let {question, correctAnswer, wrongAnswers} = questionObject;
    quesNum = quesIndex + 1;

    let correctAnsIndex = Math.floor(Math.random()*4);
    let answers = wrongAnswers;
    answers.splice(correctAnsIndex, 0, correctAnswer);

    let questionCard = `<article id="question_card_${quesNum}" class="question_card">
                            <h3>${quesNum}. ${question}</h3>
                            <div class="radio_div">
                                <input type="radio" id="answer${quesNum}-0" name="ansQuest${quesNum}" value="${answers[0]}"><label for="answer${quesNum}-0">${answers[0]}</label>
                                <input type="radio" id="answer${quesNum}-1" name="ansQuest${quesNum}" value="${answers[1]}"><label for="answer${quesNum}-1">${answers[1]}</label>
                                <input type="radio" id="answer${quesNum}-2" name="ansQuest${quesNum}" value="${answers[2]}"><label for="answer${quesNum}-2">${answers[2]}</label>
                                <input type="radio" id="answer${quesNum}-3" name="ansQuest${quesNum}" value="${answers[3]}"><label for="answer${quesNum}-3">${answers[3]}</label>
                            </div>
                        </article>`
    quizForm.innerHTML += questionCard;

    correctAnsId = `answer${quesNum}-${correctAnsIndex}`;
    correctAnsIdColection.push(correctAnsId);
    quesIndex++;
    console.log(quesIndex)
}

//Input submit general
quizForm.innerHTML += '<input type="submit" id="submit" value="Send"><label for="submit">Enviar respuestas</label>';

// Check the answers
function checkAnswers(questionsArr){
    let userAnswers = quizForm.querySelectorAll('input[type="radio"]:checked');
    console.log(userAnswers)
    let correctAnswers = questionsArr.map(item => item.correctAnswer);
    let totalPoints = correctAnswers.length;
    let score = 0;

    //Colour answers:
    for(let i=0; i<correctAnswers.length; i++){
        if(correctAnswers[i]==userAnswers[i].value){
            score++;
            let correctAnsLabel = document.querySelector(`label[for="${correctAnsIdColection[i]}"]`);
            correctAnsLabel.style.background = "green";
        } else {
            let correctAnsLabel = document.querySelector(`label[for="${correctAnsIdColection[i]}"]`);
            correctAnsLabel.style.background = "green";
            let incorrectAnsLabel = document.querySelector(`label[for="${userAnswers[i].id}"]`);
            incorrectAnsLabel.style.background = "red";
        }
    }

    // Congratulations card:
        
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
