// Need this statement to import styles into build files
import './styles.css';
import Ship from './ship';
import constants from './constants';

const svg = document.getElementById('svg');

const ship = new Ship();
ship.tick();
ship.render(svg);

const gameLoop = setInterval(() => {
  ship.tick();
  ship.render(svg);
}, 1000 / constants.ticksPerSecond);

window.addEventListener('keydown', ship.inputHandler);
