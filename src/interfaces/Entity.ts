export interface IEntity {
  id: string;
}
export interface WithName {
  name: string;
}
export interface NamedEntity extends IEntity, WithName {}
