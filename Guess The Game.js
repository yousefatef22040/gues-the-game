//setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Eng: Yousef Atef`;

//setting game options
let numbersOfTryies = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numbersOfHints = 2;

//Words Manage
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School", "Yousef", "Yasmin", "Mariam", "Kareem", "Upload"]
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
console.log(wordToGuess)
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numbersOfHints;
const getHintButtom = document.querySelector(".hint")
getHintButtom.addEventListener("click", getHint)

function generateInput(){
    const inputsContainer = document.querySelector(".inputs");

    //Create Main Try Div
    for(let i = 1; i <= numbersOfTryies; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try${i}</span>`;
        inputsContainer.appendChild(tryDiv);

        if (i !== 1) tryDiv.classList.add("disabled-inputs");

        //Create Inputs
        for (let j = 1;j <= numbersOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlenth", "1");
            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv)
    }
    //Foucs On First Input In First One
    inputsContainer.children[0].children[1].focus();

    //Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        //Convert Input To Uppercase
        input.addEventListener("input", function(){
            this.value = this.value.toUpperCase();
            // console.log(index);
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        })

        input.addEventListener("keydown", function(event){
            // console.log(event);
            const currentIndex = Array.from(inputs).indexOf(event.target); // Or this
            if(event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }
            if(event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if(prevInput >= 0) inputs[prevInput].focus();
            }
        });
    });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numbersOfLetters; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualletter = wordToGuess[i - 1];
        //Game Logic
        if (letter === actualletter) {
            //Letter Is Correct And In Place
            inputField.classList.add("yes-in-place")
        } else if (wordToGuess.includes(letter) && letter !== "") {
            // Letter Is Correct And Not In Place
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

//Check If User Win Or Lose
if (successGuess) {
    messageArea.innerHTML = `You win The word Is <span>${wordToGuess}</span>`;
    if (numbersOfHints === 2) {
        messageArea.innerHTML =`<p>Congratz You Didn't Use Hints</p>`
    }

    //Add Disabled Class On All Divs
    let allTris = document.querySelectorAll(".inputs > div");
    allTris.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    //Disable Guess Button
    guessButton.disabled = true;
    getHintButtom.disabled = true

} else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");

    const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`)
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`)
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
        document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");   
        el.children[1].focus();
    } else {
        messageArea.innerHTML = `You lose The word Is <span>${wordToGuess}</span>`;
        //Disable Guess Button
        guessButton.disabled = true;
        getHintButtom.disabled = true
    }

}
}

function getHint() {
    if (numbersOfHints > 0) {
        numbersOfHints--;
        document.querySelector(".hint span").innerHTML = numbersOfHints;
    }
    if (numbersOfHints === 0) {
        getHintButtom.disabled = true
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])")
    // console.log(enabledInputs);
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === ""); 
    // console.log(emptyEnabledInputs)

if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    // console.log(randomIndex)
    // console.log(randomInput)
    // console.log(indexToFill)
    if (indexToFill !== -1) {
        randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
}
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        // console.log(currentIndex)
        if (currentIndex > 0){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus(    )
        }
    }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function (){
    generateInput();
}
