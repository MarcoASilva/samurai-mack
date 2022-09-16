export class Config {
  constructor(configuration) {
    for (const prop in configuration) {
      this[prop] = configuration[prop];
    }
  }
}
