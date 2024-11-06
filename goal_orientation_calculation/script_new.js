// script.js

const form = document.getElementById('surveyForm');
let selectedLanguage = 'en'; // Default language

// Function to shuffle the questions array
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateQuestions() {
    // Clear previous content
    form.innerHTML = '';

    // Add Likert scale header
    const scaleHeader = document.createElement('div');
    scaleHeader.className = 'scale-header';

    const scaleText = document.createElement('p');
    if (selectedLanguage === 'en') {
        scaleText.innerHTML = `
      Please rate each statement from 1 to 5, where:<br>
      1 = Strongly Disagree<br>
      5 = Strongly Agree
    `;
    } else if (selectedLanguage === 'th') {
        scaleText.innerHTML = `
      กรุณาประเมินแต่ละข้อความตั้งแต่ 1 ถึง 5 โดยที่:<br>
      1 = ไม่เห็นด้วยอย่างยิ่ง<br>
      5 = เห็นด้วยอย่างยิ่ง
    `;
    }

    scaleHeader.appendChild(scaleText);
    form.appendChild(scaleHeader);
    // Student ID input
    // const studentIdDiv = document.createElement('div');
    // studentIdDiv.className = 'student-id';
    //
    // const studentIdLabel = document.createElement('label');
    // studentIdLabel.textContent = selectedLanguage === 'en' ? 'Student ID (Optional): ' : 'รหัสนักศึกษา (ไม่บังคับ): ';
    // studentIdLabel.htmlFor = 'studentId';
    //
    // const studentIdInput = document.createElement('input');
    // studentIdInput.type = 'text';
    // studentIdInput.id = 'studentId';
    // studentIdInput.name = 'studentId';
    //
    // studentIdDiv.appendChild(studentIdLabel);
    // studentIdDiv.appendChild(studentIdInput);
    // form.appendChild(studentIdDiv);

    // Shuffle the questions array
    shuffleQuestions(questions);

    // Generate questions
    questions.forEach((question, index) => {
        // Create the question container
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        // Create a container for the question text and radio buttons
        const questionContent = document.createElement('div');
        questionContent.className = 'question-content';

        // Get the question text in the selected language
        const questionTextValue = question[selectedLanguage];

        // Create the question text
        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${questionTextValue}`;
        questionText.className = 'question-text';

        // Create the container for radio buttons
        const radioContainer = document.createElement('div');
        radioContainer.className = 'radio-container';

        // Create radio buttons for Likert scale (1-5)
        for (let i = 1; i <= 5; i++) {
            const label = document.createElement('label');
            label.className = 'radio-label';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = question.id;
            input.value = i;
            if (i === 1) {
                input.required = true; // Make at least one option required
            }

            const span = document.createElement('span');
            span.textContent = i;

            label.appendChild(input);
            label.appendChild(span);
            radioContainer.appendChild(label);
        }

        // Append the question text and radio buttons to the content container
        questionContent.appendChild(questionText);
        questionContent.appendChild(radioContainer);

        // Append the content to the question div
        questionDiv.appendChild(questionContent);

        // Append the question div to the form
        form.appendChild(questionDiv);
    });

    // Add the submit button at the end
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = selectedLanguage === 'en' ? 'Submit' : 'ส่งคำตอบ';
    form.appendChild(submitButton);

    // Show the form
    form.style.display = 'block';
}

// Event listener for language selection
document.getElementById('startSurvey').addEventListener('click', () => {
    // Get selected language
    selectedLanguage = document.getElementById('language').value;

    // Hide language selection
    document.getElementById('languageSelection').style.display = 'none';

    // Generate the survey
    generateQuestions();
});

// Form submission handler
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const responses = {};

    // Collect responses
    for (let [key, value] of formData.entries()) {
        if (key.startsWith('q')) {
            responses[key] = parseInt(value);
        }
    }

    // const studentId = formData.get('studentId');

    // Prepare data to send
    const data = {
        // studentId: studentId,
        language: selectedLanguage,
        responses: responses
    };

    // Send data to Google Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbxaJk6S_5lp3S5Q4SA7cPuwexQwn3Szt3tp0JPKCOu6EZjUEzU0CsT9Bt1gv-lSCRm-PA/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                form.innerHTML = `<h2>${selectedLanguage === 'en' ? 'Thank you for submitting your responses!' : 'ขอบคุณสำหรับการตอบแบบสอบถาม!'}</h2>`;
            } else {
                alert(selectedLanguage === 'en' ? 'An error occurred while submitting your responses. Please try again.' : 'เกิดข้อผิดพลาดในการส่งคำตอบของคุณ โปรดลองอีกครั้ง');
            }
        })
        .catch(error => {
            console.error('Error!', error);
            alert(selectedLanguage === 'en' ? 'An error occurred while submitting your responses. Please try again.' : 'เกิดข้อผิดพลาดในการส่งคำตอบของคุณ โปรดลองอีกครั้ง');
        });
});

document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting traditionally

    const formData = new FormData(event.target);
    const responses = {};

    // Collect responses
    for (let [key, value] of formData.entries()) {
        responses[key] = parseInt(value);
    }

    // Calculate scores for each category
    let learningOrientation = 0;
    for (let i = 1; i <= 8; i++) {
        learningOrientation += responses['q' + i];
    }

    let performanceOrientation = 0;
    for (let i = 9; i <= 15; i++) {
        performanceOrientation += responses['q' + i];
    }

    let thirdOrientation = 0;
    for (let i = 16; i <= 21; i++) {
        thirdOrientation += responses['q' + i];
    }

    // Display feedback
    const resultsDiv = document.createElement('div');

    resultsDiv.innerHTML = `
    <div class="result-content"><h2>${selectedLanguage === 'en' ? 'Your Results' : 'ผลลัพธ์ของคุณ'}</h2>
    <p>Learning Orientation Score: ${learningOrientation}</p>
    <p>Performance Orientation Score: ${performanceOrientation}</p>
    <p>Third Orientation Score: ${thirdOrientation}</p></div>
    `;

    // Replace the form with the results
    const form = document.getElementById('surveyForm');
    form.parentNode.replaceChild(resultsDiv, form);
});