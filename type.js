let currentTestDuration = 0;

let timer = 0;
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
const typingSection = document.getElementById("typing-section");



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
    currentTestDuration = testDuration
    dur = currentTestDuration;
    if(testType == 'time') { dur = 200; }
    words = await get_random_words(dur);
    wordSection.style.borderStyle = "ridge";
    typeBar.readOnly = false;
    //txt = 'Some good old Defect, the legend continues with his latest EP :)'
    //words = txt.split(' ')
    wordToType = words[0];
    wordToType_ind = 0;
    currentWordsHTML = '';
    timer = 0;
    typing = false;
    typeBar.value = '';

    wordsLabel.innerHTML = words.join(' ');
    console.log(words.length);
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
        currentWordsHTML = currentWordsHTML + '<span class=\"hit\">' + wordToType + '</span> ';  


        typeBar.value = '';
        if(words.length-1 == wordToType_ind) { finish_test(); return; }
        wordToType = words[wordToType_ind+1]; //go to next word
        wordToType_ind += 1;




        

    }
    else if (inputText != wordToType.substring(0, inputText.length)) {
        console.log('walt idk man');
    }
    





    update_words_html();

  }


function update_words_html() {
    wordsLabel.innerHTML = currentWordsHTML + '<span class=\"current\">' + wordToType + '</span> ' + words.slice(wordToType_ind+1).join(' ');
    currentWordEl = document.getElementsByClassName("current");
    currentWordEl[0].scrollIntoView(true);
}

function finish_test() {
    console.log(testType);
    let wpm = (words.length / timer) * 60;
    if (testType == 'time') { wpm = (wordToType_ind / timer) * 60; }
    wpm = Math.trunc(wpm);
    let numWordsTyped = wordToType_ind
    if (testType == 'words') { numWordsTyped = words.length; }
    resultLabel.innerHTML = 'You typed ' + wpm.toString() + ' WPM<br>' + numWordsTyped + ' in ' + Math.trunc(timer) + ' seconds';

    resultSection.style.borderStyle = "ridge";
    resultSection.style.borderRadius = "2px";
    resultSection.style.borderColor = "white";

    typing = false;
    timer = 0;
    timerLabel.innerHTML = timer;

    if(testType == 'words') { wordsLabel.innerHTML = currentWordsHTML; }
    else { update_words_html(); }
    typeBar.readOnly = true;
}


function increase_timer() {
    if(typing == true) {
        timer+=0.05;
        if(testType == 'words') {
            timerLabel.innerHTML = Math.trunc(timer);
        }
        else {
            timerLabel.innerHTML = Math.trunc(currentTestDuration - timer);
        }

        if (testDuration - timer <= 0 && testType == 'time') {
            finish_test();
        }
    }
} 

setInterval(increase_timer, 50); 