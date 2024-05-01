export class Maybe {
  value = null;
  static Just(v) {
    const r = new Maybe();
    r.value = v;
    return r;
  }
  static Nothing() {
    const r = new Maybe();
    r.value = null;
    return r;
  }
  static maybe(v) {
    return v === undefined || v === null ? Maybe.Nothing() : Maybe.Just(v);
  }
  isPresentAnd(ifp) {
    return this.mapLazy(ifp, () => false);
  }
  isPresent() {
    return this.value !== null;
  }
  map2(ifp, ife) {
    return this.value === null || this.value === undefined
      ? ife
      : ifp(this.value);
  }
  mapLazy(ifp, ife) {
    return this.value === null || this.value === undefined
      ? typeof ife === 'function'
        ? ife()
        : ife
      : ifp(this.value);
  }
  map(f) {
    return this.map2(x => Maybe.Just(f(x)), Maybe.Nothing());
  }
  flatMap(f) {
    return joinM(this.map(f));
  }
  oMap(f) {
    return this.map2(x => Maybe.maybe(f(x)), Maybe.Nothing());
  }
  ifPresentOrElse(ifp, ife) {
    this.mapLazy(ifp, ife);
  }
  ifPresent(ifp) {
    this.ifPresentOrElse(ifp, () => {});
  }
  ifAbsent(ifa) {
    this.ifPresentOrElse(() => {}, ifa);
  }
  isAbsent() {
    return !this.isPresent();
  }
  getOrThrow() {
    if (this.value === null) {
      throw new Error('Accessing optional nothing');
    }
    return this.value;
  }
  get() {
    return this.value;
  }
  orElseF(f) {
    return this.mapLazy(v => v, f);
  }
  orElse(x) {
    return this.mapLazy(
      v => v,
      () => x,
    );
  }
  ifMap(P, ifs, ifn) {
    return this.mapLazy(x => (P(x) ? ifs(x) : ifn()), ifn);
  }
  is(P) {
    return joinM(this.map(x => (P(x) ? Just(x) : Nothing())));
  }
  filter(P) {
    return joinM(this.map(x => (P(x) ? Just(x) : Nothing())));
  }
  zip(o) {
    return joinM(this.map(x => o.map(y => [x, y])));
  }
  zipWith(o, f) {
    return this.zip(o).map(f);
  }
  equals(o, P) {
    return this.zipWith(o, P !== undefined ? P : ([a, b]) => a === b).orElse(
      false,
    );
  }
  includes(v) {
    return this.map2(x => x === v, false);
  }
}

export const maybe = Maybe.maybe;
export const Just = Maybe.Just;
export const Nothing = Maybe.Nothing;

export const joinM = x =>
  x.map2(y => y.map2(z => Just(z), Nothing()), Nothing());
