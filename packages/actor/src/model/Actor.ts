import { Snapshot } from 'xstate';

export type HostT = 'client' | 'server' // where the actor is running on the client or on the server

export type SnapshotI<TContext, TError = any> = Snapshot<TContext>  & {
	context: TContext
	value: string
	error: TError // Snapshot<T>['error'] is unknown; this creates problems with the type of the error property in firebase withConverter 
}

export interface ActorUI<TContext extends Record<string, any> = any> {
	snapshot: SnapshotI<TContext>
	host: HostT
	origin: string // the origin of the request (e.g. http://accessiblesurveys.com)
	status: 'started' | 'running' | 'stopped' | 'error' | 'done' // running is when a could function is running; stopped is when the actor is stopped but not completed (not a final state)
}





 


