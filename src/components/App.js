import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Timer from './Timer';
import Footer from './Footer';

function App() {

  const SECS_PER_QUESTIONS = 30;

  const initialState = {
    questions: [],
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null
  };

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
        return { ...state, status: "error" };
      case "start":
        return { ...state, status: "active", secondsRemaining: state.questions.length * SECS_PER_QUESTIONS };
      case 'newAnswer':
        const question = state.questions.at(state.index);
        return { ...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points };
      case "nextQuestion":
        return { ...state, index: state.index + 1, answer: null };
      case "finish":
        return { ...state, status: 'finished', highscore: state.points > state.highscore ? state.points : state.highscore };
      case "restart":
        return { ...initialState, questions: state.questions, status: 'ready' };
      case "tick":
        return { ...state, secondsRemaining: state.secondsRemaining - 1, status: state.secondsRemaining === 0 ? 'finished' : state.status };
      default:
        throw new Error("Action is unknown");
    }
  }

  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  // Check if questions is an array before applying reduce
  const maxPossiblePoints = Array.isArray(questions) ? questions.reduce((prev, cur) => prev + cur.points, 0) : 0;

  useEffect(function () {
    async function fetchData() {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/devmuhib009/react-quiz-project/main/data/questions.json`);

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        console.log('Fetched data:', data); // Log fetched data to check format

        // Ensure that the fetched data is an array
        if (Array.isArray(data)) {
          dispatch({ type: "dataReceived", payload: data });
        } else {
          console.error("Fetched data is not an array:", data);
          dispatch({ type: "dataFailed" });
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
        dispatch({ type: "dataFailed" });
      }
    }

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && (
          <>
            <Progress index={index} numQuestions={numQuestions} answer={answer} points={points} maxPossiblePoints={maxPossiblePoints} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
            </Footer>
          </>
        )}
        {status === 'finished' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}

export default App;
