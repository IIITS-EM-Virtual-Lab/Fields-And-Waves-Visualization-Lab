import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../store/slices/authSlice";
import axios from "axios";
import { FaChartBar, FaBullseye, FaMedal } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


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
        const res = await axios.get(`https://fields-and-waves-visualization-lab.onrender.com/api/quizresult/stats/${user?._id}`, {
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
        const res = await axios.get(`https://fields-and-waves-visualization-lab.onrender.com/api/quizresult/stats-by-topic/${user?._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTopicStats(res.data.data);
      } catch (err) {
        console.error("Error fetching topic stats", err);
        calculateTopicStatsFromHistory();
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`https://fields-and-waves-visualization-lab.onrender.com/api/quizresult/user/${user?._id}`, {
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

  useEffect(() => {
    let filtered = [...history];

    if (historyFilter.topic !== 'all') {
      filtered = filtered.filter(item => item.quizId.module === historyFilter.topic);
    }

    if (historyFilter.searchTerm) {
      const searchTerm = historyFilter.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.quizId.module.toLowerCase().includes(searchTerm) ||
        item.quizId.chapter.toLowerCase().includes(searchTerm)
      );
    }

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
    if (accuracy >= 80) return 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600';
    if (accuracy >= 60) return 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500';
    return 'bg-gradient-to-br from-red-400 via-red-500 to-pink-600';
  };

  const getTopicTextColor = (accuracy: number) => {
    return 'text-white';
  };

  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 80) return '🎯';
    if (accuracy >= 60) return '⚡';
    return '💪';
  };

  const renderTopicPerformance = () => {
  const topicKeys = Object.keys(topicStats);
  if (topicKeys.length === 0) return null;

  return (
    <div className="mb-12 px-4 max-w-[1260px] mx-auto">
      {/* Heading */}
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Topic Performance</h2>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="flex overflow-x-auto space-x-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {topicKeys.map((topic) => {
          const stats = topicStats[topic];
          const displayName =
            topicDisplayNames[topic] ||
            topic.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          const accuracy = Math.round(stats.accuracy);

          let progressColor = "#ef4444"; // default red
          if (accuracy >= 80) progressColor = "#10b981"; // green
          else if (accuracy >= 60) progressColor = "#f59e0b"; // amber

          return (
            <div
              key={topic}
              className="min-w-[360px] bg-white border border-gray-200 rounded-2xl p-6 flex-shrink-0 shadow-md"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={accuracy}
                    text={`${accuracy}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor: progressColor,
                      textColor: "#111827",
                      trailColor: "#e5e7eb"
                    })}
                  />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-blue-700 text-base">{displayName}</h3>
                  <p className="text-sm text-gray-600">Avg Score: {Math.round(stats.averageScore)}</p>
                </div>
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
      <div className="mb-8 p-6 bg-white rounded-l border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Filter by Topic</label>
            <select 
              value={historyFilter.topic}
              onChange={(e) => setHistoryFilter({...historyFilter, topic: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-l"
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
            <label className="block text-sm font-semibold mb-3 text-gray-700">Sort by</label>
            <select 
              value={historyFilter.sortBy}
              onChange={(e) => setHistoryFilter({...historyFilter, sortBy: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-l"
            >
              <option value="date">Date (Newest)</option>
              <option value="score">Score (Highest)</option>
              <option value="accuracy">Accuracy (Highest)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Search</label>
            <input 
              type="text"
              placeholder="Search quizzes..."
              value={historyFilter.searchTerm}
              onChange={(e) => setHistoryFilter({...historyFilter, searchTerm: e.target.value})}
              className="w-full p-3 h-12 border border-gray-200 rounded-l"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setHistoryFilter({ topic: 'all', sortBy: 'date', searchTerm: '' })}
              className="w-full h-12 p-3 text-gray-700 rounded-l border border-gray-200 font-medium transform hover:scale-105"
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
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Quiz Review</h2>
              <button
                onClick={() => setShowReview(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-light transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Quiz Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Module</p>
                  <p className="font-semibold text-gray-800">{selectedQuiz.quizId.module}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chapter</p>
                  <p className="font-semibold text-gray-800">{selectedQuiz.quizId.chapter}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Points</p>
                  <p className="font-semibold text-gray-800">{selectedQuiz.score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
                  <p className="font-semibold text-gray-800">{selectedQuiz.correctAnswers} / {selectedQuiz.totalQuestions}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedQuiz.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {selectedQuiz.quizId.questions.map((question, index) => {
                const userAnswer = selectedQuiz.userAnswers.find(ua => ua.questionId === question._id);
                const correctAnswer = getCorrectAnswer(question);
                
                return (
                  <div key={question._id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-xl text-gray-800">Question {index + 1}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                    
                    <p className="mb-6 text-gray-700 text-lg leading-relaxed">{question.question}</p>
                    
                    {question.imageUrl && (
                      <div className="mb-6">
                        <img 
                          src={question.imageUrl} 
                          alt="Question" 
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    
                    {question.type === 'MCQ' && question.options && (
                      <div className="space-y-3 mb-6">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer?.selectedAnswer === option;
                          const isCorrectAnswer = correctAnswer === option;
                          
                          let className = "p-4 rounded-lg border-2 transition-all ";
                          if (isCorrectAnswer) {
                            className += "bg-green-50 border-green-300";
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            className += "bg-red-50 border-red-300";
                          } else {
                            className += "bg-gray-50 border-gray-200";
                          }
                          
                          return (
                            <div key={optIndex} className={className}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="font-bold text-gray-700 mr-3">{String.fromCharCode(65 + optIndex)}.</span>
                                  <span className="text-gray-800">{option}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isUserAnswer && <span className="text-blue-600 font-medium">(Your choice)</span>}
                                  {isCorrectAnswer && <span className="text-green-600 font-bold">✓</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {userAnswer?.selectedAnswer === 'SKIPPED' && (
                      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <p className="font-medium text-yellow-800">You skipped this question</p>
                      </div>
                    )}
                    
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Points earned: </span>
                      <span className={`font-bold ${userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {userAnswer?.points || 0} / {question.points}
                      </span>
                    </div>
                    
                    {question.explanation && (
                      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <p className="font-semibold text-blue-800 mb-2">Explanation:</p>
                        <p className="text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                    
                    {question.solutionImageUrl && (
                      <div className="mb-6">
                        <p className="font-semibold text-gray-800 mb-3">Solution:</p>
                        <img 
                          src={question.solutionImageUrl} 
                          alt="Solution" 
                          className="max-w-full h-auto rounded-lg shadow-md"
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="flex-grow px-8 py-12">
        <div className="max-w-7xl mx-auto">

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-6">
  {/* Total Points */}
  <div className="flex items-center bg-white border rounded-xl p-8 shadow-md">
    <div className="flex-shrink-0 w-14 h-14 bg-[#38bdf8] rounded-full flex items-center justify-center mr-6">
      <FaChartBar className="text-white text-xl" />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-gray-900 leading-tight">{stats.totalPoints}</p>
      <p className="text-base text-gray-600 mt-1">Total Points</p>
    </div>
  </div>

  {/* Quizzes Attempted */}
  <div className="flex items-center bg-white border rounded-xl p-6 shadow-md">
    <div className="flex-shrink-0 w-14 h-14 bg-[#38bdf8] rounded-full flex items-center justify-center mr-6">
      <FaBullseye className="text-white text-xl" />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-gray-900 leading-tight">{stats.totalQuizzes}</p>
      <p className="text-base text-gray-600 mt-1">Quizzes Attempted</p>
    </div>
  </div>

  {/* Overall Accuracy */}
  <div className="flex items-center bg-white border rounded-xl p-6 shadow-md">
    <div className="flex-shrink-0 w-14 h-14 bg-[#38bdf8] rounded-full flex items-center justify-center mr-6">
      <FaMedal className="text-white text-xl" />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-gray-900 leading-tight">{stats.accuracy}%</p>
      <p className="text-base text-gray-600 mt-1">Overall Accuracy</p>
    </div>
  </div>
</div>
          {/* Topic Performance */}
          {renderTopicPerformance()}

          {/* Enhanced Learning History */}
<div className="max-w-[1280px] mx-auto px-4">
  <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm relative overflow-hidden">
    <div className="flex items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 bg-clip-text">
        Learning History
      </h2>
    </div>

    {/* Filters */}
    {renderHistoryFilters()}

    {/* Table */}
    <div className="mt-8">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="px-6 py-3 font-semibold">Module</th>
            <th className="px-6 py-3 font-semibold">Chapter</th>
            <th className="px-6 py-3 font-semibold">Score</th>
            <th className="px-6 py-3 font-semibold">Accuracy</th>
            <th className="px-6 py-3 font-semibold">Date</th>
            <th className="px-6 py-3 font-semibold">Correct</th>
            <th className="px-6 py-3 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  {topicDisplayNames[item.quizId.module] ||
                    item.quizId.module.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </td>
                <td className="px-6 py-4">{item.quizId.chapter}</td>
                <td className="px-6 py-4 font-medium">{item.score} pts</td>
                <td className="px-6 py-4">
                  {Math.round((item.correctAnswers / item.totalQuestions) * 100)}%
                </td>
                <td className="px-6 py-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {item.correctAnswers}/{item.totalQuestions}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleReviewQuiz(item)}
                    className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No quiz history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Decorative Glow (optional) */}
    <div className="absolute bottom-4 right-4 w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-5 blur-xl"></div>
  </div>
</div>

        </div>
      </main>
      
      {renderReviewModal()}
    </div>
    
  );
};

export default UserDashboard;