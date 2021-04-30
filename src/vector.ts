export default class Vector {
  constructor(public x: number, public y: number) {}
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  angle() {
    return (Math.atan2(this.y, this.x) * 180) / Math.PI;
  }
}

export const addVectors = (v1: Vector, v2: Vector): Vector => {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
};

export const subVectors = (v1: Vector, v2: Vector): Vector => {
  return new Vector(v1.x - v2.x, v1.y - v2.y);
};
export const scaleVector = (v: Vector, s: number): Vector => {
  return new Vector(v.x * s, v.y * s);
};

export const unitVector = (v: Vector) => {
  const magnitude = v.magnitude();
  return scaleVector(v, 1 / magnitude);
};

export const scaleToMagnitude = (v: Vector, m: number) => {
  return scaleVector(unitVector(v), m);
};

export const fromMagAng = (magnitude: number, angle: number) => {
  const radians = (Math.PI / 180) * angle;
  return new Vector(
    magnitude * Math.cos(radians),
    magnitude * Math.sin(radians)
  );
};
