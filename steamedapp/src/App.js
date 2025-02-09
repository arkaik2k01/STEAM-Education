import './App.css';
import ModulePage from './pages/ModulePage';

const moduleData = {
  "moduleId": "unique_module_id",
  "title": "Module Title",
  "sections": [
      {
          "type": "text",
          "content": "Your educational text content here...",
      },
      {
          "type": "multiple-choice",
          "id": "mcq-1",
          "is-done": true,
          "content": {
              "question": "Question text here",
              "answers": [
                  {
                      "text": "Answer 1",
                      "isCorrect": false
                  },
                  {
                      "text": "Answer 2",
                      "isCorrect": true
                  }
              ]
          }
      },
      {
          "type": "text",
          "content": "Your educational text content here...",
      },
      {
          "type": "fill-blank",
          "id": "fib-1",
          "is-done": false,
          "content": {
              "text": "This is a ____ in the ____ exercise",
              "keywords": [
                  "fill",
                  "blank",
                  "sample",
                  "text"
              ],
              "answer_key": [
                  "fill",
                  "blank"
              ]
          }
      },
      {
          "type": "text",
          "content": "Your educational text content here...",
      },
      {
          "type": "code",
          "id": "code-1",
          "is-done": false,
          "content": {
              "code": "console.log('Hello, World!');"
          }
      }
  ]
};

const App = () => {
  return (
      <div className="min-h-screen">
          <ModulePage moduleData={moduleData} />
      </div>
  );
};

export default App;
