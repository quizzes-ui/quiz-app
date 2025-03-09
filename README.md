# Quiz Application

A Next.js-based quiz platform for creating, managing, and taking multiple-choice quizzes.

## Overview

This application allows users to upload quiz content in JSON format and take interactive quizzes with immediate feedback. It includes features like randomized questions, keyboard shortcuts, and a review system for incorrect answers.

## Core Structure

### Frontend Framework:
- Built with React and Next.js
- Uses client-side state management via React hooks
- Employs localStorage for data persistence

### Main Components:

1. **Quiz.js**
   - The central component that manages quiz-taking functionality
   - Renders questions, tracks answers, and calculates scores
   - Includes spaced repetition logic (review of incorrect answers)
   - Implements keyboard navigation (A/B/C for answers, Enter to continue)
   - Displays immediate feedback and explanations for answers

2. **ManageQuizzes.js**
   - Handles quiz file uploads and validation
   - Manages multiple quiz sets
   - Provides interface for activating/deactivating quizzes
   - Displays quiz metadata and previews

3. **Icons.js**
   - SVG icon components used throughout the application

4. **Custom Hooks**
   - useLocalStorage.js: Creates persistent state stored in browser's localStorage

## Data Structure

The application uses a specific JSON format for quiz files:
```json
{
  "title": "Quiz Title",
  "questions": [
    {
      "texte": "Question text",
      "answerA": "Option A",
      "answerB": "Option B",
      "answerC": "Option C",
      "correctAnswer": "A", // Must be A, B, or C
      "justification": "Explanation for correct answer"
    }
    // More questions...
  ]
}
```

## Quiz Flow
1. User uploads or selects a quiz from the management interface
2. Questions are randomized and presented one at a time
3. User selects an answer and receives immediate feedback
4. Incorrectly answered questions are collected for review
5. After completing all questions, user reviews incorrect answers
6. Final score is calculated and normalized to a 20-point scale

## Key Features
- Multiple quiz management
- Randomized question order
- Keyboard shortcuts
- Immediate answer feedback with explanations
- Review phase for incorrect answers
- Progress tracking
- Score calculation
- Question file validation and error handling

## Technical Details
- Quiz validation ensures all required fields are present
- Automatic ID generation for questions that don't have them
- Error handling for JSON parsing and validation
- Responsive design for different screen sizes

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- NPM or Yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Development Server
```
npm run dev
```
or
```
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production
```
npm run build
npm start
```
or
```
yarn build
yarn start
```


