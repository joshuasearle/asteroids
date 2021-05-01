import Vector from './vector';

interface GameObject {
  tick(): void;
  render(svg: any): void;
  getRadius(): number;
  getPosition(): Vector;
  collided(object: GameObject): void;
  isAsteroid(): boolean;
  isBullet(): boolean;
  alive(): boolean;
  remove(svg: any): void;
  onDeadReturn(): GameObject[];
}

export default GameObject;
