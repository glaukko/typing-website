let timer = 0;
let numWordsPerLine = 5;
let numLinesDisplay = 4;
let typing = false;

let words = [];
let wordToType = '';
let wordToType_ind = 0;

const timerLabel = document.getElementById("timer");
const typeBar = document.getElementById("typebar");
const wordsLabel = document.getElementById("words");
const resultLabel = document.getElementById("result-wpm");
const resultSection = document.getElementById("result-section");
const wordSection = document.getElementById("words-section");



let currentWordsHTML = ''; //ids: current, hit, miss

setup_test();

async function get_random_words(number) {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=' + number);
    const tempWords = await response.json();
    console.log(tempWords);
    return tempWords;

}

async function setup_test() {
    wordSection.style.borderStyle = "";
    words = await get_random_words(50);
    wordSection.style.borderStyle = "ridge";
    typeBar.readOnly = false;
    //txt = 'Some good old Defect, the legend continues with his latest EP :)'
    //words = txt.split(' ')
    wordToType = words[0];
    currentWordsHTML = '';

    wordsLabel.innerHTML = words.join(' ');
    timerLabel.innerHTML = timer;
    resultLabel.innerHTML = '';
    
    resultSection.style.borderStyle = "";

    update_words_html();
}

var ontype = function on_type() {
    typing = true; //trigger the timer

    inputText = typeBar.value;
    if(inputText.length >= wordToType.length+10) { typeBar.value = typeBar.value.substring(0, typeBar.value.length-1); } //Do not allow to go on more than 10 characters wrong

    if (inputText == wordToType + ' ' || words.indexOf(wordToType) == words.length-1 && inputText == wordToType) {
        if(wordToType_ind+1 % numWordsPerLine == 0) { currentWordsHTML = currentWordsHTML + '<br>'; } //break line
        currentWordsHTML = currentWordsHTML + '<span class=\"hit\">' + wordToType + '</span> ';  


        typeBar.value = '';
        if(words.length-1 == wordToType_ind) { finish_test(); return; }
        wordToType = words[wordToType_ind+1]; //go to next word
        wordToType_ind += 1;





        
        if(wordToType_ind % numWordsPerLine == 0 && wordToType_ind+1 >= numWordsPerLine)  { //in first word of line
            currentWordsHTML = currentWordsHTML + '<br>';
            if(wordToType_ind+1 > numWordsPerLine * 1 && words.slice(wordToType_ind).length >= numWordsPerLine * numLinesDisplay) { // in second display line
                currentWordsHTML = currentWordsHTML.substring(currentWordsHTML.indexOf('<br>') + '<br>'.length);
                console.log(currentWordsHTML);
            }
        }
        

    }
    else if (inputText != wordToType.substring(0, inputText.length)) {
        console.log('walt idk man');
    }
    





    update_words_html();

  }


function update_words_html() {
    let currentLine = Math.trunc(wordToType_ind / numWordsPerLine) + 1;
    //if (currentWordsHTML.endsWith('<br>')) { currentLine += 1; }
    wordsLabel.innerHTML = currentWordsHTML + '<span class=\"current\">' + wordToType + '</span> ' + words.slice(wordToType_ind+1, currentLine * numWordsPerLine).join(' ') + '<br>';
    for(let i = currentLine; i < currentLine + numLinesDisplay - 1; i++) {
        if(words.slice(numWordsPerLine*i, numWordsPerLine*(i+1)).length == 0) { break; } //Dont allow it to print a line with no words
        wordsLabel.innerHTML = wordsLabel.innerHTML + words.slice(numWordsPerLine*i, numWordsPerLine*(i+1)).join(' ') + '<br>';
    }

    wordsLabel.innerHTML = wordsLabel.innerHTML.substring(0, wordsLabel.innerHTML.length - 4); //remove last linebreak

    //wordsLabel.innerHTML = currentWordsHTML + '<span class=\"current\">' + wordToType + '</span> ' + words.slice(wordToType_ind+1).join(' ');
}

function finish_test() {
    let wpm = (words.length / timer) * 60; 
    wpm = Math.trunc(wpm);
    resultLabel.innerHTML = 'You typed ' + wpm.toString() + ' WPM<br>' + wordToType_ind+1 + ' in ' + Math.trunc(timer) + ' seconds';

    resultSection.style.borderStyle = "ridge";
    resultSection.style.borderRadius = "2px";
    resultSection.style.borderColor = "white";

    typing = false;
    timer = 0;
    timerLabel.innerHTML = timer;

    wordsLabel.innerHTML = currentWordsHTML;
    typeBar.readOnly = true;
}


function increase_timer() {
    if(typing == true) {
        timer+=0.05;
        timerLabel.innerHTML = Math.trunc(timer);
    }
} 

setInterval(increase_timer, 50); 