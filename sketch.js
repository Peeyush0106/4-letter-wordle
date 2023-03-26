var currentRow = 1;
var currentNo = 1;
var appropriateWords = data["solutions"];
var currentGuess = 0;
createTable();
createAlphaTable();
const ansWord = getCurrentWordSol();
var end = false;
var responses = {
    rows: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
    }
};

var conclusions = [], unconfirmedLetters = [], removes = [];

function createTable() {
    var idNo = 1;
    for (var i = 0; i < 8; i++) {
        var tr = document.createElement("tr");
        document.getElementById("inpt-table-head").appendChild(tr);
        for (var j = 0; j < 4; j++) {
            var th = document.createElement("th");
            var input = document.createElement("textarea");
            input.id = "word-box-" + idNo;
            input.number = idNo;
            input.cols = 2;
            input.rows = 1;
            input.className = "word-box"
            input.maxLength = 1;
            input.readOnly = true;
            input.style.resize = "none";
            input.onkeypress = function (e) {
                e.preventDefault();
                var nextBtnNo = 1 + this.number;
                if (e.code.slice(0, 3) == "Key") {
                    document.getElementById("word-box-" + currentNo).value = e.key;
                    if (nextBtnNo <= 32 && nextBtnNo !== (currentRow * 4) + 1) {
                        currentNo++;
                        if (nextBtnNo === (4 * currentRow) + 1) {
                            currentRow++;
                        }
                        else {
                            document.getElementById("word-box-" + nextBtnNo).style.border = "4px solid black";
                        }
                    }
                }
            }
            th.appendChild(input);
            tr.appendChild(th);
            idNo++;
        }
    }
    document.getElementById("word-box-" + currentNo).style.border = "4px solid black";
}

function createAlphaTable() {
    for (var i = 0; i < letters.length; i++) {
        for (var j = 0; j < letters[i].length; j++) {
            var th = document.createElement("th");
            letters[i][j] = letters[i][j].toUpperCase();
            th.innerText = letters[i][j];
            th.letter = letters[i][j];
            th.id = "letter-" + th.letter;
            th.className = "letter";
            th.onclick = function (e) {
                e.preventDefault();
                var nextBtnNo = 1 + currentNo;
                document.getElementById("word-box-" + currentNo).value = this.letter;
                if (nextBtnNo <= 32 && nextBtnNo !== (currentRow * 4) + 1) {
                    document.getElementById("word-box-" + nextBtnNo).disabled = false;
                    document.getElementById("word-box-" + nextBtnNo).style.border = "4px solid black";
                    currentNo++;
                }
            }
            document.getElementById("letters-" + (i + 1)).appendChild(th);
        }
    }
}

function backSpace() {
    document.getElementById("word-box-" + currentNo).value = "";
    if (currentNo != (4 * currentRow) - 3) {
        currentNo--;
        document.getElementById("word-box-" + currentNo).focus();
    }
}

function getCurrentWordSol() {
    return (
        data.solutions[Math.floor(Math.random() * data.solutions.length + 1)]
    );
}

function submitWord(word, no) {
    var returnData = checkWordExistance(currentRow);
    if (returnData === "less-data") {
        alert("Insufficient letters!");
    }
    else {
        if (currentNo !== 32) {
            if (returnData == true) {
                giveWordHints(word, no);
                currentNo++;
                currentRow++;
                for (let i = 1; i < currentNo; i++) {
                    document.getElementById("word-box-" + i).style.border = "2px solid black";
                }
                document.getElementById("word-box-" + currentNo).style.border = "4px solid black";
            }
        }
        else {
            giveWordHints();
            endGame();
            alert("The word is: " + ansWord);
        }
    }
};

function checkWordExistance(row) {
    var startBoxNo = (4 * row) - 3;
    var word = "";
    var cancel = false;
    if (row === 0) {
        cancel = true;
        return "less-data";
    }
    for (var i = startBoxNo; i < startBoxNo + 4; i++) {
        if (document.getElementById("word-box-" + i).value == "") {
            cancel = true;
            return "less-data";
        }
        else {
            word += document.getElementById("word-box-" + i).value.toLowerCase();
        }
    }
    if (!cancel) {
        var wordExists = false;
        for (var i = 0; i < data.herrings.length; i++) {
            if (word.toUpperCase() === data.herrings[i].toUpperCase()) {
                wordExists = true;
                break;
            }
        }
        for (var i = 0; i < data.solutions.length; i++) {
            if (word.toUpperCase() === data.solutions[i].toUpperCase()) {
                wordExists = true;
                break;
            }
        }
        return wordExists;
    }
}

async function giveWordHints() {
    var startBoxNo = (4 * currentRow) - 3;
    var noOfCorrectLetters = 0;
    var guess = "";
    for (var i = startBoxNo; i < startBoxNo + 4; i++) {
        guess += document.getElementById("word-box-" + i).value.toLowerCase();
    }
    var ansWordChars = ansWord.split("");
    var guessChars = guess.split("");
    for (let i = 0; i < guessChars.length; i++) {
        let guessLetter = guessChars[i];
        let solutionLetter = ansWordChars[i];
        if (guessLetter === solutionLetter) {
            document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "green";
            document.getElementById("word-box-" + (startBoxNo + i)).style.color = "white";

            document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.backgroundColor = "green";
            document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.color = "white";

            conclusions[i + 1] = guessLetter;

            noOfCorrectLetters++;

            ansWordChars[i] = "";
            guessChars[i] = "";
        }
    }

    for (let i = 0; i < guessChars.length; i++) {
        let guessLetter = guessChars[i];
        if (guessLetter === "") {
            continue;
        }

        for (let j = 0; j < ansWordChars.length; j++) {
            let solutionLetter = ansWordChars[j];
            if (solutionLetter === "") {
                continue;
            }

            if (solutionLetter === guessLetter) {
                document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "yellow";
                document.getElementById("word-box-" + (startBoxNo + i)).style.color = "black";

                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.backgroundColor = "yellow";
                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.color = "black";

                unconfirmedLetters.push({
                    no: (startBoxNo + i) - (currentRow - 1) * 5,
                    letter: guessLetter
                });
                ansWordChars[j] = "";
                guessChars[i] = "";
            }
        }
    }

    for (let i = 0; i < guessChars.length; i++) {
        let guessLetter = guessChars[i];

        if (guessLetter === "") {
            continue;
        }
        document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "gray";
        document.getElementById("word-box-" + (startBoxNo + i)).style.color = "white";

        document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.backgroundColor = "gray";
        document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.color = "white";

        for (let j = 0; j < conclusions.length; j++) {
            var confirmedLetter = conclusions[j];
            if (confirmedLetter === "") {
                continue;
            }
            if (guessLetter === confirmedLetter) {
                guessLetter = "";
            }
        }

        if (guessLetter === "") {
            continue;
        }

        for (let j = 0; j < unconfirmedLetters.length; j++) {
            var unConfirmedLetter = unconfirmedLetters[j].letter;
            if (unConfirmedLetter === "") {
                continue;
            }
            if (guessLetter === unConfirmedLetter) {
                guessLetter = "";
            }
        }

        if (guessLetter === "") {
            continue;
        }

        removes.push(guessLetter);

    }
    if (noOfCorrectLetters === 4) {
        startConfetti();
        setTimeout(function () {
            stopConfetti();
        }, 3000);
        giveWordHints();
        endGame();
    }
}
function endGame() {
    end = true;
    var idNo = 1;
    for (var j = 0; j < 32; j++) {
        document.getElementById("word-box-" + idNo).disabled = true;
        idNo++;
    }
    document.getElementById("submit-word").disabled = true;
    document.getElementById("back-space").disabled = true;
}

function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}

setInterval(function () {
    if (!end && document.getElementById("word-box-" + currentNo)) {
        document.getElementById("word-box-" + currentNo).focus();
    }
}, 10);

window.onload = function () {
    resizeElements();

    setTimeout(function () {
        document.getElementById("new-word").style.transition = "0.3s";
        document.getElementById('new-word').style.boxShadow = '4px 4px 1px 1px gray';
        document.getElementById('new-word').style.transform = 'scale(1)';
    }, 200);

    document.getElementById("body").style.opacity = "100%";
};

window.onresize = resizeElements;

function resizeElements() {
    if (document.body.getElementsByTagName("canvas")[0]) {
        document.body.getElementsByTagName("canvas")[0].style.width = window.innerWidth + 1000;
        document.body.getElementsByTagName("canvas")[0].style.height = window.innerHeight;
    }

    document.getElementById("body").style.zoom = window.innerWidth / 1440;
}

document.getElementById("submit-word").addEventListener("click", (e) => {
    e.preventDefault();
    submitWord();
});

window.onkeydown = (e) => {
    if (e.keyCode === 13) {
        submitWord();
    }
    if (e.keyCode === 8) {
        backSpace();
    }
}