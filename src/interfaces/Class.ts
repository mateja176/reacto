export interface Class {
  _id: string;
}
export interface Named {
  name: string;
}
export interface NamedClass extends Class, Named {}
