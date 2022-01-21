import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import validWords from "./validWords.json";
import answers from "./answers.json";
import WordRow from './components/WordRow';

//return random number
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

//max count of word
const maxWordLength = 5;

//max count of rows
const maxGuessCount = 6;

//picked is array of individual letters of randamly selected word
const picked = answers[getRandomInt(0,answers.length)].split('');

console.log(picked)

const App = () => {
  //final answer
  const [answer, setAnswer] = useState(picked);
  
  //count of guess word
  const [guessesUsedCount, setGuessesUsedCount] = useState(0);

  const [victory, setVictory] = useState(false);
  const [failure, setFailure] = useState(false);

  //mid game notification
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  //final victory or failure
  const [resultMessage, setResultMessage] = useState(null);

  //array of all letters typed till yet
  const [guessedLetterArray, setGuessedLetterArray] = useState([]);

  //return true when we are on last block of every line
  const endOfLine = guessedLetterArray.length && 
  (guessedLetterArray.length % maxWordLength === 0) 
  && guessesUsedCount < Math.floor(guessedLetterArray.length / maxWordLength);

  //return true when we are on first block of every line
  const startOfLine = !guessedLetterArray.length 
  || ((guessedLetterArray.length % maxWordLength === 0) 
  && guessesUsedCount >= Math.floor(guessedLetterArray.length / maxWordLength));

  //keyboard
  useEffect(() => {
  	window.onkeydown=(e) => { handleKeyDown(e.key); };
  })


  //notification
  const Notification = (props) => {
    const { timeOut } = props;
  if (notificationVisible) {
      setTimeout(() => { if (notificationVisible) { setNotificationVisible(false); } }, timeOut);
  }
  return (
      <div className={ "notification " + (notificationVisible ? 'opacity-100' : 'opacity-0') }>{ notificationMessage }</div>
  );
}

  let letterRows = [];
  let i = 0;
  while (i < maxGuessCount) {
    letterRows.push(
        <WordRow key={`guess-row-${i}`} rowNum={i} guessedLetterArray={guessedLetterArray} 
        answer={answer} maxWordLength={maxWordLength} 
        active={guessedLetterArray.length - (endOfLine ? 1 : 0)} 
        sent={guessesUsedCount > i}  
        victory={victory} />
    );
    i++;
  }

  //sent is bascically that we have pressed enter button and guessesUsedCount incremented


  const handleLetter = (ltr) => {
	if (notificationVisible) { 
		setNotificationVisible(false); 
	}
    setGuessedLetterArray(guessedLetterArray => [...guessedLetterArray, ltr]);
  };


  const handleBackSpace = () => {
    if (startOfLine) {
      return;
    }
    let newInput = [...guessedLetterArray];
    newInput.pop();
    setGuessedLetterArray(newInput);
  };


  const checkVictory = () => {
    let i = 0;
    let j = 0;
    while (i < guessedLetterArray.length) {

      let guess = [...guessedLetterArray].slice(i, i + maxWordLength);

	  let guessWord = guess.join('').toLowerCase();

    //is called when not a valid word
	  if (validWords.indexOf(guessWord) === -1) {

		  let newGuesses = [...guessedLetterArray].slice(0,i);
		  setGuessedLetterArray(newGuesses);
		  setGuessesUsedCount(newGuesses.length / maxWordLength);
		  setNotificationMessage(guessWord.toUpperCase() + " is not a valid word.");
		  setNotificationVisible(true);
		  return;

	  }
      i += maxWordLength;
      j++;

      setGuessesUsedCount(guessesUsedCount + 1);
		  if (answer.join() === guess.join()) {
        setVictory(true);
        setResultMessage(<p className="result-message pt-2 pb-3">You got the answer in {guessesUsedCount + 1} tries!  Press Enter for a new word.</p>);
      }
      else if (j >= maxGuessCount) {
        setFailure(true);
        setResultMessage(<p className="result-message pt-2 pb-3">Sorry, the answer was "{answer.join('')}."  Press Enter for a new word.</p>);
      }
    }
	
  };
  const handleEnter = () => {
    if (!endOfLine) {
		setNotificationMessage("Not enough letters.");
		setNotificationVisible(true);
		return;
    }
    checkVictory();
  };


  const handleKeyDown = (key) => {
    if (key === 'Enter') {
      if (victory || failure) {
        newGame();
        return;
      }
      handleEnter();
      return;
    }
    if (victory) {
      return;
    }


    const isLetter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(key) !== -1;
    if (isLetter && !endOfLine) {
      handleLetter(key.toUpperCase());
      return;
    }
    if (key === 'Backspace') {
      handleBackSpace();
      return;
    }
  };

  const newGame = () => {
    setVictory(false);
	setFailure(false);
  setGuessedLetterArray([]);
  setGuessesUsedCount(0);
  setAnswer(answers[getRandomInt(0,answers.length)].split(''));
  setResultMessage(null);
  };
	

  return (
    <Container fluid="sm" tabIndex={1} className="h-100 text-center pt-2 pt-md-3 pt-lg-4 px-0 px-sm-4"> 
	  <header className="d-sm-none d-md-block">
		  <h3 className="mt-md-4 mt-lg-5">A <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a> clone built in React</h3>
	  </header>
	    <Container className="App" style={{ maxWidth: '480px', backgroundColor: '#003300' }}>
	        <Row>
	        <Col xs={12}>
	          { letterRows }
	        </Col>
	      </Row>
		  <Notification timeOut={2500} />
	      { resultMessage &&
	      <Row>
	        <Col xs={12} className="p-0">
	        { resultMessage }
	        </Col>
	      </Row>
	      }
	    </Container>
  </Container>
  );
}

export default App;
