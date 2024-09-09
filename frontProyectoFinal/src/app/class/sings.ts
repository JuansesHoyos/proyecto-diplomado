export class Sings {
  username: string | "";
  sign: string | "";

  constructor(data: any) {
    this.username = data.username;
    this.sign = data.sign;
  }
}
