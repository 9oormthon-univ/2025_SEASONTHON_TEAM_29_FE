declare module 'poly-decomp' {
  type Vec = [number, number];
  type Polygon = Vec[];
  interface PolyDecomp {
    decomp(vertices: Polygon): Polygon[];
    quickDecomp(vertices: Polygon, result?: Polygon[]): void;
    makeCCW(vertices: Polygon): void;
  }
  const decomp: PolyDecomp;
  export default decomp;
}