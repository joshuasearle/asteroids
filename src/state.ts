import Bullet from './bullet';
import Ship from './ship';
import Asteroid from './asteroid';
import constants from './constants';
import GameObject from './gameObject';
import collisionHandler from './collisionHandler';

class GameState {
  private paused: boolean;
  private gameObjects: GameObject[];
  private deadObjects: GameObject[];
  private tickCount: number;
  private ship: Ship;
  private over: boolean;

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
  }

  render(svg: any) {
    this.gameObjects.forEach((o) => o.render(svg));
    this.deadObjects.forEach((o) => o.remove(svg));
    this.deadObjects = [];
    const message = document.getElementById('message');
    message.style.visibility = this.paused || this.over ? 'visible' : 'hidden';
    message.textContent = this.paused
      ? 'Press <esc> to unpause'
      : 'Press <r> to restart';
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
    this.removeDeadObjects();
    this.gameObjects = this.deadObjects.reduce((objects, object) => {
      return objects.concat(object.onDeadReturn());
    }, this.gameObjects);
    this.gameObjects.forEach((o) => o.tick());
    const bigAsteroidCount = this.gameObjects
      .filter((o) => o.isAsteroid())
      .filter((o) => (o as Asteroid).isSmall()).length;
    this.gameObjects = this.gameObjects.concat(
      Asteroid.addAsteroid(this.tickCount, bigAsteroidCount)
    );
    this.handleCollisions();
    if (!this.ship.alive()) this.over = true;
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

  inputHandler(event: KeyboardEvent) {
    if (this.over) return;
    if (event.key === 'Escape') {
      this.paused = !this.paused;
    }

    if (this.paused) return;

    if (event.key === 'ArrowUp' || event.key === 'w') {
      this.ship.thrust();
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.ship.turnLeft();
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      this.ship.turnRight();
    } else if (event.key === ' ') {
      const bullet: Bullet = this.ship.shoot();
      this.gameObjects.push(bullet);
    }
  }
}

export default GameState;