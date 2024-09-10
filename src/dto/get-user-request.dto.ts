export class GetUserEmail {
  constructor(public readonly email: string) {}

  toString() {
    return JSON.stringify({
      userId: this.email,
    });
  }
}
