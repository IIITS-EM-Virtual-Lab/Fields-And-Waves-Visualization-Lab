import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken } from '../store/slices/authSlice';
import './ChapterQuiz.css';

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

const redirectMap: Record<string, string> = {
  'electrostatics/coulombs-law': '/electrostatics-intro',
  'electrostatics/electric-flux': '/electric-field-and-flux-density',
  'electrostatics/gradient': '/field-operations',
  'electrostatics/electric-potential': '/electric-potential',
  'electrostatics/electric-dipole': '/electric-dipole',

  'vector-algebra/scalars': '/scalars-and-vectors',
  'vector-algebra/addition': '/vector-addition',
  'vector-algebra/multiplication': '/vector-multiplication',
  'vector-algebra/triple-product': '/triple-product',
};

interface Quiz {
  _id: string;
  module: string;
  chapter: string;
  questions: Question[];
}

const ChapterQuiz = () => {
  const navigate = useNavigate();
  const { moduleName = '', chapterName = '' } = useParams<{ moduleName: string; chapterName: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [intro, setIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const url =
          !chapterName || chapterName === "common"
            ? `http://localhost:5000/api/quizzes/module/${moduleName}/common`
            : `http://localhost:5000/api/quizzes/module/${moduleName}/chapter/${chapterName}`;
        const res = await axios.get(url);
        setQuiz({
          _id: res.data.data._id,
          module: res.data.data.module,
          chapter: res.data.data.chapter,
          questions: res.data.data.questions,
        });

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
    if (!answered) {
      setSelectedOption(opt);
    }
  };

  const handleCheck = () => {
    if (!selectedOption || !currentQuestion || answered) return;
    
    const correctAnswer = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer[0]
      : currentQuestion.correctAnswer;
    
    const isAnswerCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(selectedOption)
      : currentQuestion.correctAnswer === selectedOption;

    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
    setShowResult(true);
    
    const points = isAnswerCorrect ? currentQuestion.points : 0;
    setScore(prev => prev + points);
    
    if (isAnswerCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Store user answer for review
    const userAnswer: UserAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer: selectedOption,
      isCorrect: isAnswerCorrect,
      points: points
    };
    
    setUserAnswers(prev => [...prev, userAnswer]);
  };

  const handleSkip = () => {
    if (!currentQuestion || answered) return;
    
    setSkipped(true);
    setAnswered(true);
    setShowResult(true);
    setIsCorrect(false);

    // Store skipped answer for review
    const userAnswer: UserAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer: 'SKIPPED',
      isCorrect: false,
      points: 0
    };
    
    setUserAnswers(prev => [...prev, userAnswer]);
  };

const submitQuizResult = async (finalScore: number, finalCorrectCount: number) => {
  console.log(currentUser);
  if (submitted || !currentUser?._id || !quiz?._id) {
    console.log('❌ Cannot submit: missing data or already submitted');
    return;
  }

  try {
    console.log('📤 Submitting quiz result:', {
      userId: currentUser._id,
      quizId: quiz._id,
      score: finalScore,
      correctAnswers: finalCorrectCount,
      totalQuestions: quiz.questions.length,
      userAnswers: userAnswers // Add user answers to submission
    });
    
    const response = await axios.post('http://localhost:5000/api/quizresult/save', {
  userId: currentUser._id,
  quizId: quiz._id,
  score: finalScore,
  correctAnswers: finalCorrectCount,
  totalQuestions: quiz.questions.length,
  accuracy: Math.round((finalCorrectCount / quiz.questions.length) * 100),
  module: quiz.module,
  chapter: quiz.chapter,
  userAnswers: userAnswers
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});


    setSubmitted(true);
    console.log('✅ Quiz result submitted successfully:', response.data);
  } catch (err) {
    console.error('❌ Error submitting quiz result:', err);
  }
};

  const handleNext = async () => {
    if (!quiz) return;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quiz.questions.length) {
      // Quiz completed - submit results
      console.log("submit");
      await submitQuizResult(score, correctCount);
      setShowResults(true);
      return;
    }

    // Reset states for next question
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setAnswered(false);
    setShowResult(false);
    setIsCorrect(false);
    setSkipped(false);
  };

  const getCorrectAnswer = (question: Question): string => {
    return Array.isArray(question.correctAnswer)
      ? question.correctAnswer[0]
      : question.correctAnswer;
  };

  const renderSkippedResult = () => {
    if (!skipped || !showResult) return null;

    return (
      <div className="result-feedback skipped">
        <strong>Question Skipped</strong>
      </div>
    );
  };

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
            const userAnswer = userAnswers[index];
            const correctAnswer = getCorrectAnswer(question);
            
            return (
              <div key={question._id} className="review-question">
                <h4>Question {index + 1}</h4>
                <p className="question-text">{question.question}</p>
                
                {question.imageUrl && (
                  <div className="question-image">
                    <img src={question.imageUrl} alt="Question" />
                  </div>
                )}
                
                <div className="review-answers">
                  {question.options?.map((option, optIndex) => {
                    const isUserAnswer = userAnswer.selectedAnswer === option;
                    const isCorrectAnswer = correctAnswer === option;
                    
                    let className = "review-option";
                    if (isCorrectAnswer) className += " correct-answer";
                    if (isUserAnswer && !isCorrectAnswer) className += " user-incorrect";
                    if (isUserAnswer && isCorrectAnswer) className += " user-correct";
                    
                    return (
                      <div key={optIndex} className={className}>
                        <span className="option-label">{String.fromCharCode(65 + optIndex)}.</span> {option}
                        {isUserAnswer && <span className="user-choice-indicator"> (Your choice)</span>}
                        {isCorrectAnswer && <span className="correct-indicator"> ✓</span>}
                      </div>
                    );
                  })}
                  
                  {userAnswer.selectedAnswer === 'SKIPPED' && (
                    <div className="skipped-indicator">
                      <strong>You skipped this question</strong>
                    </div>
                  )}
                </div>
                
                <div className={`review-result ${userAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
                  <strong>
                    {userAnswer.selectedAnswer === 'SKIPPED' ? 'Skipped' : 
                     userAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                  </strong>
                  <span className="points"> (+{userAnswer.points} points)</span>
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

  if (loading || !quiz) return <div>Loading...</div>;

  if (intro) {
    return (
      <div className="quiz-intro-page">
        <div className="quiz-intro">
          <h2>
            {chapterName === "common"
              ? `Course Challenge: ${moduleName.replace(/-/g, ' ').toUpperCase()}`
              : "Course Challenge"}
          </h2>
          <p className="intro-subtitle">Ready for a challenge?</p>
          <p>Test your knowledge and earn points for what you already know!</p>
          <p><strong>{quiz.questions.length} questions • 30–45 minutes</strong></p>
          <p><em>Note: You get only one attempt per question.</em></p>
          <button className="start-btn" onClick={() => setIntro(false)}>Let's go</button>
        </div>
      </div>
    );
  }

  if (showReview) {
    return renderReview();
  }

  if (showResults) {
    return (
      <div className="quiz-results">
        <h2>Quiz Completed!</h2>
        <p>Total Points Scored: <strong>{score}</strong></p>
        <p>Correct Answers: <strong>{correctCount} / {quiz.questions.length}</strong></p>
        <div className="result-buttons">
          <button onClick={() => setShowReview(true)}>Review Answers</button>
          <button onClick={() => window.location.reload()}>Reattempt</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-card">
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
              const correctAnswer = getCorrectAnswer(currentQuestion);
              const isCorrectOption = correctAnswer === opt;

              let className = "option-item";
              if (answered && isSelected) {
                className += isCorrectOption ? " correct selected" : " incorrect selected";
              } else if (isSelected) {
                className += " selected";
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