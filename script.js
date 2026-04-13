const menu = document.getElementById("menu");
const gameBoard = document.getElementById("gameBoard");
const timeEI = document.getElementById("time");
const scorelEI = document.getElementById("score");

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
        
        gameBoard.className = "board " + theme;

        startTimer();
        loadImages(theme);
    });
});

function startTimer () {
    time = 0;

    timer = setInterval(() => {
        time++;
        timeEI.textContent = time;
    }, 1000);
}

async function loadImages(theme) {
    
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

    score += 10;
    matchedPairs++;

    updateScore();

    resetBoard();

    checkWin();

}

function unflipCards () {
    setTimeout (() => {
        firstCard.classList.remove("open");
        secondCard.classList.remove("open");

        score -= 2;
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
    scorelEI.textContent = score;
}

function checkWin() {
    if (matchedPairs === 6) {
        clearInterval(timer);
        setTimeout(() => {
            alert(`victory! \nFinel Time: ${time} \nScore: ${score}`)
        },300 ); 
            
        
    }
}

