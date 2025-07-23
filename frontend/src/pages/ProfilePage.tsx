import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FaUser, FaCog, FaSignOutAlt, FaUsers, FaTrash, FaUserShield, FaQuestionCircle, FaEdit, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './ProfilePage.css';

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

interface Quiz {
  _id: string;
  module: string;
  chapter: string;
  questions: Question[];
}

const ProfilePage = () => {
  const { client, token } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz management states
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<'MCQ' | 'BLANK'>('MCQ');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const modules = [
    'electrostatics',
    'maxwell-equations',
    'vector-algebra',
    'vector-calculus',
    'wave-propagation'
  ];

  const moduleChapters: { [key: string]: string[] } = {
    'electrostatics': [
      'coulombs-law',
      'electric-dipole',
      'electric-flux',
      'electric-potential',
      'gauss-law',
      'gradient'
    ],
    'maxwell-equations': [
      'amperes-law',
      'displacement-current',
      'emfs',
      'faradays-law',
      'gauss-law-contd',
      'gauss-law-magnetism',
      'time-varying-potential'
    ],
    'vector-algebra': [
      'addition',
      'multiplication',
      'scalars',
      'triple-product'
    ],
    'vector-calculus': [
      'cylindrical-coordinates',
      'del-operator',
      'spherical-coordinates',
      'vector-calculus-intro'
    ],
    'wave-propagation': [
      'pow_vector',
      'wave_analysis',
      'wave_reflection',
      'waves_in_general'
    ]
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    ...(client?.isAdmin ? [
      { id: 'users', label: 'Users', icon: <FaUsers /> },
      { id: 'quizzes', label: 'Quizzes', icon: <FaQuestionCircle /> }
    ] : []),
    { id: 'Feedback', label: 'Feedback', icon: <FaCog /> },
  ];

  useEffect(() => {
    if (activeTab === 'users' && client?.isAdmin) {
      fetchUsers();
    }
  }, [activeTab, client?.isAdmin]);

  useEffect(() => {
    if (activeTab === 'quizzes' && selectedModule && selectedChapter) {
      fetchChapterQuiz();
    }
  }, [activeTab, selectedModule, selectedChapter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Token being sent:', token);
      console.log('Token type:', typeof token);
      console.log('Token length:', token ? token.length : 0);
      
      const response = await axios.get('https://fields-and-waves-visualization-lab.onrender.com/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
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
    ? `https://fields-and-waves-visualization-lab.onrender.com/api/quizzes/module/${selectedModule}/common`
    : `https://fields-and-waves-visualization-lab.onrender.com/api/quizzes/module/${selectedModule}/chapter/${selectedChapter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCurrentQuiz(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Quiz doesn't exist, create it
        try {
          const createResponse = await axios.post(
            'https://fields-and-waves-visualization-lab.onrender.com/api/quizzes',
            {
              module: selectedModule,
              chapter: selectedChapter === '__module__' ? '' : selectedChapter,
              questions: []
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setCurrentQuiz(createResponse.data.data);
        } catch (createErr: any) {
          console.error('Create error response:', createErr.response); // Debug log
          setError('Failed to create quiz');
          console.error('Error creating quiz:', createErr);
        }
      } else {
        setError('Failed to fetch quiz');
        console.error('Error fetching quiz:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`https://fields-and-waves-visualization-lab.onrender.com/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    try {
      await axios.patch(`https://fields-and-waves-visualization-lab.onrender.com/api/users/${userId}/toggle-admin`, 
        { isAdmin: !currentAdminStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin: !currentAdminStatus } : user
      ));
    } catch (err) {
      console.error('Error toggling admin status:', err);
      alert('Failed to update admin status');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentQuiz || !window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(
        `https://fields-and-waves-visualization-lab.onrender.com/api/quizzes/${currentQuiz._id}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCurrentQuiz(prev => prev ? {
        ...prev,
        questions: prev.questions.filter(q => q._id !== questionId)
      } : null);
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question');
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddQuestion = async (questionData: FormData) => {
    if (!currentQuiz) return;

    try {
      await axios.post(
        `https://fields-and-waves-visualization-lab.onrender.com/api/quizzes/${currentQuiz._id}/questions`,
        questionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Reset states
      setImagePreview(null);
      
      // Refresh quiz data
      fetchChapterQuiz();
      setShowAddQuestion(false);
      setEditingQuestion(null);
    } catch (err) {
      console.error('Error saving question:', err);
      alert('Failed to save question');
    }
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
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setSelectedChapter(''); // Reset chapter when module changes
            }}
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
  Questions for{" "}
  {selectedChapter === "__module__"
    ? `${selectedModule.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} (Entire Module)`
    : selectedChapter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
</h3>

              <button 
                className="add-question-btn"
                onClick={() => {
                  setEditingQuestion(null);
                  setShowAddQuestion(true);
                }}
              >
                <FaPlus /> Add Question
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
              <div className="loading">Loading questions...</div>
            ) : currentQuiz ? (
              <div className="questions-list">
                {currentQuiz.questions.map(question => (
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
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-questions">
                <p>No questions available for this chapter. Click "Add Question" to create one.</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Question Modal */}
        {showAddQuestion && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowAddQuestion(false);
                    setEditingQuestion(null);
                  }}
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
              
              {/* Question Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const questionImageInput = e.currentTarget.querySelector('input[name="questionImage"]') as HTMLInputElement;
                const solutionImageInput = e.currentTarget.querySelector('input[name="solutionImage"]') as HTMLInputElement;
                
               const explanationValue = (formData.get('explanation') as string)?.trim();

const questionData = {
  type: newQuestionType,
  question: formData.get('question') as string,
  options: newQuestionType === 'MCQ'
    ? (formData.get('options') as string).split('\n').filter(Boolean)
    : [],
  correctAnswer: newQuestionType === 'MCQ'
    ? formData.get('correctAnswer') as string
    : (formData.get('correctAnswer') as string).split('\n').filter(Boolean),
  explanation: explanationValue || '', // If empty, set as ''
  difficulty: formData.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD',
  points: Number(formData.get('points'))
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

                if (questionImageInput?.files?.[0]) {
                  apiFormData.append('questionImage', questionImageInput.files[0]);
                }
                if (solutionImageInput?.files?.[0]) {
                  apiFormData.append('solutionImage', solutionImageInput.files[0]);
                }

                handleAddQuestion(apiFormData);
              }}>
                <textarea
                  name="question"
                  placeholder="Enter your question"
                  defaultValue={editingQuestion?.question}
                  required
                />
                
                {newQuestionType === 'MCQ' && (
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
                
                {newQuestionType === 'BLANK' && (
                  <textarea
                    name="correctAnswer"
                    placeholder="Enter possible answers (one per line)"
                    defaultValue={Array.isArray(editingQuestion?.correctAnswer) ? 
                      editingQuestion.correctAnswer.join('\n') : ''}
                    required
                  />
                )}

                <textarea
                  name="explanation"
                  placeholder="Enter explanation for the correct answer"
                  defaultValue={editingQuestion?.explanation}
                />

                <select
                  name="difficulty"
                  defaultValue={editingQuestion?.difficulty || 'EASY'}
                  required
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                
                <input
                  type="number"
                  name="points"
                  placeholder="Points"
                  defaultValue={editingQuestion?.points || 1}
                  min="1"
                  required
                />

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
                    onClick={() => {
                      setShowAddQuestion(false);
                      setEditingQuestion(null);
                    }}
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
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{client?.name}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{client?.email}</span>
                </div>
                <div className="detail-item">
                  <label>Role:</label>
                  <span>{client?.isAdmin ? 'Administrator' : 'User'}</span>
                </div>
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
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                        <td className="action-buttons">
                          <button
                            className={`action-button toggle-admin ${user.isAdmin ? 'disabled' : ''}`}
                            onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                            title={user.isAdmin ? "User is already an admin" : "Make Admin"}
                            disabled={user.isAdmin}
                          >
                            <FaUserShield />
                          </button>
                          <button
                            className={`action-button delete ${user.isAdmin ? 'disabled' : ''}`}
                            onClick={() => handleDeleteUser(user._id)}
                            title={user.isAdmin ? "Cannot delete admin user" : "Delete User"}
                            disabled={user.isAdmin}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'quizzes':
        return renderQuizManagement();
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <div className="sidebar-items">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
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