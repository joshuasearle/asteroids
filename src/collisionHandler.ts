import GameObject from './gameObject';
import { subVectors } from './vector';

const collisionHandler = (object1: GameObject, object2: GameObject) => {
  if (!colliding(object1, object2)) return;
  object1.collided(object2);
  object2.collided(object1);
};

const colliding = (object1: GameObject, object2: GameObject) => {
  // Distance between the two centers
  const centerDifference = subVectors(
    object1.getPosition(),
    object2.getPosition()
  ).magnitude();
  // Distance between the two edges of the objects
  // (hitboxes are just circles)
  const edgeDifference =
    centerDifference - object1.getRadius() - object2.getRadius();

  // If the distance between the edges is zero or less, it has collided
  return edgeDifference < 0;
};

export default collisionHandler;
