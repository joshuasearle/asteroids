import Vector, {
  addVectors,
  scaleVector,
  scaleToMagnitude,
  fromMagAng,
} from './vector';
import constants from './constants';
import GameObject from './gameObject';

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

  constructor() {
    this.position = new Vector(window.innerWidth / 2, window.innerHeight / 2);
    this.velocity = new Vector(0, 0);
    // Initially looking up
    this.rotation = 90;
    this.rpm = 0;
  }

  // Need to bind this as method is being called from not in the class
  inputHandler = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowUp') this.thrust();
    else if (event.key === 'ArrowLeft') this.turnLeft();
    else if (event.key === 'ArrowRight') this.turnRight();
  };

  public tick() {
    this.handleVelocity();
    this.handleRotation();
  }

  handleVelocity() {
    const scaledVelocity = scaleVector(
      this.velocity,
      1 / constants.ticksPerSecond
    );
    this.position = addVectors(this.position, scaledVelocity);
    this.handlePositionWrap();
  }

  handleRotation() {
    const revolutionsPerSecond = this.rpm / 60;
    const revolutionsPerMs = revolutionsPerSecond / 60;
    const degreesToMove = revolutionsPerMs * 360;
    this.rotation = (this.rotation + degreesToMove) % 360;
  }

  handlePositionWrap() {
    this.position.x = this.position.x % window.innerWidth;
    this.position.y = this.position.y % window.innerHeight;
    if (this.position.x < 0) this.position.x = window.innerWidth;
    if (this.position.y < 0) this.position.y = window.innerHeight;
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

  createElement(svg: any) {
    const ship = document.createElementNS(svg.namespaceURI, 'polygon');
    svg.appendChild(ship);
    ship.setAttribute('id', 'ship');
    ship.setAttribute('points', '0,0 0,30 50,15');
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
}

export default Ship;
