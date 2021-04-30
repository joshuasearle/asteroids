import Vector, { scaleVector, addVectors } from './vector';
import constants from './constants';

const handleVelocity = (position: Vector, velocity: Vector, wrap: boolean) => {
  const scaledVelocity = scaleVector(velocity, 1 / constants.ticksPerSecond);
  const cumulativePosition = addVectors(position, scaledVelocity);
  if (wrap) handlePositionWrap(cumulativePosition);
  return cumulativePosition;
};

const handlePositionWrap = (position: Vector) => {
  position.x = position.x % window.innerWidth;
  position.y = position.y % window.innerHeight;
  if (position.x < 0) position.x = window.innerWidth;
  if (position.y < 0) position.y = window.innerHeight;
};

const handleRotation = (rotation: number, rpm: number) => {
  const revolutionsPerSecond = rpm / 60;
  const revolutionsPerMs = revolutionsPerSecond / 60;
  const degreesToMove = revolutionsPerMs * 360;
  return (rotation + degreesToMove) % 360;
};

export { handleVelocity, handleRotation };
