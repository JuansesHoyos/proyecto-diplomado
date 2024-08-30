export class Login {
  username: string | undefined;
  password: string | undefined;
  token: string | undefined;

  constructor(data: any) {
    this.username = data.username;
    this.password = data.password;
    this.token = data.token;
  }
}
