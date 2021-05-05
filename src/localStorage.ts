export const getHighScore = (): number => {
  const highScore = +window.localStorage.getItem('asteroids-high-score');
  return highScore === NaN ? 0 : highScore;
};

export const setHighScore = (highScore: number): void => {
  const oldHighScore = getHighScore();
  if (highScore <= oldHighScore) return;
  window.localStorage.setItem('asteroids-high-score', String(highScore));
};
