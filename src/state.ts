import Bullet from './bullet';
import Ship from './ship';
import Asteroid from './asteroid';
import GameObject from './gameObject';
import collisionHandler from './collisionHandler';
import { getHighScore, setHighScore } from './localStorage';
import renderLives from './lives';

class GameState {
  private paused: boolean;
  private gameObjects: GameObject[];
  private deadObjects: GameObject[];
  private tickCount: number;
  private ship: Ship;
  private over: boolean;
  // true when the up arrow key is down
  private upDown: boolean;
  private leftDown: boolean;
  private rightDown: boolean;
  private points: number;

  constructor() {
    this.resetState();
  }

  resetState() {
    this.ship = new Ship();
    this.deadObjects = this.gameObjects || [];
    this.gameObjects = [this.ship];
    this.paused = true;
    this.tickCount = 0;
    this.over = false;
    this.upDown = false;
    this.leftDown = false;
    this.rightDown = false;
    this.points = 0;
  }

  render(svg: any) {
    renderLives(this.ship.getRemainingLives());
    this.gameObjects.forEach((o) => o.render(svg));
    this.deadObjects.forEach((o) => o.remove(svg));
    this.deadObjects = [];
    const highScore = document.getElementById('high-score');
    highScore.textContent = `High Score: ${getHighScore()}`;
    const message = document.getElementById('message');
    let messageText = `Points: ${this.points}`;
    if (this.over) {
      messageText = messageText.concat(`<br />Press &lt;r&gt; to restart`);
    } else if (this.paused) {
      messageText = messageText.concat(`<br />Press &lt;esc&gt; to unpause`);
    }

    message.innerHTML = messageText;
  }

  getDeadObjects() {
    return this.gameObjects.filter((o) => !o.alive());
  }

  removeDeadObjects() {
    this.deadObjects = this.gameObjects.filter((o) => !o.alive());
    this.gameObjects = this.gameObjects.filter((o) => o.alive());
  }

  tick() {
    if (this.paused || this.over) return;
    this.handleDownKeys();
    this.removeDeadObjects();
    this.deadObjects.forEach((o) => {
      o.onDeadReturn(this);
    });
    this.gameObjects.forEach((o) => o.tick());
    const bigAsteroidCount = this.gameObjects
      .filter((o) => o.isAsteroid())
      .filter((o) => !(o as Asteroid).isSmall()).length;
    this.gameObjects = this.gameObjects.concat(
      Asteroid.addAsteroid(this.tickCount, bigAsteroidCount)
    );
    this.handleCollisions();
    if (!this.ship.alive()) this.over = true;
    setHighScore(this.points);
    this.tickCount += 1;
  }

  handleCollisions() {
    const objects = this.gameObjects;
    for (let i = 0; i < objects.length; i++) {
      for (let j = i; j < objects.length; j++) {
        collisionHandler(objects[i], objects[j]);
      }
    }
  }

  togglePaused() {
    this.paused = !this.paused;
  }

  handleDownKeys() {
    if (this.upDown) this.ship.thrust();
    if (this.leftDown) this.ship.turnLeft();
    if (this.rightDown) this.ship.turnRight();
  }

  keyDownHandler(event: KeyboardEvent) {
    if (this.over) return;
    if (event.key === 'Escape') {
      this.paused = !this.paused;
    }

    if (this.paused) return;

    if (event.key === 'ArrowUp' || event.key === 'w') {
      this.upDown = true;
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.leftDown = true;
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      this.rightDown = true;
    } else if (event.key === ' ') {
      const bullet: Bullet = this.ship.shoot();
      this.gameObjects.push(bullet);
    }
  }

  keyUpHandler(event: KeyboardEvent) {
    if (this.paused) return;
    if (this.over) return;

    if (event.key === 'ArrowUp' || event.key === 'w') {
      this.upDown = false;
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.leftDown = false;
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      this.rightDown = false;
    }
  }

  addAsteroid(asteroid: Asteroid) {
    this.gameObjects.push(asteroid);
  }

  addPoints(points: number) {
    this.points += points;
  }
}

export default GameState;
