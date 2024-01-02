// Inizializzazione della matrice del gioco, con tutti gli elementi inizializzati a 0
let matrix = [
    [0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0]
];

// Variabili di stato del gioco e inizializzazione di variabili ausiliarie
let gameStarted = false;
let prevMatrix = null;
let newNumber = {row:-1,col:-1};
let noEventKey = false;
let added = false;
let score = 0;
let topScore = 0;
let numberToAdd = {row:-1,col:-1};
let boxInHtml = null;

// Funzione per resettare il gioco con conferma modale
function resetGame() {
    // Se il gioco non è ancora iniziato, esci dalla funzione
    if (!gameStarted)
        return;

    // Apri la modale di conferma
    showModal();
}

// Funzione per confermare il reset del gioco
function resetGameConfirmed() {
    closeModal(); // Chiudi la modale di conferma
    // Resetta il gioco solo se è già iniziato
    if (gameStarted) {
        // Reimposta le variabili di stato e la matrice di gioco
        gameStarted = false;
        matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        prevMatrix = null;
        newNumber = { row: -1, col: -1 };
        noEventKey = false;
        added = false;
        score = 0;
        numberToAdd = { row: -1, col: -1 };
        resetBoxInHtml(); // Chiamata a una funzione ausiliaria per reimpostare l'HTML dei numeri nel gioco
        updateScore(0); // Chiamata a una funzione per aggiornare il punteggio nel gioco
        startGame(); // Riavvia il gioco
    }
}

// Funzione per aprire la modale
function showModal() {
    let modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

// Funzione per chiudere la modale
function closeModal() {
    let modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Chiudi la modale se l'utente clicca fuori da essa
window.onclick = function (event) {
    let modal = document.getElementById('myModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Funzione per iniziare la partita
function startGame(){
    if(gameStarted)
        return;

    // Imposta il gioco come in corso e inizia il gioco generando due numeri casuali
    gameStarted = true;
    addNumber();
    addNumber();
    boxInHtml = updateBox(); // Chiamata a una funzione per aggiornare la rappresentazione HTML della matrice di gioco

    // Comandi
    window.addEventListener('keydown' , ()=>{
        if(!noEventKey){
            added = false;
            prevMatrix = [...matrix]; // Copia la matrice precedente per confrontare le modifiche
            switch (event.key) {
                // Sposta verso l'alto
                case 'w':
                case 'ArrowUp':
                    moveVertical(0, 1);
                    break;

                // Sposta verso il basso
                case 's':
                case 'ArrowDown':
                    moveVertical(3, -1);
                    break;

                // Sposta verso sinistra
                case 'a':
                case 'ArrowLeft':
                    moveHorizontal(0, 1);
                    break;

                // Sposta verso destra
                case 'd':
                case 'ArrowRight':
                    moveHorizontal(3, -1);
                    break;
            }
            numberToAdd = {row:-1,col:-1};
        }
    });
}

// TODO: SISTEMARE GAMEOVER (DICHIARA IL GAME OVER QUANDO LA GRIGLIA È PIENA ANCHE SE SI POSSONO FARE ANCORA DELLE MOSSE)
function isGameOver() {
    let gridFull = true; // Flag per verificare se la griglia è piena
    let movesAvailable = false; // Flag per verificare se ci sono ancora mosse disponibili

    // Controlla se ci sono spazi vuoti nella griglia
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (matrix[i][j] === 0) {
                gridFull = false; // Ci sono spazi vuoti, la griglia non è piena
            }
        }
    }

    // Controlla se ci sono mosse possibili
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (
                (i - 1 >= 0 && matrix[i][j] === matrix[i - 1][j]) ||
                (i + 1 < 4 && matrix[i][j] === matrix[i + 1][j]) ||
                (j - 1 >= 0 && matrix[i][j] === matrix[i][j - 1]) ||
                (j + 1 < 4 && matrix[i][j] === matrix[i][j + 1])
            ) {
                movesAvailable = true; // Ci sono ancora mosse disponibili
            }
        }
    }

    // Il gioco è finito solo se la griglia è piena e non ci sono più mosse disponibili
    return gridFull && !movesAvailable;
}

// Funzione per reimpostare i numeri nel gioco
function resetBoxInHtml(){
    let box = document.querySelectorAll('.number-box');
    for(let i=0; i<box.length; i++){
        box[i].innerHTML = "";
        box[i].className = "number-0 number-box";
    }
}

// Funzione per aggiornare la matrice di gioco
function updateBox(){
    let box = document.querySelectorAll('.number-box');
    box = convertToMatrix(box,4);
    for (let i = 0; i < box.length; i++) {
        for (let j = 0; j < box[i].length; j++) {
            if(matrix[i][j] > 0){
                box[i][j].innerHTML = matrix[i][j];
                box[i][j].className += ` row-${i} col-${j} number-${matrix[i][j]} no-null`;
                if(newNumber.row == i && newNumber.col == j){
                    box[i][j].className += ` new-number`;
                    newNumber.row = -1; newNumber.col = -1;
                }
                else
                    box[i][j].classList.remove('new-number');
            }
        }
    }
    return box;
}

// Funzione ausiliaria per convertire un array in una matrice
function convertToMatrix(array, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < array.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(array[i]);
    }

    return matrix;
}

// Funzione per aggiungere un'animazione e spostare i numeri orizzontalmente
function addShift(numberToShift, row, col, shift, direction, where){
    if(numberToAdd != undefined && numberToAdd.row == row && numberToAdd.col == col)
        null;
    else if(where == "horizontal")
            numberToShift.push({row:row, col:shift, value: matrix[row][col]});
         else
            numberToShift.push({row:shift, col:col, value: matrix[row][col]});
        
    removeCol(boxInHtml[row][col]);
    removeRow(boxInHtml[row][col]);

    if(where == "horizontal"){
        if(numberToAdd != undefined && numberToAdd.row == row && numberToAdd.col == col){
            shift = shift - direction;
            boxInHtml[row][col].className += ` andra alla col-${shift} e row-${row}`;
            numberToAdd = {row:-1,col:-1};
            
        } else{
            boxInHtml[row][col].className += ` andra alla col-${shift} e row-${row}`;
        }
    } else{
        if(numberToAdd != undefined && numberToAdd.row == row && numberToAdd.col == col){
            shift = shift - direction;
            boxInHtml[row][col].className += ` andra alla row-${shift} e col-${col}`;
            numberToAdd = {row:-1,col:-1};
        } else{
            boxInHtml[row][col].className += ` andra alla row-${shift} e col-${col}`;
        }
    }

    shift = shift + direction;
    return {array:numberToShift , shift:shift};
}

// Funzione per spostare i numeri orizzontalmente
function moveHorizontal(pos , direction){
    let numberToShift = [];
    let shift = 0;
    for (let row = 0; row < 4; row++){
        shift = pos;

        for (let col = pos; greaterOrLess(col , direction); col = col + direction){
            if(matrix[row][col] > 0){

                if(numberToAdd == undefined || (numberToAdd.row == -1))
                    numberToAdd = checkSum(row, col, direction, 'col');
                
                let temp = addShift(numberToShift, row, col, shift, direction,'horizontal');
                numberToShift = temp.array;
                shift = temp.shift;
            }
        }
    }
    if(numberToShift.length > 0)
        updateMatrix(numberToShift); // Chiamata a una funzione per aggiornare la matrice dopo lo spostamento
}

// Funzione per spostare i numeri verticalmente
function moveVertical(pos , direction){
    let numberToShift = [];
    let shift = 0;
    for (let col = 0; col < 4; col++){
        shift = pos;

        for (let row = pos; greaterOrLess(row , direction); row = row + direction){
            if(matrix[row][col] > 0){

                if(numberToAdd == undefined || (numberToAdd.row == -1))
                    numberToAdd = checkSum(row,col,direction,'row');

                let temp = addShift(numberToShift,row,col,shift,direction,'vertical');
                numberToShift = temp.array;
                shift = temp.shift;
            }
        }
    }
    if(numberToShift.length > 0)
        updateMatrix(numberToShift); // Chiamata a una funzione per aggiornare la matrice dopo lo spostamento
}

// Funzione per verificare la somma di numeri adiacenti nella stessa riga o colonna
function checkSum(row, col, direction, colOrRow){
    let numberAdded;
    if(colOrRow == 'row')
        for(let k=row + direction; greaterOrLess(k , direction); k = k + direction){
            if(matrix[row][col] == matrix[k][col]){
                matrix[row][col] *= 2;
                updateScore( matrix[row][col]); // Aggiorna il punteggio dopo la somma
                //matrix[k][col] = 0;
                added = true;
                numberAdded = {row:k , col:col}; // Restituisce la posizione del numero sommato
                break;
            } else 
                if(matrix[k][col] != 0)
                    break;
        }

    if(colOrRow == 'col')
        for(let k=col + direction; greaterOrLess(k , direction); k = k + direction){
            if(matrix[row][col] == matrix[row][k]){
                matrix[row][col] *= 2;
                updateScore( matrix[row][col]); // Aggiorna il punteggio dopo la somma
                //matrix[row][k] = 0;
                added = true;
                numberAdded = {row:row , col:k}; // Restituisce la posizione del numero sommato
                break;
            } else 
                if(matrix[row][k] != 0)
                    break;
        }

        return numberAdded;
}

// Funzione per verificare se un indice è maggiore o minore di un certo valore
function greaterOrLess(index, direction){
    if(direction == 1)
        if(index < 4)
            return true;
        else
            return false;
    if(direction == -1)
        if(index >= 0)
            return true;
        else
            return false;

    return true;
}

// Funzione per rimuovere le classi CSS relative alle righe da un elemento HTML
function removeRow(elem){
    for (let index = 0; index < 4; index++) {
        elem.classList.remove(`row-${index}`);
    }
}

// Funzione per rimuovere le classi CSS relative alle colonne da un elemento HTML
function removeCol(elem){
    for (let index = 0; index < 4; index++) {
        elem.classList.remove(`col-${index}`);
    }
}

// Funzione per aggiornare la matrice di gioco dopo uno spostamento
function updateMatrix(numberToShift){
    noEventKey = true; // Imposta una bandiera per evitare nuovi eventi di tastiera durante l'animazione
    matrix = [
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0],
        [0 , 0 , 0 , 0]
    ];
    for(let i=0; i<numberToShift.length; i++){
        matrix[numberToShift[i].row][numberToShift[i].col] = numberToShift[i].value;
    }

    if(!areEqualMtrx(matrix, prevMatrix) || added == true)
        addNumber(); // Aggiunge un nuovo numero dopo lo spostamento solo se la matrice è cambiata o è stata effettuata una somma

        // Verifica se il gioco è finito dopo l'aggiunta di un nuovo numero
        if (isGameOver()) {
            alert("Game Over! Punteggio: " + score);
            resetGameConfirmed(); // Puoi resettare automaticamente il gioco o eseguire altre azioni
            return;
        }

    // Aggiorna l'HTML con un breve ritardo
    setTimeout(() => {
    let defaultBox = document.querySelectorAll('.default-box');
    for(let i=0; i<defaultBox.length; i++){
        let reset = document.createElement('div');
        defaultBox[i].innerHTML = "";
        reset.className = "number-0 number-box aaa";
        defaultBox[i].append(reset);
    }
    
    boxInHtml = 0;
    boxInHtml = updateBox(); // Aggiorna la rappresentazione HTML della matrice di gioco    
    noEventKey = false; // Resetta la bandiera per permettere nuovi eventi di tastiera
    }, 150);
}

// Funzione per verificare l'uguaglianza tra due array di oggetti
function areEqualObj(a1 , a2){
    if(a1.length != a2.length)
        return false;
    for (let index = 0; index < a1.length; index++) {
        if(a1[index].row != a2[index].row){
            return false;
        } else{
            if(a1[index].col != a2[index].col)
            return false;
        }
    }
    return true;
}

// Funzione per verificare l'uguaglianza tra due matrici
function areEqualMtrx(a1 , a2){
    if(a1.length != a2.length){
        return false;}
    for (let index = 0; index < a1.length; index++) {
        for(let j=0; j<a1.length; j++){
            if(a1[index][j] != a2[index][j] )
            return false;
        }
    }
    return true;
}

// Funzione per aggiungere un nuovo numero (2) alla matrice di gioco
function addNumber(){
    while(1){
        let random = Math.floor(Math.random()*4);
        let random2 = Math.floor(Math.random()*4);
        if(matrix[random][random2] == 0){
            matrix[random][random2] = 2;
            newNumber = {row:random, col:random2}; // Memorizza la posizione del nuovo numero aggiunto
            break;
        }
    }
}

// Funzione per aggiornare il punteggio e mostrarlo
function updateScore(add){
    score += add;
    let scoreBox = document.getElementById('main-score-number');
    let topScoreBox = document.getElementById('top-score-number');

    scoreBox.className += " score-updated";
    setTimeout(() => {
        scoreBox.classList.remove('score-updated');
    }, 100);

    scoreBox.innerHTML = score;
    if(score > topScore){
        topScore = score;
        topScoreBox.innerHTML = topScore;
    }
}