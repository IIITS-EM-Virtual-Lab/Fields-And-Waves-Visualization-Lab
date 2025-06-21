import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
}

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
  const [lockedOptions, setLockedOptions] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/module/${moduleName}/chapter/${chapterName}`);
        setQuiz(res.data.data);
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
    if (!correctOption && !lockedOptions.includes(opt)) {
      setSelectedOption(opt);
    }
  };

  const handleCheck = () => {
    if (!selectedOption || !currentQuestion) return;
    const isAnswer = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(selectedOption)
      : currentQuestion.correctAnswer === selectedOption;

    if (isAnswer) {
      setCorrectOption(selectedOption);
    } else {
      setLockedOptions(prev => [...prev, selectedOption]);
    }
    setSelectedOption(null);
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    const answer = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer[0]
      : currentQuestion.correctAnswer;
    setCorrectOption(answer);
    setSkipped(true);
  };

  const handleNext = () => {
    if (!quiz) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= quiz.questions.length) {
      navigate(`/quiz/${moduleName}/${chapterName}`);
      return;
    }
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setLockedOptions([]);
    setCorrectOption(null);
    setSkipped(false);
  };

  const renderExplanation = (opt: string) => {
    if (correctOption === opt) {
      return <div className="explanation correct"><strong>Correct:</strong> {currentQuestion?.explanation}</div>;
    } else if (lockedOptions.includes(opt)) {
      return <div className="explanation incorrect"><strong>Incorrect.</strong> Try again.</div>;
    }
    return null;
  };

  if (loading || !quiz) return <div>Loading...</div>;

  if (intro) {
    return (
      <div className="quiz-intro-page">
        <div className="quiz-intro">
          <h2>Course Challenge</h2>
          <p className="intro-subtitle">Ready for a challenge?</p>
          <p>Test your knowledge and earn points for what you already know!</p>
          <p><strong>{quiz.questions.length} questions • 30–45 minutes</strong></p>
          <button className="start-btn" onClick={() => setIntro(false)}>Let’s go</button>
        </div>
        <footer className="footer">
          © 2025 Virtual Electromagnetics Laboratory, IIIT Sri City. All Rights Reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h2 className="quiz-heading">Course Challenge</h2>

      <div className="quiz-container">
        <div className="quiz-card">
          <h3 className="question-text">{currentQuestion?.question}</h3>

          <p className="instruction">Choose 1 answer:</p>
          <div className="options-list">
            {currentQuestion?.options?.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isLocked = lockedOptions.includes(opt);
              const isCorrect = correctOption === opt;

              let className = "option-item";
              if (isCorrect) className += " correct selected";
              else if (isLocked) className += " incorrect selected";
              else if (isSelected) className += " selected";

              return (
                <div key={i}>
                  <label className={className}>
                    <input
                      type="radio"
                      name="option"
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(opt)}
                      disabled={isLocked || !!correctOption}
                    />
                    <span className="option-label">{String.fromCharCode(65 + i)}.</span> {opt}
                  </label>
                  {renderExplanation(opt)}
                </div>
              );
            })}
          </div>

          <div className="quiz-footer">
            <div className="progress">
              {currentIndex + 1} of {quiz.questions.length}
            </div>
            <div className="quiz-actions">
              {!correctOption && (
                <button onClick={handleSkip} className="skip-btn">Skip</button>
              )}
              {(correctOption || skipped) ? (
                <button onClick={handleNext} className="check-btn">
                  {currentIndex + 1 === quiz.questions.length ? 'Done' : 'Next'}
                </button>
              ) : (
                <button onClick={handleCheck} className="check-btn" disabled={!selectedOption}>
                  Check
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
