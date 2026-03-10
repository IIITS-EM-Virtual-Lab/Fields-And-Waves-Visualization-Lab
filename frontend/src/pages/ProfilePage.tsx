import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FaUser, FaCog, FaUsers, FaTrash, FaUserShield, FaQuestionCircle, FaEdit, FaPlus, FaBars, FaTimes, FaRobot, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import axios from 'axios';
import './ProfilePage.css';

const API = 'https://fields-and-waves-visualization-lab.onrender.com';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

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

// A generated question from AI — no _id yet, not saved
interface AIQuestion {
  type: 'MCQ';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
}

interface Quiz {
  _id: string;
  module: string;
  chapter: string;
  questions: Question[];
}

interface FeedbackEntry {
  _id: string;
  name: string;
  designation: string;
  institute: string;
  query: string;
  suggestion?: string;
  platformDiscovery?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const { client, token } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);

  // Quiz management states
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<'MCQ' | 'BLANK'>('MCQ');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ── AI Assistant states ──────────────────────────────────
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [aiCount, setAiCount] = useState(5);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  // Each entry: { question: AIQuestion, editing: boolean, saving: boolean, saved: boolean, discarded: boolean }
  const [aiCards, setAiCards] = useState<{
    question: AIQuestion;
    editing: boolean;
    saving: boolean;
    saved: boolean;
    discarded: boolean;
  }[]>([]);
  // ────────────────────────────────────────────────────────

  const modules = [
    'electrostatics',
    'maxwell-equations',
    'vector-algebra',
    'vector-calculus',
    'wave-propagation'
  ];

  const moduleChapters: { [key: string]: string[] } = {
    'electrostatics': ['coulombs-law', 'electric-dipole', 'electric-flux', 'electric-potential', 'gauss-law', 'gradient'],
    'maxwell-equations': ['amperes-law', 'displacement-current', 'emfs', 'faradays-law', 'gauss-law-contd', 'gauss-law-magnetism', 'time-varying-potential'],
    'vector-algebra': ['addition', 'multiplication', 'scalars', 'triple-product'],
    'vector-calculus': ['cylindrical-coordinates', 'del-operator', 'spherical-coordinates', 'vector-calculus-intro'],
    'wave-propagation': ['pow_vector', 'wave_analysis', 'wave_reflection', 'waves_in_general']
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    ...(client?.isAdmin ? [
      { id: 'users', label: 'Users', icon: <FaUsers /> },
      { id: 'quizzes', label: 'Quizzes', icon: <FaQuestionCircle /> }
    ] : []),
    { id: 'feedback', label: 'Feedback', icon: <FaCog /> },
  ];

  useEffect(() => {
    if (activeTab === 'users' && client?.isAdmin) fetchUsers();
  }, [activeTab, client?.isAdmin]);

  useEffect(() => {
    if (activeTab === 'quizzes' && selectedModule && selectedChapter) fetchChapterQuiz();
  }, [activeTab, selectedModule, selectedChapter]);

  useEffect(() => {
    if (activeTab === 'feedback') fetchFeedback();
  }, [activeTab]);

  // Close sidebar on tab switch (mobile)
  useEffect(() => { setSidebarOpen(false); }, [activeTab]);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API}/api/feedback`);
      setFeedbackList(response.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        selectedChapter === '__module__'
          ? `${API}/api/quizzes/module/${selectedModule}/common`
          : `${API}/api/quizzes/module/${selectedModule}/chapter/${selectedChapter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentQuiz(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const createResponse = await axios.post(
            `${API}/api/quizzes`,
            { module: selectedModule, chapter: selectedChapter === '__module__' ? '' : selectedChapter, questions: [] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCurrentQuiz(createResponse.data.data);
        } catch {
          setError('Failed to create quiz');
        }
      } else {
        setError('Failed to fetch quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch {
      alert('Failed to delete user');
    }
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    try {
      await axios.patch(
        `${API}/api/users/${userId}/toggle-admin`,
        { isAdmin: !currentAdminStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user =>
        user._id === userId ? { ...user, isAdmin: !currentAdminStatus } : user
      ));
    } catch {
      alert('Failed to update admin status');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentQuiz || !window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axios.delete(
        `${API}/api/quizzes/${currentQuiz._id}/questions/${questionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentQuiz(prev => prev ? {
        ...prev,
        questions: prev.questions.filter(q => q._id !== questionId)
      } : null);
    } catch {
      alert('Failed to delete question');
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  const handleAddQuestion = async (questionData: FormData) => {
    if (!currentQuiz) return;
    try {
      await axios.post(
        `${API}/api/quizzes/${currentQuiz._id}/questions`,
        questionData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setImagePreview(null);
      fetchChapterQuiz();
      setShowAddQuestion(false);
      setEditingQuestion(null);
    } catch {
      alert('Failed to save question');
    }
  };

  // ── AI Assistant handlers ──────────────────────────────────

  const handleGenerateQuestions = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic first.');
      return;
    }
    if (!currentQuiz) {
      setAiError('Please select a module and chapter first.');
      return;
    }
    setAiError('');
    setAiGenerating(true);
    setAiCards([]);

    try {
      const topicWithContext = selectedChapter && selectedChapter !== '__module__'
        ? `${aiTopic} (in the context of ${selectedChapter.replace(/-/g, ' ')})`
        : aiTopic;

      const response = await axios.post(
        `${API}/api/quizzes/generate-questions`,
        {
          topic: topicWithContext,
          difficulty: aiDifficulty,
          count: aiCount,
          module: selectedModule,
          chapter: selectedChapter === '__module__' ? '' : selectedChapter
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const generated: AIQuestion[] = response.data.data;
      setAiCards(generated.map(q => ({
        question: q,
        editing: false,
        saving: false,
        saved: false,
        discarded: false
      })));
    } catch (err: any) {
      setAiError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Update a field inside an AI card while the admin is editing it
  const updateAICard = (index: number, field: keyof AIQuestion, value: any) => {
    setAiCards(prev => prev.map((card, i) => {
      if (i !== index) return card;
      return { ...card, question: { ...card.question, [field]: value } };
    }));
  };

  const updateAICardOption = (cardIndex: number, optionIndex: number, value: string) => {
    setAiCards(prev => prev.map((card, i) => {
      if (i !== cardIndex) return card;
      const newOptions = [...card.question.options];
      newOptions[optionIndex] = value;
      return { ...card, question: { ...card.question, options: newOptions } };
    }));
  };

  const toggleAICardEditing = (index: number) => {
    setAiCards(prev => prev.map((card, i) =>
      i === index ? { ...card, editing: !card.editing } : card
    ));
  };

  const discardAICard = (index: number) => {
    setAiCards(prev => prev.map((card, i) =>
      i === index ? { ...card, discarded: true } : card
    ));
  };

  // Save a single AI-generated question to the actual pool
  const saveAIQuestion = async (index: number) => {
    if (!currentQuiz) return;
    const card = aiCards[index];
    if (!card || card.saved || card.discarded) return;

    setAiCards(prev => prev.map((c, i) => i === index ? { ...c, saving: true } : c));

    try {
      const formData = new FormData();
      formData.append('type', 'MCQ');
      formData.append('question', card.question.question);
      formData.append('options', JSON.stringify(card.question.options));
      formData.append('correctAnswer', JSON.stringify(card.question.correctAnswer));
      formData.append('explanation', card.question.explanation);
      formData.append('difficulty', card.question.difficulty);
      formData.append('points', String(card.question.points));

      await axios.post(
        `${API}/api/quizzes/${currentQuiz._id}/questions`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      setAiCards(prev => prev.map((c, i) => i === index ? { ...c, saving: false, saved: true } : c));
      // Refresh the question list so admin sees it immediately
      fetchChapterQuiz();
    } catch {
      setAiCards(prev => prev.map((c, i) => i === index ? { ...c, saving: false } : c));
      alert('Failed to save this question. Please try again.');
    }
  };

  // Accept all remaining (not discarded, not saved) at once
  const saveAllAIQuestions = async () => {
    const pending = aiCards.map((c, i) => ({ c, i })).filter(({ c }) => !c.saved && !c.discarded);
    for (const { i } of pending) {
      await saveAIQuestion(i);
    }
  };

  // ── Render helpers ──────────────────────────────────────────

  const renderAIPanel = () => {
    if (!showAIPanel) return null;

    const activeCards = aiCards.filter(c => !c.discarded);
    const savedCount = aiCards.filter(c => c.saved).length;
    const pendingCount = aiCards.filter(c => !c.saved && !c.discarded).length;

    return (
      <div className="ai-panel">
        <div className="ai-panel-header">
          <div className="ai-panel-title">
            <FaRobot className="ai-icon" />
            <h3>AI Question Generator</h3>
          </div>
          <button className="ai-panel-close" onClick={() => { setShowAIPanel(false); setAiCards([]); setAiError(''); }}>
            <FaTimes />
          </button>
        </div>

        <div className="ai-panel-form">
          <div className="ai-form-row">
            <div className="ai-form-group">
              <label>Topic / Prompt</label>
              <input
                type="text"
                className="ai-input"
                placeholder={`e.g. "Coulomb's law with vector calculations", "Electric potential energy"`}
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerateQuestions()}
              />
            </div>
          </div>

          <div className="ai-form-row ai-form-row-inline">
            <div className="ai-form-group">
              <label>Difficulty</label>
              <select
                className="ai-select"
                value={aiDifficulty}
                onChange={e => setAiDifficulty(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
              >
                <option value="EASY">Easy (1 pt)</option>
                <option value="MEDIUM">Medium (2 pts)</option>
                <option value="HARD">Hard (3 pts)</option>
              </select>
            </div>

            <div className="ai-form-group">
              <label>Number of Questions</label>
              <select
                className="ai-select"
                value={aiCount}
                onChange={e => setAiCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 8, 10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <button
              className="ai-generate-btn"
              onClick={handleGenerateQuestions}
              disabled={aiGenerating || !aiTopic.trim()}
            >
              {aiGenerating ? (
                <><span className="ai-spinner" /> Generating…</>
              ) : (
                <><FaRobot /> Generate</>
              )}
            </button>
          </div>

          {aiError && <div className="ai-error">{aiError}</div>}
        </div>

        {/* Generated question cards */}
        {aiCards.length > 0 && (
          <div className="ai-cards-section">
            <div className="ai-cards-summary">
              <span>{savedCount} saved · {pendingCount} pending · {aiCards.filter(c => c.discarded).length} discarded</span>
              {pendingCount > 0 && (
                <button className="ai-save-all-btn" onClick={saveAllAIQuestions}>
                  <FaCheck /> Accept All Remaining
                </button>
              )}
            </div>

            <div className="ai-cards-list">
              {aiCards.map((card, index) => {
                if (card.discarded) return null;

                return (
                  <div
                    key={index}
                    className={`ai-card ${card.saved ? 'ai-card-saved' : ''} ${card.editing ? 'ai-card-editing' : ''}`}
                  >
                    {/* Card status badge */}
                    {card.saved && <div className="ai-card-badge ai-badge-saved">✓ Saved to pool</div>}

                    <div className="ai-card-meta">
                      <span className={`ai-diff-badge diff-${card.question.difficulty.toLowerCase()}`}>
                        {card.question.difficulty}
                      </span>
                      <span className="ai-points-badge">{card.question.points} pts</span>
                      <span className="ai-card-num">Q{index + 1}</span>
                    </div>

                    {card.editing ? (
                      /* ── Edit mode ── */
                      <div className="ai-card-edit-form">
                        <label>Question</label>
                        <textarea
                          className="ai-edit-input"
                          value={card.question.question}
                          onChange={e => updateAICard(index, 'question', e.target.value)}
                          rows={3}
                        />

                        <label>Options</label>
                        {card.question.options.map((opt, oi) => (
                          <div key={oi} className="ai-option-edit-row">
                            <span className="ai-option-letter">{String.fromCharCode(65 + oi)}.</span>
                            <input
                              className="ai-edit-input"
                              value={opt}
                              onChange={e => updateAICardOption(index, oi, e.target.value)}
                            />
                          </div>
                        ))}

                        <label>Correct Answer (must match one option exactly)</label>
                        <select
                          className="ai-select"
                          value={card.question.correctAnswer}
                          onChange={e => updateAICard(index, 'correctAnswer', e.target.value)}
                        >
                          {card.question.options.map((opt, oi) => (
                            <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}. {opt}</option>
                          ))}
                        </select>

                        <label>Explanation</label>
                        <textarea
                          className="ai-edit-input"
                          value={card.question.explanation}
                          onChange={e => updateAICard(index, 'explanation', e.target.value)}
                          rows={2}
                        />

                        <div className="ai-edit-row-inline">
                          <div>
                            <label>Difficulty</label>
                            <select
                              className="ai-select"
                              value={card.question.difficulty}
                              onChange={e => {
                                const d = e.target.value as 'EASY' | 'MEDIUM' | 'HARD';
                                const pts = d === 'EASY' ? 1 : d === 'MEDIUM' ? 2 : 3;
                                updateAICard(index, 'difficulty', d);
                                updateAICard(index, 'points', pts);
                              }}
                            >
                              <option value="EASY">Easy</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HARD">Hard</option>
                            </select>
                          </div>
                          <div>
                            <label>Points</label>
                            <input
                              type="number"
                              className="ai-edit-input"
                              value={card.question.points}
                              min={1}
                              onChange={e => updateAICard(index, 'points', Number(e.target.value))}
                            />
                          </div>
                        </div>

                        <button
                          className="ai-done-edit-btn"
                          onClick={() => toggleAICardEditing(index)}
                        >
                          Done Editing
                        </button>
                      </div>
                    ) : (
                      /* ── View mode ── */
                      <div className="ai-card-view">
                        <p className="ai-card-question">{card.question.question}</p>
                        <div className="ai-card-options">
                          {card.question.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`ai-card-option ${opt === card.question.correctAnswer ? 'ai-option-correct' : ''}`}
                            >
                              <span className="ai-option-letter">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                              {opt === card.question.correctAnswer && <span className="ai-correct-mark"> ✓</span>}
                            </div>
                          ))}
                        </div>
                        {card.question.explanation && (
                          <div className="ai-card-explanation">
                            <strong>Explanation:</strong> {card.question.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card action buttons — hidden once saved */}
                    {!card.saved && (
                      <div className="ai-card-actions">
                        <button
                          className="ai-btn-edit"
                          onClick={() => toggleAICardEditing(index)}
                          title="Edit this question before saving"
                        >
                          <FaEdit /> {card.editing ? 'Preview' : 'Edit'}
                        </button>
                        <button
                          className="ai-btn-save"
                          onClick={() => saveAIQuestion(index)}
                          disabled={card.saving}
                          title="Add to question pool"
                        >
                          {card.saving ? <><span className="ai-spinner" /> Saving…</> : <><FaCheck /> Accept</>}
                        </button>
                        <button
                          className="ai-btn-discard"
                          onClick={() => discardAICard(index)}
                          title="Discard this question"
                        >
                          <FaX /> Discard
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuizManagement = () => {
    if (!client?.isAdmin) return null;

    return (
      <div className="quiz-management">
        <h2>Quiz Management</h2>

        {/* Module and Chapter Selection */}
        <div className="quiz-selection">
          <select
            value={selectedModule}
            onChange={(e) => { setSelectedModule(e.target.value); setSelectedChapter(''); }}
            className="module-select"
          >
            <option value="">Select Module</option>
            {modules.map(module => (
              <option key={module} value={module}>
                {module.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="chapter-select"
            disabled={!selectedModule}
          >
            <option value="">Select Chapter</option>
            <option value="__module__">Common Quiz for Entire Module</option>
            {selectedModule && moduleChapters[selectedModule]?.map(chapter => (
              <option key={chapter} value={chapter}>
                {chapter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Content */}
        {selectedModule && selectedChapter && (
          <div className="quiz-content">
            <div className="quiz-header">
              <h3>
                Questions for{' '}
                {selectedChapter === '__module__'
                  ? `${selectedModule.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} (Entire Module)`
                  : selectedChapter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                }
              </h3>

              <div className="quiz-header-actions">
                {/* AI Assistant button */}
                <button
                  className={`ai-assistant-btn ${showAIPanel ? 'ai-assistant-btn-active' : ''}`}
                  onClick={() => { setShowAIPanel(!showAIPanel); setAiCards([]); setAiError(''); }}
                  title="Generate questions with AI"
                >
                  <FaRobot /> AI Assistant
                </button>

                {/* Existing Add Question button */}
                <button
                  className="add-question-btn"
                  onClick={() => { setEditingQuestion(null); setShowAddQuestion(true); }}
                >
                  <FaPlus /> Add Question
                </button>
              </div>
            </div>

            {/* AI Panel — renders just below the header, above question list */}
            {renderAIPanel()}

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Loading questions...</div>
            ) : currentQuiz ? (
              <div className="questions-list">
                {currentQuiz.questions.length === 0 ? (
                  <div className="no-questions">
                    <p>No questions yet. Use <strong>AI Assistant</strong> to generate some, or click <strong>Add Question</strong> to add manually.</p>
                  </div>
                ) : (
                  currentQuiz.questions.map(question => (
                    <div key={question._id} className="question-card">
                      <div className="question-header">
                        <span className="question-type">{question.type}</span>
                        <span className="question-difficulty">{question.difficulty}</span>
                        <span className="question-points">{question.points} points</span>
                      </div>
                      <p className="question-text">{question.question}</p>
                      {question.imageUrl && (
                        <div className="question-image">
                          <img src={question.imageUrl} alt="Question" />
                        </div>
                      )}
                      {question.solutionImageUrl && (
                        <div className="solution-image">
                          <img src={question.solutionImageUrl} alt="Solution" />
                        </div>
                      )}
                      {question.type === 'MCQ' && question.options && (
                        <div className="question-options">
                          {question.options.map((option, index) => (
                            <div key={index} className="option">
                              {String.fromCharCode(65 + index)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="question-actions">
                        <button className="edit-btn" onClick={() => handleEditQuestion(question)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteQuestion(question._id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="no-questions">
                <p>No questions available for this chapter. Click "Add Question" to create one.</p>
              </div>
            )}
          </div>
        )}

        {/* Manual Add/Edit Question Modal — unchanged */}
        {showAddQuestion && (
          <div className="modal" role="dialog" aria-modal="true" aria-label={editingQuestion ? 'Edit Question' : 'Add Question'}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                <button
                  className="close-btn"
                  aria-label="Close"
                  onClick={() => { setShowAddQuestion(false); setEditingQuestion(null); }}
                >
                  ×
                </button>
              </div>

              <select
                value={editingQuestion?.type || newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value as 'MCQ' | 'BLANK')}
                disabled={!!editingQuestion}
                className="question-type-select"
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="BLANK">Fill in the Blank</option>
              </select>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const questionData = {
                    type: editingQuestion?.type || newQuestionType,
                    question: (formData.get('question') as string) || '',
                    options:
                      (editingQuestion?.type || newQuestionType) === 'MCQ'
                        ? ((formData.get('options') as string) || '').split('\n').map(s => s.trim()).filter(Boolean)
                        : [],
                    correctAnswer:
                      (editingQuestion?.type || newQuestionType) === 'MCQ'
                        ? (formData.get('correctAnswer') as string)
                        : ((formData.get('correctAnswer') as string) || '').split('\n').map(s => s.trim()).filter(Boolean),
                    explanation: ((formData.get('explanation') as string) || '').trim(),
                    difficulty: formData.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD',
                    points: Number(formData.get('points') || 1),
                  };

                  const apiFormData = new FormData();
                  Object.entries(questionData).forEach(([key, value]) => {
                    if ((key === 'options' || key === 'correctAnswer') && value !== undefined) {
                      apiFormData.append(key, JSON.stringify(value));
                    } else if (value !== undefined) {
                      if (key === 'explanation' && !value) return;
                      apiFormData.append(key, value as string);
                    }
                  });

                  const questionImageInput = e.currentTarget.querySelector('input[name="questionImage"]') as HTMLInputElement;
                  const solutionImageInput = e.currentTarget.querySelector('input[name="solutionImage"]') as HTMLInputElement;
                  if (questionImageInput?.files?.[0]) apiFormData.append('questionImage', questionImageInput.files[0]);
                  if (solutionImageInput?.files?.[0]) apiFormData.append('solutionImage', solutionImageInput.files[0]);

                  handleAddQuestion(apiFormData);
                }}
              >
                <textarea name="question" placeholder="Enter your question" defaultValue={editingQuestion?.question} required />

                {(editingQuestion?.type || newQuestionType) === 'MCQ' && (
                  <>
                    <textarea
                      name="options"
                      placeholder="Enter options (one per line)"
                      defaultValue={editingQuestion?.options?.join('\n')}
                      required
                    />
                    <input
                      type="text"
                      name="correctAnswer"
                      placeholder="Enter correct answer"
                      defaultValue={editingQuestion?.correctAnswer as string}
                      required
                    />
                  </>
                )}

                {(editingQuestion?.type || newQuestionType) === 'BLANK' && (
                  <textarea
                    name="correctAnswer"
                    placeholder="Enter possible answers (one per line)"
                    defaultValue={Array.isArray(editingQuestion?.correctAnswer) ? editingQuestion.correctAnswer.join('\n') : ''}
                    required
                  />
                )}

                <textarea
                  name="explanation"
                  placeholder="Enter explanation for the correct answer"
                  defaultValue={editingQuestion?.explanation}
                />

                <select name="difficulty" defaultValue={editingQuestion?.difficulty || 'EASY'} required>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>

                <input type="number" name="points" placeholder="Points" defaultValue={editingQuestion?.points || 1} min="1" required />

                <label>
                  Upload Question Image:
                  <input type="file" name="questionImage" accept="image/*" />
                </label>

                <label>
                  Upload Solution Image:
                  <input type="file" name="solutionImage" accept="image/*" />
                </label>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => { setShowAddQuestion(false); setEditingQuestion(null); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFeedback = () => (
    <div className="feedback-content">
      <h2>Received Feedback</h2>
      {feedbackList.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <div className="feedback-list">
          {feedbackList.map((entry) => (
            <div key={entry._id} className="feedback-card">
              <h3>{entry.name} ({entry.designation})</h3>
              <p><strong>Institute:</strong> {entry.institute}</p>
              <p><strong>Query:</strong> {entry.query}</p>
              {entry.suggestion && <p><strong>Suggestion:</strong> {entry.suggestion}</p>}
              {entry.platformDiscovery && <p><strong>Found us via:</strong> {entry.platformDiscovery}</p>}
              <p className="timestamp">Submitted on {new Date(entry.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-content">
            <h2>Profile Information</h2>
            <div className="profile-info">
              <div className="profile-avatar">
                {client?.profilePicture ? (
                  <img src={client.profilePicture} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {client?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-details">
                <div className="detail-item"><label>Name:</label><span>{client?.name}</span></div>
                <div className="detail-item"><label>Email:</label><span>{client?.email}</span></div>
                <div className="detail-item"><label>Role:</label><span>{client?.isAdmin ? 'Administrator' : 'User'}</span></div>
              </div>
            </div>
          </div>
        );
      case 'users':
        if (!client?.isAdmin) return null;
        return (
          <div className="users-content">
            <h2>User Management</h2>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="users-table-container">
                <table className="users-table" role="table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td data-label="Name">{user.name}</td>
                        <td data-label="Email">{user.email}</td>
                        <td data-label="Role">{user.isAdmin ? 'Admin' : 'User'}</td>
                        <td data-label="Actions" className="action-buttons">
                          <button className={`action-button toggle-admin ${user.isAdmin ? 'disabled' : ''}`} onClick={() => handleToggleAdmin(user._id, user.isAdmin)} title={user.isAdmin ? "User is already an admin" : "Make Admin"} disabled={user.isAdmin}>
                            <FaUserShield />
                          </button>
                          <button className={`action-button delete ${user.isAdmin ? 'disabled' : ''}`} onClick={() => handleDeleteUser(user._id)} title={user.isAdmin ? "Cannot delete admin user" : "Delete User"} disabled={user.isAdmin}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="users-cards">
                  {users.map(user => (
                    <div key={user._id} className="user-card">
                      <div className="uc-row"><span>Name</span><strong>{user.name}</strong></div>
                      <div className="uc-row"><span>Email</span><strong>{user.email}</strong></div>
                      <div className="uc-row"><span>Role</span><strong>{user.isAdmin ? 'Admin' : 'User'}</strong></div>
                      <div className="uc-actions">
                        <button className={`action-button toggle-admin ${user.isAdmin ? 'disabled' : ''}`} onClick={() => handleToggleAdmin(user._id, user.isAdmin)} disabled={user.isAdmin}><FaUserShield /></button>
                        <button className={`action-button delete ${user.isAdmin ? 'disabled' : ''}`} onClick={() => handleDeleteUser(user._id)} disabled={user.isAdmin}><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'quizzes':
        return renderQuizManagement();
      case 'feedback':
        return renderFeedback();
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="mobile-topbar">
        <button className="hamburger-btn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
          <FaBars />
        </button>
        <h1 className="topbar-title">Dashboard</h1>
      </div>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar-btn" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-items">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;