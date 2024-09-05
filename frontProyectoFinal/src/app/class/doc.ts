export class Doc {
  id: string |"";
  name: string |"";
  document: string | "";
  owner: string | undefined;
  shared: string | "";
  signatures: string | undefined;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.document = data.doc;
    this.owner = data.owner;
    this.shared = data.shared;
    this.signatures = data.signatures;
  }

}
