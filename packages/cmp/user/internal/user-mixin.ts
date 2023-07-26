
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class UserMixinInterface {
  /** the user id */
  uid: string
  get profilePath(): string;
  get photoPath(): string;
  get emailPath(): string;
  get namePath(): string;
}
/**
 * UserMixin 
 */
export const UserMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class UserMixinClass extends superClass {

    @property() uid!: String;

    get profilePath() {
      return `/userData/profile/${this.uid || ''}`;
    }
    get photoPath() {
      return `${this.profilePath}/photoURL`;
    }
    get emailPath() {
      return `${this.profilePath}/email`;
    }
    get namePath() {
      return `${this.profilePath}/displayName`;
    }

  };
  // Cast return type to your mixin's interface intersected with the superClass type
  return UserMixinClass as unknown as Constructor<UserMixinInterface> & T;
}

export default UserMixin;

