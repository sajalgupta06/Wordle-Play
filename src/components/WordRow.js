import React from 'react';
import LetterSquare from './LetterSquare';
import Row from 'react-bootstrap/Row';

const WordRow = (props) => {
    const { rowNum, guessedLetterArray, answer, maxWordLength, active, sent, victory } = props;

    //gives starting index of every new word 
    let startIndex = rowNum * maxWordLength;

    //gives ending index of every new word 
    let endIndex = startIndex + maxWordLength - 1;


    let squares = [];

    //tempoary variable
    let i = startIndex;

    //we are combining the array we got above into word
    const guessWord = [...guessedLetterArray].slice(i, i + maxWordLength).join('').toUpperCase();


    while (i <= endIndex) {

      //it would be denoting is the particular letter in the word is at
      //right-spot -> letter is in final answer
      //wrong-spot -> letter is in final answer but not at right location
      //no-spot -> letter do not occur in final answer
      let result = null;

      //character at ith location
      const letter = guessedLetterArray[i];

      //this is executed after we have entered whole word and presssed enter key
      if (letter && sent) {

        //if char at right location
        if (letter === answer[i - startIndex]) {
            result = 'right-spot';
        }

        //if char is present in answer
        else if (answer.indexOf(letter) !== -1) {

          result= 'wrong-spot';

        }
        //if char is not present in answer
        else {
          result = 'no-spot';
        }
      }
      squares.push(<LetterSquare key={`guess-${i}`} letter={letter} result={result} active={active === i && !victory} />);
      i++;
    }
    return (
      <Row>
      { squares }
      </Row>
    );
  };

export default WordRow;
