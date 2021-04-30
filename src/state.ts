import Bullet from './bullet';
import Ship from './ship';
import Asteroid from './asteroid';
import constants from './constants';

class GameState {
  private ship: Ship;
  private paused: boolean;
  private bullets: Bullet[];
  private deadBullets: Bullet[];
  private asteroids: Asteroid[];
  private deadAsteroids: Asteroid[];
  private tickCount: number;

  constructor() {
    this.resetState();
  }

  resetState() {
    this.ship = new Ship();
    this.paused = true;
    this.deadBullets = this.bullets || [];
    this.bullets = [];
    this.deadAsteroids = this.asteroids || [];
    this.asteroids = [];
    this.tickCount = 0;
  }

  render(svg: any) {
    this.ship.render(svg);
    this.bullets.forEach((bullet) => bullet.render(svg));
    this.deadBullets.forEach((bullet) => bullet.remove(svg));
    this.asteroids.forEach((asteroid) => asteroid.render(svg));
    this.deadAsteroids.forEach((asteroid) => asteroid.remove(svg));
    this.deadBullets = [];
    this.deadAsteroids = [];
    const message = document.getElementById('message');
    message.style.visibility = this.paused ? 'visible' : 'hidden';
  }

  tick() {
    this.ship.tick();
    this.bullets.forEach((bullet) => bullet.tick());
    this.deadBullets = this.bullets.filter((bullet) => !bullet.alive());
    this.bullets = this.bullets.filter((bullet) => bullet.alive());
    this.asteroids.forEach((asteroid) => asteroid.tick());
    if (
      this.tickCount % 240 === 0 &&
      this.asteroids.length < constants.maxAsteroidCount
    ) {
      this.asteroids.push(new Asteroid(false));
    }
    this.handleCollisions();
    this.tickCount += 1;
  }

  handleCollisions() {
    for (let bullet of this.bullets) {
      for (let asteroid of this.asteroids) {
        if (!bullet.collidingWith(asteroid)) continue;
        // Add children asteroids to asteroid list
        const subAsteroids = asteroid.break();
        this.asteroids = this.asteroids.concat(subAsteroids);
        // Add dead asteroid to be derendered
        this.deadAsteroids.push(asteroid);
        // Remove dead asteroid from list of asteroids
        this.asteroids = this.asteroids.filter((a) => a !== asteroid);
        // Derender bullet
        this.deadBullets.push(bullet);
        // Remove bullet from list of bullets
        this.bullets = this.bullets.filter((b) => b !== bullet);
      }
    }
  }

  getPaused() {
    return this.paused;
  }

  togglePaused() {
    this.paused = !this.paused;
  }

  inputHandler(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'w') {
      this.ship.thrust();
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.ship.turnLeft();
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      this.ship.turnRight();
    } else if (event.key === ' ') {
      const bullet: Bullet = this.ship.shoot();
      this.bullets.push(bullet);
    }
  }
}

export default GameState;
