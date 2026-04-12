const menu = document.getElementById("menu");
const gameBoard = document.getElementById("gameBoard");
const timeEI = document.getElementById("time");
const scorelEI = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");
const randomBtn = document.getElementById("randomBtn");



let firstCard = null;
let secondCard = null;
let lockBoard = false;

let score = 0;
let time = 0;
let timer;

let matchedPairs = 0;

const buttons = document.querySelectorAll(".btn-option");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;

        menu.style.display = "none";
        gameBoard.style.display = "grid";

         document.getElementById("status").classList.add("active-game");
        
        gameBoard.className = "board " + theme;

        startTimer();
        loadImages(theme);
    });
});

function startTimer () {

    clearInterval(timer);

    time = 0;

    timer = setInterval(() => {
        time++;
        timeEI.textContent = time;
    }, 1000);
}

async function loadImages(theme) {

    document.getElementById("loader").style.display = "flex";

    let images =[];

    if (theme === "dogs") {
        const res = await fetch("https://dog.ceo/api/breeds/image/random/6");
        const data = await res.json();
        images = data.message;
    }

    if (theme === "cats") {
        const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=6");
        const data = await res.json();
        images = data.map(img => img.url);
    }

    if (theme === "hp") {
        const res = await fetch("https://hp-api.onrender.com/api/characters");
        const data = await res.json();

        images = data 
              .filter(p => p.image)
              .slice(0,6)
              .map(p => p.image);
    }

    createBoard(images);

    document.getElementById("loader").style.display = "none";
}

function createBoard(images) {

    let gameImages = [...images,...images];
    gameImages.sort(() => Math.random() - 0.5);

    gameBoard.innerHTML = "";
    gameImages.forEach(img => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        const image = document.createElement("img");
        image.src = img;

        card.appendChild(image);

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);
    });
}

randomBtn.addEventListener("click", () => {
    // 1. הגרלת נושא
    const themes = ["hp", "dogs", "cats"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    menu.style.display = "none";
    gameBoard.style.display = "grid";
    
    document.getElementById("status").classList.add("active-game");
    
    gameBoard.className = "board " + randomTheme;
    startTimer();
    loadImages(randomTheme);
});


function flipCard(card) {

    if (lockBoard) return;
    if (card === firstCard) return;

     if (card.classList.contains("matched")) return;

    card.classList.add("open");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    checkMatch();
}

function checkMatch () {
    const isMatch =
      firstCard.querySelector("img").src ===
      secondCard.querySelector("img").src;
    if (isMatch) {
        disableCards();
    }  else {
        unflipCards ();
    }    
}

function disableCards (){

      firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    score += 20;
    matchedPairs++;

    updateScore();

    resetBoard();

    checkWin();

}

function unflipCards () {
    setTimeout (() => {
        firstCard.classList.remove("open");
        secondCard.classList.remove("open");

        if (score >=20 ){
            score -= 20;
        } else {
            score = 0
        }

        updateScore();

        resetBoard();

    }, 800);
}

function resetBoard () {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function updateScore() {
    scorelEI.textContent = Math.round(score);
}

function checkWin() {
    if (matchedPairs === 6) {
        clearInterval(timer);
        setTimeout(() => {
            alert(`Memory master! You win! \nFinel Time: ${time} \nScore: ${score}`)
        },300 ); 
            
        
    }
}


resetBtn.addEventListener("click", resetGame);

function resetGame() {
   
    clearInterval(timer);

    score = 0;
    time = 0;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

     document.getElementById("status").classList.remove("active-game");

    updateScore();
    timeEI.textContent = "0";

    gameBoard.innerHTML = ""; 
    gameBoard.style.display = "none"; 
    menu.style.display = ""; 
}




