
/*export class Relation {
  name: string;
  type: string;
  etiquettes: string[];
  color : string;
}*/
export class Relation {
  name: string;
  color: string;
  entity: string;
  constructor(name: string = '', color: string = '') {
    this.name = name;
    this.color = color;
    //this.entity = entiry;
  }
}
