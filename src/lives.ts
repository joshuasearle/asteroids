const renderLives = (remainingLives: number) => {
  const life1 = document.getElementById('life1');
  const life2 = document.getElementById('life2');
  const life3 = document.getElementById('life3');
  life1.setAttribute('visibility', remainingLives <= 0 ? 'hidden' : 'visible');
  life2.setAttribute('visibility', remainingLives <= 1 ? 'hidden' : 'visible');
  life3.setAttribute('visibility', remainingLives <= 2 ? 'hidden' : 'visible');
  life1.setAttribute('transform', getTransformString(1));
  life2.setAttribute('transform', getTransformString(2));
  life3.setAttribute('transform', getTransformString(3));
};

const getTransformString = (lifeNumber: number) => {
  return `translate(${window.innerWidth - lifeNumber * 60} ${
    window.innerHeight - 60
  }) rotate(-90 25 15)`;
};

export default renderLives;
