import fs from 'fs';
import path from 'path';

export function loadDefaultQuestions() {
  const questionsDir = path.join(process.cwd(), 'questions');
  const jsonFiles = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));
  
  const defaultQuizzes = jsonFiles.map(file => {
    const filePath = path.join(questionsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const quizData = JSON.parse(fileContent);
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: quizData.title,
      data: quizData,
      isActive: false
    };
  });

  if (defaultQuizzes.length > 0) {
    defaultQuizzes[0].isActive = true;
  }

  return defaultQuizzes;
}