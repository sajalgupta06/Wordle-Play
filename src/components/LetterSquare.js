import React from 'react';
import Col from 'react-bootstrap/Col';

const LetterSquare = (props) => {
    const { active, result, letter } = props;
    let activeClass = '';
    if (active) {
      activeClass = ' active';
    }
    return (
      <Col className={`letterSquare pt-2 ${result}${activeClass}`} style={{ color: 'white', fontWeight: 600 }}>{ letter || null }</Col>
    );
  };

export default LetterSquare;
