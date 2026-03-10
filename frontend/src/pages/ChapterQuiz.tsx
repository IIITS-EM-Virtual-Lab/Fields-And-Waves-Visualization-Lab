import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken } from '../store/slices/authSlice';
import './ChapterQuiz.css';

const API = 'https://fields-and-waves-visualization-lab.onrender.com';

interface Question {
  _id: string;
  type: 'MCQ' | 'BLANK';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  imageUrl?: string;
  solutionImageUrl?: string;
}

interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
}

interface Quiz {
  _id: string;
  module: string;
  chapter: string;
  questions: Question[];
}

// ─── Randomly pick up to `n` items from an array ───────────
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Build the quiz set: up to 3 easy, 4 medium, 3 hard ────
function selectQuizQuestions(allQuestions: Question[]): Question[] {
  const easy   = allQuestions.filter(q => q.difficulty === 'EASY');
  const medium = allQuestions.filter(q => q.difficulty === 'MEDIUM');
  const hard   = allQuestions.filter(q => q.difficulty === 'HARD');

  const selected = [
    ...pickRandom(easy,   Math.min(3, easy.length)),
    ...pickRandom(medium, Math.min(4, medium.length)),
    ...pickRandom(hard,   Math.min(3, hard.length)),
  ];

  // Shuffle the final set so difficulty order isn't always the same
  return selected.sort(() => Math.random() - 0.5);
}

const ChapterQuiz = () => {
  const navigate = useNavigate();
  const { moduleName = '', chapterName = '' } = useParams<{ moduleName: string; chapterName: string }>();

  // Raw quiz from API (full pool)
  const [rawQuiz, setRawQuiz] = useState<Quiz | null>(null);
  // Selected subset of questions shown to the student
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [loading, setLoading] = useState(true);
  const [intro, setIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  // ── Fetch full question pool then select random subset ──
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const url =
          !chapterName || chapterName === 'common'
            ? `${API}/api/quizzes/module/${moduleName}/common`
            : `${API}/api/quizzes/module/${moduleName}/chapter/${chapterName}`;

        const res = await axios.get(url);
        const fullQuiz: Quiz = {
          _id: res.data.data._id,
          module: res.data.data.module,
          chapter: res.data.data.chapter,
          questions: res.data.data.questions,
        };

        setRawQuiz(fullQuiz);

        // Select the random subset for this attempt
        const selectedQuestions = selectQuizQuestions(fullQuiz.questions);
        setQuiz({ ...fullQuiz, questions: selectedQuestions });
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [moduleName, chapterName]);

  const currentQuestion = quiz?.questions[currentIndex];

  const handleOptionSelect = (opt: string) => {
    if (!answered) setSelectedOption(opt);
  };

  const handleCheck = () => {
    if (!selectedOption || !currentQuestion || answered) return;

    const isAnswerCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(selectedOption)
      : currentQuestion.correctAnswer === selectedOption;

    setIsCorrect(isAnswerCorrect);
    setAnswered(true);

    const pts = isAnswerCorrect ? currentQuestion.points : 0;
    setScore(prev => prev + pts);
    if (isAnswerCorrect) setCorrectCount(prev => prev + 1);

    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion._id,
      selectedAnswer: selectedOption,
      isCorrect: isAnswerCorrect,
      points: pts,
    }]);
  };

  const handleSkip = () => {
    if (!currentQuestion || answered) return;
    setSkipped(true);
    setAnswered(true);
    setIsCorrect(false);
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion._id,
      selectedAnswer: 'SKIPPED',
      isCorrect: false,
      points: 0,
    }]);
  };

  // ── Submit with explicit final values to avoid stale state ──
  const submitQuizResult = async (
    finalScore: number,
    finalCorrectCount: number,
    finalUserAnswers: UserAnswer[]
  ) => {
    if (submitted || !currentUser?._id || !quiz?._id) return;

    try {
      await axios.post(
        `${API}/api/quizresult/save`,
        {
          userId: currentUser._id,
          quizId: quiz._id,
          score: finalScore,
          correctAnswers: finalCorrectCount,
          totalQuestions: quiz.questions.length,
          accuracy: Math.round((finalCorrectCount / quiz.questions.length) * 100),
          module: quiz.module,
          chapter: quiz.chapter,
          userAnswers: finalUserAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error('❌ Error submitting quiz result:', err);
    }
  };

  const handleNext = async () => {
    if (!quiz) return;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quiz.questions.length) {
      // Build final values synchronously before state updates settle
      const lastAnswer = userAnswers[userAnswers.length - 1];
      // If the last question was just answered via handleCheck it's already in userAnswers
      // but if handleNext is called right after handleCheck in the same tick, we need
      // to use the latest accumulated state — which is correct here since handleCheck
      // already pushed to userAnswers before handleNext is possible (button swap)
      await submitQuizResult(score, correctCount, userAnswers);
      setShowResults(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(false);
    setSkipped(false);
  };

  const getCorrectAnswer = (question: Question): string =>
    Array.isArray(question.correctAnswer)
      ? question.correctAnswer[0]
      : question.correctAnswer;

  // ── Difficulty counts shown on intro screen ──
  const getDifficultyCounts = () => {
    if (!quiz) return { easy: 0, medium: 0, hard: 0 };
    return {
      easy:   quiz.questions.filter(q => q.difficulty === 'EASY').length,
      medium: quiz.questions.filter(q => q.difficulty === 'MEDIUM').length,
      hard:   quiz.questions.filter(q => q.difficulty === 'HARD').length,
    };
  };

  // ── Review ──────────────────────────────────────────────
  const renderReview = () => {
    if (!quiz || !showReview) return null;

    return (
      <div className="quiz-review">
        <h2>Quiz Review</h2>
        <div className="review-summary">
          <p>Total Points: <strong>{score}</strong></p>
          <p>Correct Answers: <strong>{correctCount} / {quiz.questions.length}</strong></p>
        </div>

        <div className="review-questions">
          {quiz.questions.map((question, index) => {
            // Match by string comparison — _id may come as ObjectId or string
            const userAnswer = userAnswers.find(
              ua => ua.questionId.toString() === question._id.toString()
            );
            const correctAnswer = getCorrectAnswer(question);

            // If somehow no answer recorded (shouldn't happen), skip gracefully
            if (!userAnswer) return null;

            return (
              <div key={question._id} className="review-question">
                <h4>Question {index + 1}
                  <span className={`review-q-badge ${
                    userAnswer.selectedAnswer === 'SKIPPED'
                      ? 'badge-skipped'
                      : userAnswer.isCorrect
                      ? 'badge-correct'
                      : 'badge-incorrect'
                  }`}>
                    {userAnswer.selectedAnswer === 'SKIPPED'
                      ? 'Skipped'
                      : userAnswer.isCorrect
                      ? 'Correct'
                      : 'Incorrect'}
                  </span>
                </h4>

                <span className={`review-diff-tag diff-${question.difficulty.toLowerCase()}`}>
                  {question.difficulty}
                </span>

                <p className="question-text">{question.question}</p>

                {question.imageUrl && (
                  <div className="question-image">
                    <img src={question.imageUrl} alt="Question" />
                  </div>
                )}

                {question.type === 'MCQ' && question.options && (
                  <div className="review-answers">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer.selectedAnswer === option;
                      const isCorrectOption = correctAnswer === option;

                      let className = 'review-option';
                      if (isCorrectOption) className += ' correct-answer';
                      if (isUserAnswer && !isCorrectOption) className += ' user-incorrect';
                      if (isUserAnswer && isCorrectOption) className += ' user-correct';

                      return (
                        <div key={optIndex} className={className}>
                          <span className="option-label">{String.fromCharCode(65 + optIndex)}.</span>
                          {option}
                          {isUserAnswer && (
                            <span className="user-choice-indicator"> (Your choice)</span>
                          )}
                          {isCorrectOption && (
                            <span className="correct-indicator"> ✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {userAnswer.selectedAnswer === 'SKIPPED' && (
                  <div className="skipped-indicator">
                    <strong>You skipped this question</strong>
                    <div className="review-option correct-answer" style={{ marginTop: 8 }}>
                      <span className="option-label">✓</span> Correct answer: {correctAnswer}
                    </div>
                  </div>
                )}

                <div className={`review-result ${userAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
                  <strong>
                    {userAnswer.selectedAnswer === 'SKIPPED'
                      ? 'Skipped — 0 points'
                      : userAnswer.isCorrect
                      ? `Correct — +${userAnswer.points} points`
                      : `Incorrect — 0 / ${question.points} points`}
                  </strong>
                </div>

                {question.explanation && (
                  <div className="review-explanation">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}

                {question.solutionImageUrl && (
                  <div className="solution-image">
                    <img src={question.solutionImageUrl} alt="Solution" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="review-buttons">
          <button onClick={() => window.location.reload()}>Reattempt Quiz</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  };

  // ── Guards ───────────────────────────────────────────────
  if (loading || !quiz) return <div className="quiz-loading">Loading quiz...</div>;

  if (quiz.questions.length === 0) {
    return (
      <div className="quiz-intro-page">
        <div className="quiz-intro">
          <h2>No Questions Available</h2>
          <p>This quiz doesn't have enough questions yet. Please check back later.</p>
          <button className="start-btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // ── Intro screen ─────────────────────────────────────────
  if (intro) {
    const counts = getDifficultyCounts();
    return (
      <div className="quiz-intro-page">
        <div className="quiz-intro">
          <h2>
            {chapterName === 'common'
              ? `Course Challenge: ${moduleName.replace(/-/g, ' ').toUpperCase()}`
              : 'Course Challenge'}
          </h2>
          <p className="intro-subtitle">Ready for a challenge?</p>
          <p>Test your knowledge and earn points for what you already know!</p>
          <p>
            <strong>{quiz.questions.length} questions</strong> —
            {counts.easy > 0 && <span className="intro-diff easy"> {counts.easy} Easy</span>}
            {counts.medium > 0 && <span className="intro-diff medium"> · {counts.medium} Medium</span>}
            {counts.hard > 0 && <span className="intro-diff hard"> · {counts.hard} Hard</span>}
          </p>
          <p><em>Note: You get only one attempt per question.</em></p>
          <button className="start-btn" onClick={() => setIntro(false)}>Let's go</button>
        </div>
      </div>
    );
  }

  if (showReview) return renderReview();

  // ── Results screen ───────────────────────────────────────
  if (showResults) {
    const accuracy = Math.round((correctCount / quiz.questions.length) * 100);
    return (
      <div className="quiz-results">
        <h2>Quiz Completed! 🎉</h2>
        <div className="results-grid">
          <div className="result-stat">
            <span className="result-stat-value">{score}</span>
            <span className="result-stat-label">Points Scored</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">{correctCount}/{quiz.questions.length}</span>
            <span className="result-stat-label">Correct Answers</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">{accuracy}%</span>
            <span className="result-stat-label">Accuracy</span>
          </div>
        </div>
        <div className="result-buttons">
          <button onClick={() => setShowReview(true)}>Review Answers</button>
          <button onClick={() => window.location.reload()}>Reattempt</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // ── Quiz question screen ─────────────────────────────────
  const correctAnswer = getCorrectAnswer(currentQuestion!);

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-card">
          {/* Difficulty tag */}
          <span className={`q-diff-tag diff-${currentQuestion!.difficulty.toLowerCase()}`}>
            {currentQuestion!.difficulty}
          </span>

          <h3 className="question-text">{currentQuestion?.question}</h3>

          {currentQuestion?.imageUrl && (
            <div className="question-image">
              <img src={currentQuestion.imageUrl} alt="Question" />
            </div>
          )}

          <p className="instruction">Choose 1 answer:</p>

          <div className="options-list">
            {currentQuestion?.options?.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrectOption = correctAnswer === opt;

              let className = 'option-item';
              if (answered && isSelected) {
                className += isCorrectOption ? ' correct selected' : ' incorrect selected';
              } else if (answered && isCorrectOption) {
                className += ' correct'; // highlight correct even if student chose wrong
              } else if (isSelected) {
                className += ' selected';
              }

              return (
                <div key={i}>
                  <label className={className}>
                    <input
                      type="radio"
                      name="option"
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(opt)}
                      disabled={answered}
                    />
                    <span className="option-label">{String.fromCharCode(65 + i)}.</span> {opt}
                  </label>
                  {answered && isSelected && (
                    <div className={`explanation ${isCorrectOption ? 'correct' : 'incorrect'}`}>
                      <strong>{isCorrectOption ? 'Correct!' : 'Incorrect.'}</strong>
                      {!isCorrectOption && currentQuestion.explanation && (
                        <span> {currentQuestion.explanation}</span>
                      )}
                    </div>
                  )}
                  {answered && !isSelected && isCorrectOption && (
                    <div className="explanation correct">
                      <strong>This was the correct answer.</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="quiz-footer">
            <div className="progress">
              {currentIndex + 1} of {quiz.questions.length}
            </div>
            <div className="quiz-actions">
              {!answered && (
                <>
                  <button onClick={handleSkip} className="skip-btn">Skip</button>
                  <button
                    onClick={handleCheck}
                    className="check-btn"
                    disabled={!selectedOption}
                  >
                    Check
                  </button>
                </>
              )}
              {answered && (
                <button onClick={handleNext} className="check-btn">
                  {currentIndex + 1 === quiz.questions.length ? 'Finish' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterQuiz;