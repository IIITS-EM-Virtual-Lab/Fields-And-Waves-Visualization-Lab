import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../store/slices/authSlice";
import axios from "axios";

interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
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

interface QuizHistoryItem {
  _id: string;
  quizId: {
    _id: string;
    module: string;
    chapter: string;
    questions: Question[];
  };
  quizName?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  userAnswers: UserAnswer[];
  createdAt: string;
}

interface TopicStats {
  accuracy: number;
  completedQuizzes: number;
  totalQuizzes: number;
  averageScore: number;
}

interface TopicStatsMap {
  [key: string]: TopicStats;
}

const UserDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [stats, setStats] = useState({ totalPoints: 0, totalQuizzes: 0, accuracy: 0 });
  const [topicStats, setTopicStats] = useState<TopicStatsMap>({});
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<QuizHistoryItem[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistoryItem | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [historyFilter, setHistoryFilter] = useState({
    topic: 'all',
    sortBy: 'date',
    searchTerm: ''
  });

  const topicDisplayNames: { [key: string]: string } = {
    'vector-algebra': 'Vector Algebra',
    'vector-calculus': 'Vector Calculus',
    'electrostatics': 'Electrostatics',
    'maxwell-equations': 'Maxwell Equations',
    'wave-propagation': 'Wave Propagation'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizresult/stats/${user?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setStats(res.data.data.overall);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    const fetchTopicStats = async () => {
      try {
        // This would be your new API endpoint
        const res = await axios.get(`http://localhost:5000/api/quizresult/stats-by-topic/${user?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTopicStats(res.data.data);
      } catch (err) {
        console.error("Error fetching topic stats", err);
        // Fallback: Calculate from existing history data
        calculateTopicStatsFromHistory();
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizresult/user/${user?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setHistory(res.data.data);
        setFilteredHistory(res.data.data);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };

    if (user?._id) {
      fetchStats();
      fetchTopicStats();
      fetchHistory();
    }
  }, [user]);

  // Fallback method to calculate topic stats from existing history
  const calculateTopicStatsFromHistory = () => {
    const topicMap: TopicStatsMap = {};
    
    history.forEach(item => {
      const topic = item.quizId.module;
      if (!topicMap[topic]) {
        topicMap[topic] = {
          accuracy: 0,
          completedQuizzes: 0,
          totalQuizzes: 0,
          averageScore: 0
        };
      }
      
      topicMap[topic].completedQuizzes++;
      topicMap[topic].accuracy = (topicMap[topic].accuracy + (item.correctAnswers / item.totalQuestions * 100)) / topicMap[topic].completedQuizzes;
      topicMap[topic].averageScore = (topicMap[topic].averageScore + item.score) / topicMap[topic].completedQuizzes;
    });

    setTopicStats(topicMap);
  };

  // Filter history based on selected criteria
  useEffect(() => {
    let filtered = [...history];

    // Filter by topic
    if (historyFilter.topic !== 'all') {
      filtered = filtered.filter(item => item.quizId.module === historyFilter.topic);
    }

    // Filter by search term
    if (historyFilter.searchTerm) {
      const searchTerm = historyFilter.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.quizId.module.toLowerCase().includes(searchTerm) ||
        item.quizId.chapter.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (historyFilter.sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'score':
          return b.score - a.score;
        case 'accuracy':
          return (b.correctAnswers / b.totalQuestions) - (a.correctAnswers / a.totalQuestions);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  }, [history, historyFilter]);

  const getCorrectAnswer = (question: Question): string => {
    return Array.isArray(question.correctAnswer)
      ? question.correctAnswer[0]
      : question.correctAnswer;
  };

  const handleReviewQuiz = (quizItem: QuizHistoryItem) => {
    setSelectedQuiz(quizItem);
    setShowReview(true);
  };

  const getTopicColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100 border-green-300 text-green-800';
    if (accuracy >= 60) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 80) return '🟢';
    if (accuracy >= 60) return '🟡';
    return '🔴';
  };

  const renderTopicPerformance = () => {
    const topicKeys = Object.keys(topicStats);
    if (topicKeys.length === 0) return null;

    return (
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">📊 Topic Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicKeys.map(topic => {
            const stats = topicStats[topic];
            const displayName = topicDisplayNames[topic] || topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <div key={topic} className={`rounded-lg border-2 p-4 ${getTopicColor(stats.accuracy)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{displayName}</h3>
                  <span className="text-2xl">{getAccuracyIcon(stats.accuracy)}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-bold">{Math.round(stats.accuracy)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">{stats.completedQuizzes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Score:</span>
                    <span className="font-bold">{Math.round(stats.averageScore)}</span>
                  </div>
                </div>
                <div className="mt-3 bg-white bg-opacity-50 rounded-full h-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHistoryFilters = () => {
    const uniqueTopics = [...new Set(history.map(item => item.quizId.module))];
    
    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Topic</label>
            <select 
              value={historyFilter.topic}
              onChange={(e) => setHistoryFilter({...historyFilter, topic: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Topics</option>
              {uniqueTopics.map(topic => (
                <option key={topic} value={topic}>
                  {topicDisplayNames[topic] || topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <select 
              value={historyFilter.sortBy}
              onChange={(e) => setHistoryFilter({...historyFilter, sortBy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date (Newest)</option>
              <option value="score">Score (Highest)</option>
              <option value="accuracy">Accuracy (Highest)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input 
              type="text"
              placeholder="Search quizzes..."
              value={historyFilter.searchTerm}
              onChange={(e) => setHistoryFilter({...historyFilter, searchTerm: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setHistoryFilter({ topic: 'all', sortBy: 'date', searchTerm: '' })}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewModal = () => {
    if (!selectedQuiz || !showReview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Quiz Review</h2>
              <button
                onClick={() => setShowReview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Quiz Summary</h3>
              <p><strong>Module:</strong> {selectedQuiz.quizId.module}</p>
              <p><strong>Chapter:</strong> {selectedQuiz.quizId.chapter}</p>
              <p><strong>Total Points:</strong> {selectedQuiz.score}</p>
              <p><strong>Correct Answers:</strong> {selectedQuiz.correctAnswers} / {selectedQuiz.totalQuestions}</p>
              <p><strong>Date:</strong> {new Date(selectedQuiz.createdAt).toLocaleString()}</p>
            </div>

            <div className="space-y-6">
              {selectedQuiz.quizId.questions.map((question, index) => {
                const userAnswer = selectedQuiz.userAnswers.find(ua => ua.questionId === question._id);
                const correctAnswer = getCorrectAnswer(question);
                
                return (
                  <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">Question {index + 1}</h4>
                      <span className={`px-2 py-1 rounded text-sm ${
                        userAnswer?.isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : userAnswer?.selectedAnswer === 'SKIPPED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userAnswer?.selectedAnswer === 'SKIPPED' ? 'Skipped' : 
                         userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <p className="mb-4 text-gray-700">{question.question}</p>
                    
                    {question.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={question.imageUrl} 
                          alt="Question" 
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    )}
                    
                    {question.type === 'MCQ' && question.options && (
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer?.selectedAnswer === option;
                          const isCorrectAnswer = correctAnswer === option;
                          
                          let className = "p-2 rounded border ";
                          if (isCorrectAnswer) {
                            className += "bg-green-50 border-green-300";
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            className += "bg-red-50 border-red-300";
                          } else {
                            className += "bg-gray-50 border-gray-200";
                          }
                          
                          return (
                            <div key={optIndex} className={className}>
                              <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                              {isUserAnswer && <span className="ml-2 text-blue-600">(Your choice)</span>}
                              {isCorrectAnswer && <span className="ml-2 text-green-600">✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {userAnswer?.selectedAnswer === 'SKIPPED' && (
                      <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <strong>You skipped this question</strong>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <span className="font-medium">Points earned: </span>
                      <span className={userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {userAnswer?.points || 0} / {question.points}
                      </span>
                    </div>
                    
                    {question.explanation && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                    
                    {question.solutionImageUrl && (
                      <div className="mb-4">
                        <strong>Solution:</strong>
                        <img 
                          src={question.solutionImageUrl} 
                          alt="Solution" 
                          className="max-w-full h-auto rounded mt-2"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {user?.name} 👋</h1>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Total Points</h2>
            <p className="text-4xl font-bold text-blue-600">{stats.totalPoints}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-green-500">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Quizzes Attempted</h2>
            <p className="text-4xl font-bold text-green-600">{stats.totalQuizzes}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Overall Accuracy</h2>
            <p className="text-4xl font-bold text-purple-600">{stats.accuracy}%</p>
          </div>
        </div>

        {/* Topic Performance */}
        {renderTopicPerformance()}

        {/* Learning History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">📚 Learning History</h2>
          
          {/* Filters */}
          {renderHistoryFilters()}
          
          {/* History List with Scroll */}
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {topicDisplayNames[item.quizId.module] || item.quizId.module.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-sm text-gray-600">→ {item.quizId.chapter}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Score:</span>
                          <span className="font-bold ml-1">{item.score} pts</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-bold ml-1">{Math.round((item.correctAnswers / item.totalQuestions) * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <span className="font-bold ml-1">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReviewQuiz(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No quiz history found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {renderReviewModal()}
    </div>
  );
};

export default UserDashboard;