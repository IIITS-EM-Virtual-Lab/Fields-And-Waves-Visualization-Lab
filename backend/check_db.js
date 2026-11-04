const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:/Users/naman/Downloads/fwvlab/Fields-And-Waves-Visualization-Lab/backend/.env' });

const Quiz = require('c:/Users/naman/Downloads/fwvlab/Fields-And-Waves-Visualization-Lab/backend/models/Quiz.js');

async function checkQuizzes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const quizzes = await Quiz.find({}, 'module chapter questions');
    console.log(`Found ${quizzes.length} quiz document(s):`);
    for (const q of quizzes) {
      console.log(`- Module: "${q.module}", Chapter: "${q.chapter}", Questions count: ${q.questions ? q.questions.length : 0}`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkQuizzes();
