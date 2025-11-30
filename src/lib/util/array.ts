export { }

type EvaluationFunction<T> = (e: T) => boolean;

declare global {
  interface Array<T> {
    move(from: number, to: number): void;
    removeAt(index: number): T;
    remove(object: T): T;
    removeWhere(fn: EvaluationFunction<T>): T;
    clear(): void;
    equals(other: Array<T>): boolean;
  }
}

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}

Array.prototype.removeAt = function (index) {
  return this.splice(index, 1);
}

Array.prototype.remove = function (object) {
  this.removeAt(this.findIndex((v) => v == object));
}

Array.prototype.removeWhere = function (fn) {
  return this.removeAt(this.findIndex((a) => fn(a)))
}

Array.prototype.clear = function () {
  this.splice(0, this.length);
}

Array.prototype.equals = function (other) {
  if (other.length != this.length) return false;
  if (typeof other[0] != typeof this[0]) return false;
  return this.every((v, i) => v == other[i]);
}
