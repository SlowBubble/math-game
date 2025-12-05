const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const people = [
    { name: "Bluey", age: 5 },
    { name: "Bingo", age: 3 }
];

let state = 'waiting'; // 'waiting' or 'answering'
let currentQuestion = null;
let userAnswer = '';

function speak(text, onEnd) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.1;
    if (onEnd) {
        utterance.onend = onEnd;
    }
    speechSynthesis.speak(utterance);
}

function getYoungerPerson() {
    return people.reduce((youngest, person) => 
        person.age < youngest.age ? person : youngest
    );
}

function getOlderPerson() {
    return people.reduce((oldest, person) => 
        person.age > oldest.age ? person : oldest
    );
}

function generateQuestion() {
    const younger = getYoungerPerson();
    const older = getOlderPerson();
    const minAge = younger.age;
    const N = Math.floor(Math.random() * (8 - minAge - 1)) + minAge + 1;
    const ageDifference = older.age - younger.age;
    const correctAnswer = N + ageDifference;
    
    return {
        younger,
        older,
        N,
        ageDifference,
        correctAnswer,
        question: `When ${younger.name} is ${N}, how old will ${older.name} be?`
    };
}

function drawText(text, x, y, fontSize = 30, color = 'black') {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(text, x, y);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clearCanvas();
    
    if (state === 'waiting') {
        drawText('Press Space', 50, canvas.height / 2, 60);
    } else if (state === 'answering' || state === 'incorrect' || state === 'correct') {
        if (userAnswer) {
            const answer = parseInt(userAnswer);
            let symbol = '=';
            if (answer > currentQuestion.correctAnswer) {
                symbol = '<';
            } else if (answer < currentQuestion.correctAnswer) {
                symbol = '>';
            }
            drawText(`${currentQuestion.N} + ${currentQuestion.ageDifference} ${symbol} ${userAnswer}`, 50, canvas.height / 2, 80);
        } else {
            drawText(`${currentQuestion.N} + ${currentQuestion.ageDifference}`, 50, canvas.height / 2, 80);
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    
    if (e.key === ' ' && state === 'waiting') {
        currentQuestion = generateQuestion();
        userAnswer = '';
        state = 'answering';
        speak(currentQuestion.question);
        draw();
    } else if (state === 'answering' || state === 'incorrect') {
        if (e.key >= '0' && e.key <= '9') {
            userAnswer = e.key;
            draw();
            const answer = parseInt(userAnswer);
            
            if (answer === currentQuestion.correctAnswer) {
                state = 'correct';
                const successMsg = `Very nice. When ${currentQuestion.younger.name} is ${currentQuestion.N}, ${currentQuestion.older.name} will be ${currentQuestion.correctAnswer}.`;
                speak(successMsg, () => {
                    state = 'waiting';
                    userAnswer = '';
                    draw();
                });
            } else {
                state = 'incorrect';
                speak('Incorrect. Please try again.', () => {
                    userAnswer = '';
                    state = 'answering';
                    draw();
                });
            }
        }
    }
});

draw();
