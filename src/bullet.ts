import Vector, { fromMagAng, subVectors } from './vector';
import GameObject from './gameObject';
import constants from './constants';
import { handleVelocity } from './moveBehaviour';
import Asteroid from './asteroid';

class Bullet implements GameObject {
  private position: Vector;
  private velocity: Vector;
  private bulletId: number;
  private hit: boolean;
  static nextBulletId: number = 0;

  constructor(position: Vector, angle: number) {
    this.position = position;
    this.velocity = fromMagAng(constants.bulletSpeed, angle);
    this.hit = false;
    this.bulletId = Bullet.nextBulletId;
    Bullet.nextBulletId += 1;
  }

  getIdString(): string {
    return `bullet${this.bulletId}`;
  }

  tick() {
    this.position = handleVelocity(this.position, this.velocity, false);
  }

  alive() {
    if (this.hit) return false;
    if (this.position.x > window.innerWidth) return false;
    if (this.position.y > window.innerHeight) return false;
    if (this.position.x < 0) return false;
    if (this.position.y < 0) return false;
    return true;
  }

  collided(object: GameObject) {
    // If object is not asteroid, do nothing
    if (!object.isAsteroid()) return;
    this.hit = true;
  }

  remove(svg: any) {
    const bullet = document.getElementById(this.getIdString());
    if (!bullet) return;
    svg.removeChild(bullet);
  }

  createElement(svg: any) {
    const bullet = document.createElementNS(svg.namespaceURI, 'circle');
    svg.appendChild(bullet);
    bullet.classList.add('bullet');
    bullet.setAttribute('id', this.getIdString());
    bullet.setAttribute('r', String(constants.bulletRadius));
  }

  render(svg: any) {
    if (!document.getElementById(this.getIdString())) {
      this.createElement(svg);
    }
    const bullet = document.getElementById(this.getIdString());

    const translateString = `translate(${this.position.x}, ${this.position.y})`;

    bullet.setAttribute('transform', translateString);
  }

  getRadius() {
    return constants.bulletRadius;
  }

  getPosition() {
    return this.position;
  }

  isAsteroid() {
    return false;
  }

  isBullet() {
    return true;
  }

  onDeadReturn(): GameObject[] {
    return [];
  }
}

export default Bullet;
