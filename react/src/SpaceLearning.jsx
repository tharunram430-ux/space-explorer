import { useState } from "react";
import "./spaceLearning.css";
import { SpaceFacts, SpaceTheories } from "./SpaceLibrary.jsx";

const questions = [
    {
        prompt: "What is Earth's natural satellite?",
        options: ["The Moon", "Mars", "The Sun", "Venus"],
        answer: 0
    },
    {
        prompt: "Which of these is an artificial satellite orbiting Earth?",
        options: ["The Moon", "The International Space Station", "A meteor", "The North Star"],
        answer: 1
    },
    {
        prompt: "What process releases energy inside most stars?",
        options: ["Nuclear fusion", "Evaporation", "Reflection", "Freezing"],
        answer: 0
    },
    {
        prompt: "Which statement about the Sun is true?",
        options: [
            "It is the closest star to Earth",
            "It is a planet",
            "It orbits Earth",
            "It has no light of its own"
        ],
        answer: 0
    },
    {
        prompt: "What is one job of a weather satellite?",
        options: [
            "Measure the depth of the ocean",
            "Track clouds and storms",
            "Create stars",
            "Change Earth's orbit"
        ],
        answer: 1
    }
];

function getGrade(score) {
    if (score === questions.length) {
        return {
            letter: "A",
            message: "Outstanding! You got every question right. Keep exploring!"
        };
    }

    if (score >= 4) {
        return {
            letter: "B",
            message: "Great work! You know a lot about space."
        };
    }

    if (score >= 3) {
        return {
            letter: "C",
            message: "Good effort! A little more exploring will grow your space knowledge."
        };
    }

    return {
        letter: "D",
        message: "Not quite there yet, and that's okay. Every explorer learns one discovery at a time. Review the facts and try again!"
    };
}

function SpaceLearning() {
    const [activeSection, setActiveSection] = useState("facts");
    const sections = [
        { id: "facts", label: "Facts" },
        { id: "quiz", label: "Quiz" },
        { id: "theory", label: "Theory" }
    ];

    return (
        <section className="space-learning">
            <h2 className="space-learning-title">Explore Space</h2>
            <div className="space-learning-layout">
                <nav className="space-learning-nav" aria-label="Space learning sections">
                    {sections.map(section => (
                        <button
                            className={activeSection === section.id ? "learning-nav-active" : ""}
                            type="button"
                            key={section.id}
                            aria-current={activeSection === section.id ? "page" : undefined}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>

                <div className="space-learning-content">
                    {activeSection === "facts" && (
                        <>
                            <h2>Space Facts</h2>
                            <div className="learning-cards">
                                <article className="learning-card">
                                    <h3>Satellites</h3>
                                    <p>
                                        A satellite is an object that orbits a larger object in space. The Moon is
                                        Earth&apos;s natural satellite. People also build artificial satellites and
                                        place them in orbit to help with GPS, communication, weather forecasts,
                                        and scientific research.
                                    </p>
                                </article>
                                <article className="learning-card">
                                    <h3>Stars</h3>
                                    <p>
                                        Stars are huge, glowing spheres of hot gas called plasma. Nuclear fusion in
                                        their cores releases energy as light and heat. Our Sun is the closest star
                                        to Earth, and the stars we see at night are much farther away.
                                    </p>
                                </article>
                            </div>
                            <SpaceFacts />
                        </>
                    )}
                    {activeSection === "quiz" && <SpaceQuiz />}
                    {activeSection === "theory" && (
                        <>
                            <h2>Space Theories</h2>
                            <SpaceTheories />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

function SpaceQuiz() {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const quizComplete = questionIndex === questions.length;

    function chooseAnswer(answerIndex) {
        if (selectedAnswer !== null) {
            return;
        }

        setSelectedAnswer(answerIndex);

        if (answerIndex === questions[questionIndex].answer) {
            setScore(currentScore => currentScore + 1);
        }
    }

    function continueQuiz() {
        setSelectedAnswer(null);
        setQuestionIndex(currentIndex => currentIndex + 1);
    }

    function restartQuiz() {
        setQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
    }

    return (
        <section className="space-quiz">
            <h2>Space Quiz</h2>
            <p className="quiz-instructions">
                Answer five questions. Each correct answer earns one mark.
            </p>

            {quizComplete ? (
                <div className="quiz-result" aria-live="polite">
                    <p className="quiz-score">Your score: {score} / {questions.length}</p>
                    <p className="quiz-grade">Grade: {getGrade(score).letter}</p>
                    <p>{getGrade(score).message}</p>
                    <button type="button" onClick={restartQuiz}>Try Again</button>
                </div>
            ) : (
                <div className="quiz-question" aria-live="polite">
                    <p className="quiz-progress">
                        Question {questionIndex + 1} of {questions.length}
                    </p>
                    <h3>{questions[questionIndex].prompt}</h3>
                    <div className="quiz-options">
                        {questions[questionIndex].options.map((option, answerIndex) => {
                            const isCorrectAnswer = answerIndex === questions[questionIndex].answer;
                            const isSelectedAnswer = answerIndex === selectedAnswer;
                            let optionClass = "quiz-option";

                            if (selectedAnswer !== null && isCorrectAnswer) {
                                optionClass += " quiz-option-correct";
                            } else if (isSelectedAnswer) {
                                optionClass += " quiz-option-incorrect";
                            }

                            return (
                                <button
                                    className={optionClass}
                                    type="button"
                                    key={option}
                                    onClick={() => chooseAnswer(answerIndex)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {selectedAnswer !== null && (
                        <div className="quiz-feedback" role="status">
                            {selectedAnswer === questions[questionIndex].answer
                                ? <p>Correct! You earned 1 mark. Great job!</p>
                                : (
                                    <p>
                                        Not quite. The correct answer is{" "}
                                        <strong>{questions[questionIndex].options[questions[questionIndex].answer]}</strong>.
                                        Keep going; every answer helps you learn.
                                    </p>
                                )}
                            <button type="button" onClick={continueQuiz}>
                                {questionIndex === questions.length - 1 ? "See My Grade" : "Next Question"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default SpaceLearning;
