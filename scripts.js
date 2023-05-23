//* cambio a main.HTML al hacer clic en botón COMENZAR
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    window.location.href = 'main.html';
  });
  


//* función para seleccionar preguntas random desde la API
async function getRandomQuestions() { 
    let randomQuestions = [];          //* Array donde van las preguntas random con las que va a jugar user.
    const difficulty = document.getElementById('difficulty').value   //*  input user para elegir dificultad.

    try{    
        let response = await fetch(`https://opentdb.com/api.php?amount=50&category=23&difficulty=${difficulty}&type=multiple`);
        let data = await response.json();
        let allQuestions = data.results;

        let maxNum = document.getElementById('userNum').value;  //* input user para elegir # de preguntas.
        let minNum = 5;
        while (randomQuestions.length != minNum){
        let num = Math.floor(Math.random()*maxNum);
            if (!randomQuestions.includes(num)){
            randomQuestions.push(allQuestions[num]);
            }
        }
        return randomQuestions.length
    }
    catch(error){
        console.log(`ERROR`)
    }
}


// * Función para pintar los números de la barra de progreso
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



// * función para cambiar color de span según el progreso
function changeSpanBar() {
    const spanNum = document.getElementById(`sp${quesIndex+1}`);
    spanNum.classList.remove('progressBef');
    spanNum.classList.add('progressAft'); //* comprobar si valdría solo con añadir la clase que contenga en CSS el cambio de background en vez de quitar una y poner otra.

}