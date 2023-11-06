const settingsSection = document.getElementById("settings-section");

const timerButton = document.getElementById("type-timer-button");
const wordsButton = document.getElementById("type-words-button");

const durationButtonArray = document.getElementById("duration-settings").children;

let testType = "time"; //time or words
let testDuration = parseInt(durationButtonArray[0].textContent);

const highlightColor = 'red';
timerButton.style.color = highlightColor;
durationButtonArray[0].style.color = highlightColor;

timerButton.addEventListener('click', set_test_type);
wordsButton.addEventListener('click', set_test_type);

for(i=0; i < durationButtonArray.length; i++) {
    durationButtonArray[i].addEventListener('click', set_test_duration);
}
function set_test_type() {
    console.log('clicked');
    testType = this.getAttribute("name");
    

    timerButton.style.color = 'black';
    wordsButton.style.color = 'black';
    this.style.color = highlightColor;

    setup_test();
}

function set_test_duration() {
    testDuration = parseInt(this.textContent);

    for(i=0; i < durationButtonArray.length; i++) {
        durationButtonArray[i].style.color = 'black';
    }

    this.style.color = highlightColor;

    setup_test();

}

