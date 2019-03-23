export interface ICocono {
  relay_to: string;
  content: any;
  stacks: ICoconoStack[];
}

export interface ICoconoParam {
  ref: string;
}

export interface ICoconoStack {
  type: string;
  ops: string;
  params: (string | ICoconoParam)[];
}
