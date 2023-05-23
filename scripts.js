const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    window.location.href = 'main.html';
  });
  



async function getRandomQuestions() {
    let randomQuestions = [];
    const difficulty = document.getElementById('difficulty').value   //*  input user para elegir dificultad.

    try{
        let response = await fetch(`https://opentdb.com/api.php?amount=50&category=23&difficulty=${difficulty}&type=multiple`);
        let data = await response.json();
        let allQuestions = data.results;

        let maxNum = document.getElementById('userNum').value;  //* input number de user
        let minNum = 5;
        while (randomQuestions.length != minNum){
        let num = Math.floor(Math.random()*maxNum);
            if (!randomQuestions.includes(num)){
            randomQuestions.push(allQuestions[num]);
            }
        }
    }
    catch(error){
        console.log(`ERROR`)
    }
}
