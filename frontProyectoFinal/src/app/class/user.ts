export class User {
  userName:string | undefined;
  publicKey: string | undefined;
  privateKey: string | undefined;
  identificador: string | undefined;

  constructor(data: any) {
    this.userName = data.username;
    this.privateKey = data.private_key;
    this.publicKey = data.public_key;
    this.identificador = data.identificador;
  }
}


