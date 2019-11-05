import { Arc } from "./arc.model";

export class EntityType {
  name: string;
  type: string;
  labels: string[];
  bgColor: string;
  borderColor: string;
  unused: boolean;
  arcs: Arc[];
  children: EntityType[];

  constructor(
    name: string = "",
    type: string = "",
    labels: string[] = [],
    bgColor: string = "",
    borderColor: string = "",
    unused: boolean = false,
    arcs: Arc[] = [],
    children: EntityType[] = []
  ) {
    this.name = name;
    this.type = type;
    this.labels = labels;
    this.bgColor = bgColor;
    this.arcs = arcs;
    this.children = children;
    this.unused = unused;
    this.borderColor = borderColor;
  }
}
