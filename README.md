# Quiz App

A flexible, interactive quiz application built with Next.js that supports multiple-choice questions, learning mode, and online quiz sharing.

![Version](https://img.shields.io/badge/version-3.18-blue)
![Framework](https://img.shields.io/badge/framework-Next.js-black)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Technical Documentation](#technical-documentation)
  - [Project Structure](#project-structure)
  - [Component Breakdown](#component-breakdown)
  - [Data Flow](#data-flow)
  - [State Management](#state-management)
- [Using the App](#using-the-app)
- [Quiz File Format](#quiz-file-format)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

- **Interactive Quiz Experience**: Take multiple-choice quizzes with immediate feedback
- **Learning Mode**: Review incorrectly answered questions for better retention
- **Multiple Quiz Sources**:
  - Upload local JSON quiz files
  - Access shared quizzes from the online library
  - Combine multiple quizzes for longer sessions
- **User-Friendly Interface**:
  - Progress tracking with visual indicators
  - Keyboard navigation (A/B/C keys for answering)
  - Clean, responsive design
- **Score Assessment**: Get your final score on a scale of 20 with performance feedback

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quiz.git
   cd quiz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add Supabase credentials if you want to use the online library:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Technical Documentation

### Project Structure

```
/quiz
├── components/          # React components
│   ├── Icons.js         # SVG icon components
│   ├── ManageQuizzes.js # Local quiz management interface
│   ├── MenuDropdown.js  # Navigation menu
│   ├── OnlineLibrary.js # Supabase quiz library interface
│   ├── Quiz.js          # Main quiz component
│   ├── UploadButton.js  # File upload component
│   └── utils.js         # Component utility functions
├── hooks/               # Custom React hooks
│   └── useLocalStorage.js # localStorage management hook
├── pages/               # Next.js pages
│   ├── _app.js          # Next.js app wrapper
│   └── index.js         # Main entry point
├── public/              # Static assets
├── questions/           # Sample quiz files
│   └── Islamic Quiz.json # Example quiz file
├── utils/               # Utility functions
│   └── supabaseClient.js # Supabase configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── .env.local           # Environment variables
```

### Component Breakdown

#### Pages

**`pages/index.js`**
- Entry point of the application
- Renders the main `Quiz` component
- Contains the version tag (v3.18)

**`pages/_app.js`**
- Next.js application wrapper
- Provides global styling and context

#### Components

**`components/Quiz.js`**
- **Responsibility**: Core quiz functionality
- **Features**:
  - Manages quiz state (current question, answers, score)
  - Handles answer submission and validation
  - Implements learning mode (repeating incorrect questions)
  - Tracks progress and calculates scores
  - Provides keyboard navigation
- **Contains subcomponents**:
  - `Question`: Renders individual questions and options
  - `Header`: Quiz header with title and menu
  - `QuizComplete`: End-of-quiz summary screen

**`components/ManageQuizzes.js`**
- **Responsibility**: Interface for local quiz management
- **Features**:
  - File upload for JSON quiz files
  - Quiz listing and selection
  - Quiz activation/deactivation
  - Quiz deletion
  - Detailed quiz preview
- **Connected to**: 
  - Uses `useLocalStorage` hook for persistence
  - Communicates with `Quiz.js` through callbacks

**`components/OnlineLibrary.js`**
- **Responsibility**: Interface for Supabase-based quiz repository
- **Features**:
  - Fetches quizzes from Supabase
  - Uploads quizzes to Supabase
  - Quiz selection and preview
  - Quiz activation/deactivation
  - Quiz deletion from online repository
- **Connected to**:
  - Uses `supabaseClient.js` for database operations
  - Communicates with `Quiz.js` through callbacks
  - Uses `UploadButton.js` for file selection

**`components/MenuDropdown.js`**
- **Responsibility**: Navigation menu for quiz operations
- **Features**:
  - Provides options to restart quiz
  - Links to online library
- **Connected to**:
  - Used by `Quiz.js` for navigation options

**`components/Icons.js`**
- **Responsibility**: SVG icon components for the UI
- **Contains**:
  - TrashIcon, UploadIcon, InfoIcon, CheckIcon
  - FeedbackCheckIcon, XIcon
- **Used by**: Various components throughout the app

**`components/UploadButton.js`**
- **Responsibility**: File selection interface
- **Features**:
  - Styled upload button with icon
  - File input handling
  - Loading state indicator
- **Used by**: `OnlineLibrary.js`

**`components/utils.js`**
- **Responsibility**: Component-specific utility functions
- **Contains**:
  - `shuffleArray`: Randomizes array elements (used for question options)

#### Hooks

**`hooks/useLocalStorage.js`**
- **Responsibility**: Custom hook for localStorage operations
- **Features**:
  - Persistent state that syncs with localStorage
  - Handles serialization/deserialization
  - Fallback for missing values
- **Used by**: `Quiz.js` and `ManageQuizzes.js`

#### Utilities

**`utils/supabaseClient.js`**
- **Responsibility**: Supabase client configuration
- **Features**:
  - Creates and exports Supabase client with authentication
- **Used by**: `OnlineLibrary.js`

### Data Flow

1. **Quiz Data Loading**:
   - JSON quiz data is loaded either from:
     - Local storage (via `ManageQuizzes.js`)
     - Supabase (via `OnlineLibrary.js`)
   - Active quiz data is passed to `Quiz.js` via the `onQuizActivated` callback

2. **Quiz Execution Flow**:
   - Quiz data is processed and randomized using `shuffleArray` from `components/utils.js`
   - Questions are presented one at a time
   - User answers are validated immediately
   - Correct answers proceed automatically after a delay
   - Incorrect answers require manual progression and are added to a review list
   - After initial questions, incorrect questions are presented again
   - Final score is calculated and displayed

3. **Data Persistence**:
   - Local quizzes are stored in browser localStorage via the `useLocalStorage` hook
   - Online quizzes are stored in Supabase database via the Supabase client

### State Management

The application uses React's useState and useEffect hooks for state management:

**Main Quiz State** (`Quiz.js`):
- `currentQuestionIndex`: Tracks the current question position
- `selectedAnswer`: Stores the user's selected answer
- `showJustification`: Controls visibility of answer explanation
- `quizData`: Stores the active quiz data
- `randomizedQuestions`: Shuffled questions for presentation
- `correctAnswers`: Counter for correct answers
- `questionsToRepeat`: Collection of incorrectly answered questions
- `isInRepeatPhase`: Flag for the review phase of the quiz
- `isQuizComplete`: Flag for quiz completion state

**Quiz Management State**:
- `quizzes`: Array of available quizzes (from localStorage)
- `showManageQuizzes`: Controls quiz management interface visibility
- `showOnlineLibrary`: Controls online library interface visibility

**Online Library State**:
- Tracks loading states, selected quizzes, and deletion confirmation

## Using the App

### Taking a Quiz

1. Start by uploading a quiz file or selecting from the online library
2. Answer questions by clicking on an option or using the A, B, C keys
3. For correct answers, you'll automatically move to the next question
4. For incorrect answers, review the justification and click "Next Question"
5. After the initial round, you'll review any incorrect questions
6. View your final score and performance assessment when finished

### Managing Quizzes

- **Upload Quiz Files**: Click the upload icon in the management screen
- **Combine Quizzes**: Check multiple quizzes to activate them simultaneously
- **View Details**: Click the info icon to see all questions in a quiz
- **Delete Quizzes**: Click the trash icon (requires confirmation)

## Quiz File Format

Create JSON files with the following structure:

```json
{
  "title": "Your Quiz Title",
  "questions": [
    {
      "id": "1",
      "texte": "Your question text goes here?",
      "answerA": "First option",
      "answerB": "Second option",
      "answerC": "Third option",
      "correctAnswer": "B",
      "justification": "Explanation for the correct answer"
    },
    // More questions...
  ]
}
```

Required fields:
- `title`: Name of the quiz
- `questions`: Array of question objects, each containing:
  - `id`: Unique identifier (auto-generated if missing)
  - `texte`: Question text
  - `answerA/B/C`: The three possible answers
  - `correctAnswer`: Correct option (A, B, or C)
  - `justification`: Explanation shown for incorrect answers

## Deployment

The application is configured for deployment to Vercel:

```bash
npm run build
# or
yarn build
```

Supabase configuration is already set up in `utils/supabaseClient.js`, but you should set proper environment variables in your deployment platform for security.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
