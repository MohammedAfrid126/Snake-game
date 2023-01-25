//Game Constants 
let inputDirection = { x: 0, y: 0 };
const gameStartSound = new Audio('music/GameStart.mp3');
const foodSound = new Audio('music/food.mp3');
const moveSound = new Audio('music/move.mp3');
const gameOverSound = new Audio('music/GameOver.mp3');
const gameMusic = new Audio('music/GameMusic.mp3');
let headRotation = document.getElementsByClassName(".head")[0];

let speed = 10; // speed is used to calculate the fps of the game
let lastpaintTime = 0; // an empty variable used to update the ctime
let score = 0;

//In JS the x and y coordinates are taken from the top left corner
//Below the snake is initiaally positioned
let snakeArray = [
    { x: 8, y: 17 }
]

//Food 
let food = {
    x: 8, y: 8
}

//Functions and Variables

//parameter ctime is used to calculate the time take between 2 renders
//coz the ctime is in milli seconds.So we use the speed variable to reduce the gitter
function main(ctime) {
    window.requestAnimationFrame(main);

    //If Loop is used to render the fps according to the speed specified
    //Condition Explanation
    //ctime(will gradually increase) after every run the lastpaintTime will be updated to the last ctime after loop has been ended
    //speed can be calculated as:
    //speed = (fps)/60   where fps-fps supported by screen and 60- is the secondss
    if ((ctime - lastpaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastpaintTime = ctime;
    // console.log(ctime);
    // gameMusic.play();
    gameEngine();
}


function snakeCollide(snake) {

    //If snake bump itself
    for (let i = 1; i < snakeArray.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // If snake bump the walls
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

}

function gameEngine() {
    //Part 1
    //Updating the Snake Array and Food
    if (snakeCollide(snakeArray)) {
        gameOverSound.play();
        gameMusic.pause();
        inputDirection = { x: 0, y: 0 };
        alert("Game Over!");
        location.reload();
        snakeArray = [{ x: 8, y: 17 }]
        score = 0;
    }

    //If snake have eaten the Food then increment the score and Regenerate the food

    //If the head of the snake in both co-ordinates are same then increment the score and regenerate the food
    if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
        //To play sound after the snake eats the food
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        if (score > hiScoreVal) {
            hiScoreVal = score;
            localStorage.setItem('highScore', JSON.stringify(hiScoreVal));
            hiScoreBox.innerHTML = 'High Score: ' + hiScoreVal;
        }
        //unshift will add a element to the zeroth index
        snakeArray.unshift({ x: snakeArray[0].x + inputDirection.x, y: snakeArray[0].y + inputDirection.y });
        //To Generate  the random number between any two numbers use the below formula
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }

    }

    //Moving the snake
    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] };
    }

    snakeArray[0].x += inputDirection.x;
    snakeArray[0].y += inputDirection.y;


    //Part 2
    //Display and Rendering The Snake Food
    board.innerHTML = "";
    snakeArray.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snakeBody');
        }
        board.appendChild(snakeElement);
    });

    //Display The Food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

//Main logic starts here

//TO Store the high score information
let hiScore = localStorage.getItem('highScore');
if (hiScore === 0) {
    hiScoreVal = 0;
    localStorage.setItem('highScore', JSON.stringify(hiScoreVal));
} else {
    hiScoreVal = JSON.parse(hiScore);
    hiScoreBox.innerHTML = 'High Score: ' + hiScore;
}

//It is used to render the graphics better that setTimeIntervals
//For More Information
//https://stackoverflow.com/questions/38709923/why-is-requestanimationframe-better-than-setinterval-or-settimeout
window.requestAnimationFrame(main);

//To Take Keys as Input
window.addEventListener('keydown', event => {
    inputDirection = { x: 0, y: 0 }
    moveSound.play();
    switch (event.key) {
        case "ArrowUp":
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;

        case "ArrowDown":
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;

        case "ArrowLeft":
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;

        case "ArrowRight":
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        default:
            break;
    }
})