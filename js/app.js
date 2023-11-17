// referencias iniciales
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

// Opciones para botones
let options = {
paises: ["Argentina","Alemania", "Inglaterra", "Francia", "Uruguay", "Mexico", "Australia", "Canada", "España", "Italia"],
animales: ["Caballo","Rinoceronte", "Hipopotamo", "Zebra", "Ardilla", "Cocodrilo", "avestruz"],
};

// contar
let winCount = 0;
let count = 0;

let chosenWord = "";

// mostrar botones de opciones
const displayOptions = () => {
    optionsContainer.innerHTML += `<h3>Elija una opción</h3>`;
    let buttonCon = document.createElement("div");
    for (let value in options) {
        buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;     
    }
    optionsContainer.appendChild(buttonCon);
};

// bloquea todos los botones
const blocker = () => {
    let optionsButtons = document.querySelectorAll(".options");
    let letterButtons = document.querySelectorAll(".letters");
    // desactivar todas las opciones
    optionsButtons.forEach((button) => {
        button.disabled = true;
    });

    // desactivar todas las letras
    letterButtons.forEach((button) => {
        button.disabled.true;
    });
    newGameContainer.classList.remove("hide");
};

//generador de palabras
const generateWord = (optionValue) => {
    let optionsButtons = document.querySelectorAll(".options");
    //if optionValue matches the button innertext the highlight the button
    optionsButtons.forEach((button) => {
        if (button.innerText.toLowerCase === optionValue) {
            button.classList.add("active");
        }
        button.disabled = true;
    });

    // inicialmente ocultar letras, borrar palabra anterio
    letterContainer.classList.remove("hide");
    userInputSection.innerText = "";

    let optionArray = options[optionValue];
    //Elegir palabra al azar
    chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
    chosenWord = chosenWord.toUpperCase();

    //reemplace cada letra con un espacio que contenga un guion
    let displayItem = chosenWord.replace(/./g, `<span class="dashes">_</span>`);

    //mostrar cada elemento como intervalo
    userInputSection.innerHTML = displayItem;
};

// funcion inicial (llamada cuando se carga la pagina/el usuario presiona nuevo juego)
const initializer = () => {
    winCount = 0;
    count = 0;

    // initially erase all content and hide letters and new game button
    userInputSection.innerHTML = "";
    optionsContainer.innerHTML = "";
    letterContainer.classList.add("hide");
    newGameContainer.classList.add("hide");
    letterContainer.innerHTML = "";

    //for creating letter buttons
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        //number to ASCII[A-Z]
        button.innerText = String.fromCharCode(i);
        //character button click
        button.addEventListener("click", () => {
            let charArray = chosenWord.split("");
            let dashes = document.getElementsByClassName("dashes");
            //if array contains clicked value replace the matched dash with letter else draw on canvas
            if (charArray.includes(button.innerText)) {
                charArray.forEach((char, index) => {
                    //if character in array is same as clicked button
                    if (char === button.innerText) {
                        //replace dash with letter
                        dashes[index].innerText = char;
                        //increment counter
                        winCount += 1;
                        //if winCount equals word length
                        if (winCount == charArray.length) {
                            resultText.innerHTML = `<h2 class='win-msg'>Adivinaste!!</h2><p>La palabra era: <span>${chosenWord}</span></p>`;
                            //block all buttons
                            blocker();
                        }
                    }
                });
            } else {
                //lose count 
                count += 1;
                //for drawing man
                drawMan(count);
                //count ==6 because head, body, left arm, right arm, left leg, right leg
                if (count == 6) {
                    resultText.innerHTML = `<h2 class='lose-msg'>Perdiste!!</h2><p>La palabra era: <span>${chosenWord}</span></p>`;
                    blocker();
                }
            }
            //disabled clicked button
            button.disabled = true;
        });
        letterContainer.append(button);
    }
    
    displayOptions();
    //call to canvasCreator (for clearing previous canvas and creating initial canvas)
    let { initialDrawing} = canvasCreator();
    //initialDrawing would draw the frame
    initialDrawing();
};

//canvas
const canvasCreator = () => {
    let context = canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = "#000";
    context.lineWidth = 2;

    //for drawing lines
    const drawLine = (fromX, fromY, toX, toY) => {
        context.moveTo(fromX,fromY);
        context.lineTo(toX,toY);
        context.stroke();
    };

    const head = () => {
        context.beginPath();
        context.arc(70, 30, 10, 0, Math.PI * 2, true);
        context.stroke();
    };

    const body = () => {
        drawLine(70, 40, 70, 80);
    };
    const leftArm = () => {
        drawLine(70, 50, 50, 70);
    };
    const rightArm = () => {
        drawLine(70, 50, 90, 70);
    };
    const leftLeg = () => {
        drawLine(70, 80, 50, 110);
    };
    const rightLeg = () => {
        drawLine(70, 80, 90, 110);
    };

    //initial frame
    const initialDrawing = () => {
        //clear canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        //button line
        drawLine(10,130,130,130);
        //left line
        drawLine(10,10,10,131);
        //top line
        drawLine(10,10,70,10);
        //small top line
        drawLine(70,10,70,20);
    };

    return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg};
};

//draw the man
const drawMan = (count) => {
    let { head, body, leftArm, rightArm, leftLeg, rightLeg} = canvasCreator();
    switch (count) {
        case 1:
            head();
            break;
        case 2:
            body();
            break;
        case 3:
            leftArm();
            break;
        case 4:
            rightArm();
            break;
        case 5:
            leftLeg();
            break;
        case 6:
            rightLeg();
            break;
        default:
            break;
    }
};

//new game
newGameButton.addEventListener("click", initializer);
window.onload = initializer;