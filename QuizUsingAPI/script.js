function fetchCategories() {
  fetch("https://opentdb.com/api_category.php")
    .then((res) => res.json())
    .then((data) => {
      const categoryDropdown = document.getElementById("category");
      categoryDropdown.innerHTML = "";

      data.trivia_categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));
}

let sessionToken = "";

function getSessionToken() {
  return fetch("https://opentdb.com/api_token.php?command=request")
    .then((res) => res.json())
    .then((data) => {
      sessionToken = data.token;
      return sessionToken;
    })
    .catch((error) => console.error("Error getting session token:", error));
}

function fetchQuestions(category, difficulty, numQuestions, token) {
  return fetch(
    `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple&token=${token}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.response_code === 3 || data.response_code === 4) {
        return resetSessionToken().then((newToken) =>
          fetchQuestions(category, difficulty, numQuestions, newToken)
        );
      }
      return data.results;
    })
    .catch((error) => console.error("Error fetching questions:", error));
}

function resetSessionToken() {
  return fetch(
    `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
  )
    .then((res) => res.json())
    .then((data) => {
      sessionToken = data.token;
      return sessionToken;
    })
    .catch((error) => console.error("Error resetting token:", error));
}

document
  .getElementById("quizForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedCategory = document.getElementById("category").value;
    const selectedDifficulty = document.getElementById("difficulty").value;
    const numQuestions = parseInt(
      document.getElementById("numQuestions").value
    ); // Ensure it's a number

    // Hide form & show quiz
    document.getElementById("form-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.body.style.backgroundColor = "#ccddea"; // Apply background only to quiz

    getSessionToken()
      .then((token) =>
        fetchQuestions(
          selectedCategory,
          selectedDifficulty,
          numQuestions,
          token
        )
      )
      .then((questions) => displayQuiz(questions, numQuestions))
      .catch((error) => console.error("Error starting quiz:", error));
  });

function displayQuiz(questions, numQuestions) {
  let currentQuestionIndex = 0;
  let score = 0;

  const questionCounter = document.getElementById("question-container");
  const scoreCounter = document.getElementById("score-counter");
  const questionText = document.getElementById("question");
  const optionsContainer = document.getElementById("btn-options");
  const remark = document.querySelector(".remark");

  function decodeHtmlEntities(text) {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, "text/html").body
      .innerHTML;
    return decodedString;
  }

  function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionCounter.textContent = `Question: ${
      currentQuestionIndex + 1
    }/${numQuestions}`;
    scoreCounter.textContent = `Current Score: ${score}/${numQuestions}`;
    // Decode question text
    questionText.innerHTML = decodeHtmlEntities(currentQuestion.question);

    // questionText.innerHTML = currentQuestion.question;

    const options = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);

    optionsContainer.innerHTML = "";

    options.forEach((option) => {
      const button = document.createElement("button");
      //   button.textContent = option;
      button.textContent = decodeHtmlEntities(option); // Decode option text
      button.classList.add("quiz-option");
      button.addEventListener("click", () =>
        checkAnswer(button, option, currentQuestion.correct_answer)
      );
      optionsContainer.appendChild(button);
    });

    remark.textContent = ""; // Clear previous remark
  }

  function checkAnswer(selectedButton, selectedOption, correctAnswer) {
    const buttons = document.querySelectorAll(".quiz-option");

    buttons.forEach((button) => {
      button.disabled = true; // Disable all buttons

      if (button.textContent === correctAnswer) {
        button.classList.add("correct"); // Green for correct answer
        if (selectedOption === correctAnswer) {
          score++;
          remark.textContent = "✅ Correct!";
        }
      } else {
        button.classList.add("incorrect"); // Red for incorrect answers
        if (selectedOption !== correctAnswer) {
          remark.textContent = `❌ Wrong! The correct answer was: ${correctAnswer}`;
        }
      }
    });

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        endQuiz();
      }
    }, 1000);
  }

  function endQuiz() {
    questionText.innerHTML = "🎉 Quiz Completed!";
    optionsContainer.innerHTML = "";
    scoreCounter.textContent = `Final Score: ${score}/${numQuestions}`;
    remark.textContent = "Thanks for playing!";
  }

  loadQuestion();
}

fetchCategories();
