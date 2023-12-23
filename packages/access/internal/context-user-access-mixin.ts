import type { UserUidRoleT } from '@lit-app/cmp/user/internal/types';
import { ResourceI } from '@lit-app/model';
import { ContextProvider, consume, createContext } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';
import usersFromData from './usersFromData';
import { FirestoreDocumentController } from '@preignition/lit-firebase';
import { doc, getFirestore } from 'firebase/firestore';

export const userAccessContext = createContext<UserUidRoleT[]>('user-access');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeUserAccessMixin a mixin that consumes userAccess context
 */
export declare class UserAccessMixinConsumeInterface {
	accessUsers: UserUidRoleT[];
}
export declare class UserAccessMixinProvideInterface {

}

export const ConsumeUserAccessMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeUserAccessMixinClass extends superClass {
		@consume({ context: userAccessContext, subscribe: true })
		@state() accessUsers!: UserUidRoleT[];

	};
	return ContextConsumeUserAccessMixinClass as unknown as Constructor<UserAccessMixinConsumeInterface> & T;
}

/**
 * ProvideUserAccessMixin a mixin that uids of users belonging to the team on an entity
 * 
 * It reacts on data change; fetches the team owning the entity and reads all uids of users belonging to the team
 */
export const ProvideUserAccessMixin = <T extends Constructor<ReactiveElement & { data: any }>>(superClass: T) => {

	class ContextProvideUserAccessMixinClass extends superClass {

		private accessUserProvider = new ContextProvider(this, { context: userAccessContext });
		private accessUserController!: FirestoreDocumentController<ResourceI>;

		async setupTeamID(teamID: string) {
			console.log('setupTeamID', teamID);
			if (teamID) {
				this.accessUserController?.hostDisconnected();
				// we set a reactive controller linking to the actor in the db
				this.accessUserController = new FirestoreDocumentController<ResourceI>(
					this,
					doc(getFirestore(), `/app/customer/team/${teamID}`),
					undefined,
					(controller) => {
						const data = controller.data;
						if (this.isConnected && !data && controller.loading === false) {
							throw new Error(`team ${teamID} not found`)
						}
						if (data) {
							const users = usersFromData(data);
							this.accessUserProvider.setValue(users);
						}
					}
				)
				// this will subscribe to remote
				this.accessUserController.hostConnected();
			}
		}

		override willUpdate(props: PropertyValues<this>) {
			super.willUpdate(props);
			if (props.has('data')) {
				const team = this.data?.metaData?.access?.team;
				this.setupTeamID(team);
			}
		}

	};

	return ContextProvideUserAccessMixinClass as unknown as Constructor<UserAccessMixinProvideInterface> & T;
}
