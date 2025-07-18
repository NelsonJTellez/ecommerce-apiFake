export type Callback = () => void;

export class Observable {
  private subs: Callback[] = [];

  suscribir(fn: Callback) {
    this.subs.push(fn);
  }

  desuscribir(fn: Callback) {
    this.subs = this.subs.filter(f => f !== fn);
  }

  protected emitir() {
    this.subs.forEach(fn => fn());
  }
}
