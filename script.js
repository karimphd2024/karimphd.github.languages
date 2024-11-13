let phrasalVerbs = JSON.parse(localStorage.getItem('phrasalVerbs')) || [];

document.getElementById('add-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const phrasalVerb = document.getElementById('phrasal-verb').value;
    const meaning = document.getElementById('meaning').value;
    const sentences = [
        document.getElementById('sentence1').value,
        document.getElementById('sentence2').value,
        document.getElementById('sentence3').value,
        document.getElementById('sentence4').value,
        document.getElementById('sentence5').value,
        document.getElementById('sentence6').value
    ];
    addPhrasalVerb(phrasalVerb, meaning, sentences);
    document.getElementById('add-form').reset();
});

function addPhrasalVerb(phrasalVerb, meaning, sentences) {
    phrasalVerbs.push({ phrasalVerb, meaning, sentences });
    phrasalVerbs.sort((a, b) => a.phrasalVerb.localeCompare(b.phrasalVerb));
    localStorage.setItem('phrasalVerbs', JSON.stringify(phrasalVerbs));
    displayPhrasalVerbs();
}

function displayPhrasalVerbs() {
    const list = document.getElementById('phrasal-verbs-list');
    list.innerHTML = '';
    phrasalVerbs.forEach((verb, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${verb.phrasalVerb}</strong> - ${verb.meaning}`;
        list.appendChild(div);
    });
}

function showAddPhrasalVerb() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('add-phrasal-verb').style.display = 'block';
    displayPhrasalVerbs();
}

function returnToMain() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('add-phrasal-verb').style.display = 'none';
    document.getElementById('context-test').style.display = 'none';
    document.getElementById('meaning-test').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
}

function startContextTest() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('context-test').style.display = 'block';
    const sentences = getRandomSentences(12);
    displayContextTest(sentences);
}

function displayContextTest(sentences) {
    let score = 0;
    let currentQuestion = 0;
    const sentenceContainer = document.getElementById('sentence-container');
    const scoreDisplay = document.getElementById('score-display');
    sentenceContainer.innerHTML = ''; // Clear previous content
    scoreDisplay.innerHTML = `Score: ${score}`;

    function loadQuestion() {
        if (currentQuestion < sentences.length) {
            const sentence = sentences[currentQuestion];
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `${sentence.sentence}<br>`;

            // Randomize the answers
            const answers = getRandomAnswers(sentence.correctVerb);
            answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerHTML = answer;
                button.onclick = function () {
                    if (answer === sentence.correctVerb) {
                        score++;
                        button.style.backgroundColor = 'green';
                    } else {
                        button.style.backgroundColor = 'red';
                        // Highlight the correct answer
                        const correctButton = questionDiv.querySelector(`[data-answer="${sentence.correctVerb}"]`);
                        correctButton.style.backgroundColor = 'green';
                    }
                    // Display score after each question
                    scoreDisplay.innerHTML = `Score: ${score}/${sentences.length}`;
                    // Disable buttons after an answer
                    Array.from(questionDiv.querySelectorAll('button')).forEach(btn => btn.disabled = true);
                    setTimeout(() => {
                        currentQuestion++;
                        sentenceContainer.innerHTML = ''; // Clear the current question
                        loadQuestion(); // Load the next question
                    }, 1000);
                };
                button.setAttribute('data-answer', answer); // Set the answer data attribute for correct answer
                questionDiv.appendChild(button);
            });
            sentenceContainer.appendChild(questionDiv);
        } else {
            // Final score display
            setTimeout(() => {
                scoreDisplay.innerHTML = `Final Score: ${score}/${sentences.length}`;
                if (score >= 10) {
                    scoreDisplay.innerHTML += '<br>Congratulations!';
                } else {
                    scoreDisplay.innerHTML += '<br>Revise more!';
                }
            }, 1000);
        }
    }

    loadQuestion();
}

function getRandomSentences(num) {
    let sentences = [];
    while (sentences.length < num) {
        const verb = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)];
        const sentence = verb.sentences[Math.floor(Math.random() * verb.sentences.length)];
        sentences.push({
            sentence: sentence.replace('__________', '____'), // Replace the blank with underscores
            correctVerb: verb.phrasalVerb
        });
    }
    return sentences;
}

function getRandomAnswers(correctVerb) {
    let answers = [correctVerb];
    while (answers.length < 4) {
        const verb = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)].phrasalVerb;
        if (!answers.includes(verb)) {
            answers.push(verb);
        }
    }
    return shuffle(answers);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startMeaningTest() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('meaning-test').style.display = 'block';
    const sentences = getRandomMeanings(12);
    displayMeaningTest(sentences);
}

function displayMeaningTest(sentences) {
    let score = 0;
    let currentQuestion = 0;
    const meaningContainer = document.getElementById('meaning-container');
    const meaningScoreDisplay = document.getElementById('meaning-score-display');
    meaningContainer.innerHTML = ''; // Clear previous content
    meaningScoreDisplay.innerHTML = `Score: ${score}`;

    function loadQuestion() {
        if (currentQuestion < sentences.length) {
            const sentence = sentences[currentQuestion];
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `${sentence.meaning}<br>`;

            // Randomize the answers
            const answers = getRandomAnswers(sentence.correctVerb);
            answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerHTML = answer;
                button.onclick = function () {
                    if (answer === sentence.correctVerb) {
                        score++;
                        button.style.backgroundColor = 'green';
                    } else {
                        button.style.backgroundColor = 'red';
                        // Highlight the correct answer
                        const correctButton = questionDiv.querySelector(`[data-answer="${sentence.correctVerb}"]`);
                        correctButton.style.backgroundColor = 'green';
                    }
                    // Display score after each question
                    meaningScoreDisplay.innerHTML = `Score: ${score}/${sentences.length}`;
                    // Disable buttons after an answer
                    Array.from(questionDiv.querySelectorAll('button')).forEach(btn => btn.disabled = true);
                    setTimeout(() => {
                        currentQuestion++;
                        meaningContainer.innerHTML = ''; // Clear the current question
                        loadQuestion(); // Load the next question
                    }, 1000);
                };
                button.setAttribute('data-answer', answer); // Set the answer data attribute for correct answer
                questionDiv.appendChild(button);
            });
            meaningContainer.appendChild(questionDiv);
        } else {
            // Final score display
            setTimeout(() => {
                meaningScoreDisplay.innerHTML = `Final Score: ${score}/${sentences.length}`;
                if (score >= 10) {
                    meaningScoreDisplay.innerHTML += '<br>Congratulations!';
                } else {
                    meaningScoreDisplay.innerHTML += '<br>Revise more!';
                }
            }, 1000);
        }
    }

    loadQuestion();
}

function getRandomMeanings(num) {
    let sentences = [];
    while (sentences.length < num) {
        const verb = phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)];
        sentences.push({
            meaning: verb.meaning,
            correctVerb: verb.phrasalVerb
        });
    }
    return sentences;
}

function showProgress() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('progress').style.display = 'block';
}

// Export Data
function exportData() {
    const dataStr = JSON.stringify(phrasalVerbs);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'phrasal_verbs.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import Data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const importedData = JSON.parse(e.target.result);
            phrasalVerbs = importedData;
            localStorage.setItem('phrasalVerbs', JSON.stringify(phrasalVerbs));
            alert('Data imported successfully!');
            displayPhrasalVerbs();
        };

        reader.readAsText(file);
    };

    input.click();
}

returnToMain();
