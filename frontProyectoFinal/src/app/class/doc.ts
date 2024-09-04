export class Doc {
  document: string | "";
  owner: string | undefined;
  shared: string | undefined;
  signatures: string | undefined;

  constructor(data: any) {
    this.document = data.doc;
    this.owner = data.owner;
    this.shared = data.shared;
    this.signatures = data.signatures;
  }

}
