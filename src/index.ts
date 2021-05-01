// Need this statement to import styles into build files
import './styles.css';
import constants from './constants';
import GameState from './state';

const svg = document.getElementById('svg');
const state = new GameState();
state.render(svg);

setInterval(() => {
  state.tick();
  state.render(svg);
}, 1000 / constants.ticksPerSecond);

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key !== 'r') return;
  state.resetState();
  state.render(svg);
});

window.addEventListener('keydown', (event: KeyboardEvent) => {
  state.inputHandler(event);
});
