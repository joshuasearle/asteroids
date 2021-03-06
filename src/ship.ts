import Vector, { addVectors, scaleToMagnitude, fromMagAng } from './vector';
import constants from './constants';
import GameObject from './gameObject';
import { handleRotation, handleVelocity } from './moveBehaviour';
import Bullet from './bullet';

class Ship implements GameObject {
  // Position relative to the screen size
  private position: Vector;
  // Velocity in pixels per second
  private velocity: Vector;
  // Angle in degrees from the positive x-axis
  // Rotation of zero means facing to the right
  private rotation: number;
  // Degrees the ship moves per second
  private rpm: number;
  private dead: boolean;
  private remainingLives: number;
  private invulnerableTicksRemaining: number;

  constructor() {
    this.reset();
    this.remainingLives = 3;
    this.dead = false;
  }

  reset() {
    // Initially looking up
    this.rotation = 90;
    this.rpm = 0;
    this.invulnerableTicksRemaining = 60;
    this.center();
  }

  center() {
    this.position = new Vector(window.innerWidth / 2, window.innerHeight / 2);
    this.velocity = new Vector(0, 0);
  }

  public tick() {
    this.invulnerableTicksRemaining =
      this.invulnerableTicksRemaining <= 0
        ? 0
        : this.invulnerableTicksRemaining - 1;
    this.position = handleVelocity(this.position, this.velocity, true);
    this.rotation = handleRotation(this.rotation, this.rpm);
  }

  alive() {
    return !this.dead;
  }

  public thrust() {
    const rawThrustVector = fromMagAng(constants.thrust, this.rotation);
    const thrustVector = new Vector(rawThrustVector.x, -rawThrustVector.y);
    this.velocity = addVectors(this.velocity, thrustVector);
    if (this.velocity.magnitude() <= constants.maxVelocityMagnitude) return;
    this.velocity = scaleToMagnitude(
      this.velocity,
      constants.maxVelocityMagnitude
    );
  }

  public turnLeft() {
    this.rpm += constants.shipTurn;
    this.handleMaxRpm();
  }

  public turnRight() {
    this.rpm -= constants.shipTurn;
    this.handleMaxRpm();
  }

  handleMaxRpm() {
    if (this.rpm > constants.maxShipRpm) {
      this.rpm = constants.maxShipRpm;
    } else if (this.rpm < -constants.maxShipRpm) {
      this.rpm = -constants.maxShipRpm;
    }
  }

  shoot(): Bullet {
    const bullet = new Bullet(this.position, -this.rotation);
    return bullet;
  }

  createElement(svg: any) {
    const ship = document.createElementNS(svg.namespaceURI, 'polygon');
    svg.appendChild(ship);
    ship.setAttribute('id', 'ship');
    ship.setAttribute('points', '0,0 0,30 50,15');
  }

  getRemainingLives() {
    return this.remainingLives;
  }

  render(svg: any) {
    if (!document.getElementById('ship')) {
      this.createElement(svg);
    }
    const ship = document.getElementById('ship');

    const translateString = `translate(${this.position.x - 50 / 2}, ${
      this.position.y - 30 / 2
    })`;

    const rotateString = `rotate(${-this.rotation} ${50 / 2} ${30 / 2})`;
    const transformString = translateString + ' ' + rotateString + ' ';

    ship.setAttribute('transform', transformString);
  }

  getPosition() {
    return this.position;
  }

  getRadius() {
    return 15;
  }

  isAsteroid() {
    return false;
  }

  isBullet() {
    return false;
  }

  collided(object: GameObject) {
    if (this.invulnerableTicksRemaining !== 0) return;
    if (!object.isAsteroid()) return;
    this.remainingLives -= 1;
    this.dead = this.remainingLives < 0;
    this.invulnerableTicksRemaining = 60;
    if (this.remainingLives >= 0) this.center();
  }

  remove(svg: any) {
    const ship = document.getElementById('ship');
    if (!ship) return;
    svg.removeChild(ship);
  }

  onDeadReturn(): GameObject[] {
    return [];
  }
}

export default Ship;
