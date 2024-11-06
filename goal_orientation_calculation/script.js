// script.js
// Reference to the form element
const form = document.getElementById('surveyForm');

// Function to generate questions
function generateQuestions() {
    // Student ID input
    const studentIdDiv = document.createElement('div');
    studentIdDiv.className = 'student-id';

    const studentIdLabel = document.createElement('label');
    studentIdLabel.textContent = 'Student ID: ';
    studentIdLabel.htmlFor = 'studentId';

    const studentIdInput = document.createElement('input');
    studentIdInput.type = 'text';
    studentIdInput.id = 'studentId';
    studentIdInput.name = 'studentId';
    studentIdInput.required = false;

    studentIdDiv.appendChild(studentIdLabel);
    studentIdDiv.appendChild(studentIdInput);
    form.appendChild(studentIdDiv);

    questions.forEach((question, index) => {
        // Create the question container
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        // Create the question text
        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.text}`;
        questionDiv.appendChild(questionText);

        // Create radio buttons for Likert scale (1-5)
        for (let i = 1; i <= 5; i++) {
            const label = document.createElement('label');
            label.style.marginRight = '10px';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = question.name;
            input.value = i;
            if (i === 1) {
                input.required = true; // Make at least one option required
            }

            label.appendChild(input);
            label.appendChild(document.createTextNode(i));
            questionDiv.appendChild(label);
        }

        // Append the question to the form
        form.appendChild(questionDiv);
    });

    // Add the submit button at the end
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);
}

// Call the function to generate questions when the page loads
window.addEventListener('DOMContentLoaded', generateQuestions);

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
    <h2>Your Results</h2>
    <p>Learning Orientation Score: ${learningOrientation}</p>
    <p>Performance Orientation Score: ${performanceOrientation}</p>
    <p>Third Orientation Score: ${thirdOrientation}</p>
  `;

    // Replace the form with the results
    const form = document.getElementById('surveyForm');
    form.parentNode.replaceChild(resultsDiv, form);

    // Option to report results back
    // const emailLink = document.createElement('a');
    // emailLink.href = `mailto:your_email@example.com?subject=Survey Results&body=Learning Orientation Score: ${learningOrientation}%0D%0APerformance Orientation Score: ${performanceOrientation}%0D%0AThird Orientation Score: ${thirdOrientation}`;
    // emailLink.textContent = 'Email Your Results to the Instructor';
    // resultsDiv.appendChild(emailLink);
});

// script.js

// const form = document.getElementById('surveyForm');

// function generateQuestions() {
//     // Student ID input
//     const studentIdDiv = document.createElement('div');
//     studentIdDiv.className = 'student-id';
//
//     const studentIdLabel = document.createElement('label');
//     studentIdLabel.textContent = 'Student ID: ';
//     studentIdLabel.htmlFor = 'studentId';
//
//     const studentIdInput = document.createElement('input');
//     studentIdInput.type = 'text';
//     studentIdInput.id = 'studentId';
//     studentIdInput.name = 'studentId';
//     studentIdInput.required = true;
//
//     studentIdDiv.appendChild(studentIdLabel);
//     studentIdDiv.appendChild(studentIdInput);
//     form.appendChild(studentIdDiv);
//
//     // Generate questions
//     questions.forEach((question, index) => {
//         // (Same as before)
//     });
//
//     // Add the submit button at the end
//     const submitButton = document.createElement('button');
//     submitButton.type = 'submit';
//     submitButton.textContent = 'Submit';
//     form.appendChild(submitButton);
// }

// window.addEventListener('DOMContentLoaded', generateQuestions);

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

    const studentId = formData.get('studentId');

    // Prepare data to send
    const data = {
        studentId: studentId,
        responses: responses
    };

    // Send data to Google Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbx-O9yhsH13OTZNQJP2Z5pGcUdwd53Q6hjxH2Rs7Uz6iPzs0krTiyEOmsieVHj5RI72/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            // Show a success message to the user
            form.innerHTML = '<h2>Thank you for submitting your responses!</h2>';
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('An error occurred while submitting your responses. Please try again.');
        });
});
