const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function listAllQuizzes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Quiz = require('./models/Quiz');
    const all = await Quiz.find({}, 'module chapter questions');
    all.forEach(q => {
      console.log(`- Module: "${q.module}", Chapter: "${q.chapter}", Questions: ${q.questions?.length || 0}`);
    });
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listAllQuizzes();
