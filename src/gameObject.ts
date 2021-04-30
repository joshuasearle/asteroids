interface GameObject {
  tick(): void;
  render(svg: any): void;
}

export default GameObject;
