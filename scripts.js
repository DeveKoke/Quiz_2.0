
let quizForm = document.querySelector(".quizForm"); 
let quizSection = document.querySelector(".quiz");


// Questions Info: In "fase 3", a function is needed to call the API for the questions info
let questionsInfo = [{
    question: '¿En qué ciudad se encuentra el edificio Chrysler?',
    correctAnswer: "Nueva York",
    wrongAnswers: ["Chicago","París","Amsterdam"],
    img: "https://www.voyanyc.com/wp-content/uploads/2016/02/Chrysler-Building-Voy-a-NYC.jpg",
    alt: "Edificio Chrysler"
},{
    question: '¿En qué año se terminó de construir la Opera de Sidney?',
    correctAnswer: "1973",
    wrongAnswers: ["1898","1952","1999"],
    img: "https://elsolweb.tv/wp-content/uploads/2018/10/Opera-house-sydney.jpg",
    alt: "Opera de Sidney"
},{
    question: '¿En qué ciudad española se encuentra el edificio comúnmente conocido como "la Corona de Espinas"?',
    correctAnswer: "Madrid",
    wrongAnswers: ["Barcelona","Sevilla","Bilbao"],
    img: "https://www.metalocus.es/sites/default/files/styles/mopis_news_gallery_deskop/public/metalocus-coronadeespinas-ohm16-28.jpg?itok=DMo_vogc",
    alt: "Edificio Corona de espinas"
},{
    question: '¿A qué se refieren las siglas "AEC" relacionadas con el sector de la construcción a día de hoy?',
    correctAnswer: "Architecture, Engeneering and construction",
    wrongAnswers: ["Acero, Eficiencia y Calor","Air, Elements and Cars","No significan nada"],
    img: "https://segurosnews.com/wp-content/uploads/2021/12/QBE-construccion.jpg",
    alt: "Trabajadores en la obra"
},{
    question: '¿Cuál de estos arquitectos es el autor de una de las cuatro torres de Chamartín?',
    correctAnswer: "Norman Foster",
    wrongAnswers: ["Tadao Ando","Juan Herreros","Iñaki Ábalos"],
    img: "https://www.barcelo.com/guia-turismo/wp-content/uploads/2019/07/torres-de-madrid-atardecer.jpg",
    alt: "Torres de Chamartín"
},{
    question: '¿A qué altura se encuentra el piso más alto de la Torre Eiffel?',
    correctAnswer: "300 metros",
    wrongAnswers: ["200 metros","280 metros","400 metros"],
    img: "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/74/aa/fc.jpg",
    alt: "Torre Eiffel"
},{
    question: 'El aire caliente tiende a ...',
    correctAnswer: "Subir",
    wrongAnswers: ["Bajar","Bajar brúscamente","Se queda donde está"],
    img: "https://disenarparalavida.com/wp-content/uploads/2020/07/captador-02.jpg",
    alt: "Captadores de viento"
},{
    question: 'Popularmente se dice que el Monasterio de El Escorial tiene un ...',
    correctAnswer: "Ladrillo de oro",
    wrongAnswers: ["Becerro de oro","Pomo de oro","Inhodoro de oro"],
    img: "https://www.turismoenmadrid.com/wp-content/uploads/2020/06/monasterio-de-el-escorial-patrimonio-de-la-humanidad.jpg",
    alt: "Monasterio de El Escorial"
},{
    question: 'En los túneles que canalizan el agua en los jardines de La Granja en Segovia vive ...',
    correctAnswer: "Una gran comunidad de murciélagos",
    wrongAnswers: ["Los trabajadores que cuidan el jardín","Una jauría de lobos","El Yeti"],
    img: "https://farm9.staticflickr.com/8214/8336443651_282bc4bdce_o.jpg",
    alt: "Jardines de La Granja, Segovia"
},{
    question: '¿Quién diseñó el Museo Solomon R. Guggenheim de Nueva York construido en 1937?',
    correctAnswer: "Frank Lloyd Wright",
    wrongAnswers: ["Norman Foster","Pablo Picasso","Antoni Gaudí"],
    img: "https://www.mejores-planes-viaje-nueva-york.com/wordpress/wp-content/uploads/2019/06/Guggenheim-Museum-New-York-City-24.jpg",
    alt: "Museo Solomon R. Guggenheim de Nueva York"
}
]

// Create question cards:
    //Instead of creating every card at first, we can "fetch" all de questions and create the cards one at a time. In the end, we show every card.

    //when you click a button ("comenzar" and "siguiente"), the function "createQuestionCards" executes itself and it creates one card. When it's answered 
    //the card is stored and hidden, and its prepared to repeat the process.



let quesIndex = 0;
let correctAnsId;
let correctAnsIdColection = [];

//"Next" button: if you have not answered the question you can't get the next one.
function pressNextButton(questionObject){
    if (quesIndex == questionObject.length-1){
        let allCards = document.querySelectorAll(".question_card");
        allCards.classList.remove("hideCard");

    } else if (correctAnsIdColection.length<quesIndex){
        // This could be a Sweet Alert!!
        let alertMessage = `<article class="alertCard">
            <h3>Stop right there!</h3>
            <p>You are missing something... You haven't answered this question!</p>
        </article>`
        quizSection.innerHTML += alertMessage;
    } else {
        //Hide the previous card and go on with the next one
        let currentCard = document.getElementById(`question_card_${quesIndex+1}`);
        currentCard.classList.add("hideCard");
        createQuestionCards(questionsInfo);
    }
}

function createQuestionCards(questionObject){
    let quesNum = quesIndex + 1;
    
    let {question, correctAnswer, wrongAnswers, img, alt} = questionObject[quesIndex];
    
    let correctAnsIndex = Math.floor(Math.random()*4);
    let answers = wrongAnswers.splice(correctAnsIndex, 0, correctAnswer);

    let questionCard = `<article id="question_card_${quesNum}" class="question_card">
                            <h3>${quesNum}. ${question}</h3>
                            <img src="${img}" alt="${alt}">
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
        quizSection.innerHTML += congratsCard;
}
