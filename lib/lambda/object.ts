export interface ICocono {
  relay_to: string;
  content: any;
  stacks: ICoconoStack[];
}

export interface ICoconoParam {
  ref: string;
}

export interface ICoconoStack {
  type: "filter";
  ops: "==" | "!=" | "~=";
  params: (string | ICoconoParam)[];
}