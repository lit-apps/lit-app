
import { LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js'
import { UserProfileT } from './types.js';
import { FirestoreDocumentController } from '@preignition/lit-firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';


declare global {
  interface HTMLElementEventMap {

  }
}

export declare class UserMixinInterface {
  /** the user id */
  uid: string
  get profile(): UserProfileT | undefined;
  get photoURL(): UserProfileT['photoURL'];
  get email(): UserProfileT['email'];
  get isDeleted(): UserProfileT['deleted'];
  get displayName(): UserProfileT['displayName'];
  get isLoading(): boolean;
}

type BaseT = LitElement & {}
/**
 * UserMixin  
 */
export const UserMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, UserMixinInterface> => {


  abstract class UserMixinClass extends superClass {

    @property() uid!: string;
    @state() _profile!: UserProfileT;

    _hasError = false;

    userController!: FirestoreDocumentController<UserProfileT>;


    override connectedCallback() {
      super.connectedCallback();
      // we have an error when we do not have the right to read the user profile
      this.addEventListener('error', (e: Event) => {
        e.stopPropagation();
        this._hasError = true;
        this.setUserController();
      })
    }

    protected override willUpdate(_changedProperties: PropertyValues<this>): void {
      super.willUpdate(_changedProperties);
      if (_changedProperties.has('uid')) {
        this._hasError = false;
        this.setUserController();
      }
    }

    private setUserController() {
      if (this.userController) {
        this.userController.unsubscribe();
      }
      const path = this._hasError ? `user/${this.uid}` : `user/${this.uid}/private/profile`;
      // initialize a read to the user profile
      this.userController = new FirestoreDocumentController<UserProfileT>(
        this,
        doc(getFirestore(), path),
        undefined,
        (controller) => this._profile = controller.data
      );
    }

    get profile() {
      return this._profile
    }
    get photoURL() {
      return this._profile?.photoURL;
    }
    get email() {
      return this._profile?.email;
    }
    get displayName() {
      return this._profile?.displayName;
    }
    get isDeleted() {
      return this._profile?.deleted || (this._profile === null);
    }
    get isLoading() {
      return this.userController?.loading || false;
    }

  };
  return UserMixinClass;
}

export default UserMixin;

