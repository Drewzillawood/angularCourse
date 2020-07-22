export class User {

  constructor(public email: string,
              public id: string,
              public tokenExpirationDate: Date,
              private _token: string) {}

  get token(): string {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
