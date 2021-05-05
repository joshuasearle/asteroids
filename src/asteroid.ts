import GameObject from './gameObject';
import Vector, { fromMagAng } from './vector';
import { getRandomInt } from './util';
import constants from './constants';
import { handleVelocity, handleRotation } from './moveBehaviour';
import asteroidPoints from './asteroidPoints';
import GameState from './state';

class Asteroid implements GameObject {
  private position: Vector;
  private velocity: Vector;
  private rotation: number;
  private rpm: number;
  static nextAsteroidId: number = 0;
  private asteroidId: number;
  private small: boolean;
  private dead: boolean;

  constructor(small: boolean, position: Vector = null) {
    this.small = small;
    this.velocity = fromMagAng(
      getRandomInt(constants.minAsteroidSpeed, constants.maxAsteroidSpeed),
      getRandomInt(0, 360)
    );
    if (position === null) {
      this.position = new Vector(window.innerWidth, window.innerHeight);
    } else {
      this.position = position;
    }

    this.rotation = 0;
    this.rpm = getRandomInt(constants.minAsteroidRpm, constants.maxAsteroidRpm);
    this.asteroidId = Asteroid.nextAsteroidId;
    this.dead = false;
    Asteroid.nextAsteroidId += 1;
  }

  getIdString() {
    return `asteroid${this.asteroidId}`;
  }

  getPoints() {
    return this.small
      ? asteroidPoints.smallAsteroid
      : asteroidPoints.bigAsteroid;
  }

  tick() {
    this.position = handleVelocity(this.position, this.velocity, true);
    this.rotation = handleRotation(this.rotation, this.rpm);
  }

  createElement(svg: any) {
    const asteroid = document.createElementNS(svg.namespaceURI, 'polygon');
    svg.appendChild(asteroid);
    asteroid.setAttribute('id', this.getIdString());
    asteroid.setAttribute('points', this.getPoints());
    asteroid.classList.add('asteroid');
  }

  getWidthHeight() {
    return this.small ? 50 : 100;
  }

  render(svg: any) {
    if (!document.getElementById(this.getIdString())) {
      this.createElement(svg);
    }
    const asteroid = document.getElementById(this.getIdString());

    const translateString = `translate(${
      this.position.x - this.getWidthHeight() / 2
    }, ${this.position.y - this.getWidthHeight() / 2})`;

    const rotateString = `rotate(${-this.rotation} ${
      this.getWidthHeight() / 2
    } ${this.getWidthHeight() / 2})`;
    const transformString = translateString + ' ' + rotateString + ' ';

    asteroid.setAttribute('transform', transformString);
  }

  remove(svg: any) {
    const asteroid = document.getElementById(this.getIdString());
    if (!asteroid) return;
    svg.removeChild(asteroid);
  }

  break() {
    if (this.small) return [];
    const children: Asteroid[] = [];
    children.push(new Asteroid(true, this.position));
    children.push(new Asteroid(true, this.position));
    children.push(new Asteroid(true, this.position));
    return children;
  }

  getPosition() {
    return this.position;
  }

  getRadius() {
    return (this.getWidthHeight() / 2) * 0.8;
  }

  isSmall(): boolean {
    return this.small;
  }

  isAsteroid() {
    return true;
  }

  isBullet() {
    return false;
  }

  collided(object: GameObject) {
    if (!object.isBullet()) return;
    this.dead = true;
  }

  alive() {
    return !this.dead;
  }

  static addAsteroid(gameTick: number, bigAsteroidCount: number): Asteroid[] {
    if (gameTick % 240 === 0 && bigAsteroidCount < constants.maxAsteroidCount) {
      return [new Asteroid(false)];
    }
    return [];
  }

  onDeadReturn(state: GameState) {
    const children = this.break();
    children.forEach((child) => state.addAsteroid(child));
    state.addPoints(
      this.small ? constants.smallAsteroidPoints : constants.bigAsteroidPoints
    );
  }
}

export default Asteroid;
