/**
 * Auth events that propagate all the way up to the app root
 * where they are handled
 */

type Password = 'password'
export type Provider = 'google' | 'facebook' | 'github' | 'twitter'| 'custom' | 'microsoft' | 'anonymous' | Password
export type CustomProvider = 'unicef' | 'wfp'

export interface AuthDetail {
	promise?: Promise<{message: string, uid?: string}>
	preventRedirect?: boolean // used to prevent application redirection when it is called
}

interface AuthSignInDetailPsw extends AuthDetail {
	email: string,
	password: string
	provider: Password
}

export interface AuthSignInDetailFederated extends AuthDetail {
	provider: Exclude<Provider, Password>
	customProvider?: CustomProvider
}

type AuthSignInDetail = AuthSignInDetailPsw | AuthSignInDetailFederated

type AuthConvertDetail = AuthSignInDetail & {displayName?: string}


// export type AuthSignUpDetail = AuthSignUpDetail1 | AuthSignUpDetail2
interface AuthSignUpDetail extends AuthDetail {
	email: string,
	password: string,
	displayName?: string
}


export class AuthSignOut extends CustomEvent<AuthDetail> {
	static readonly eventName = 'auth-sign-out';
	constructor(detail: AuthDetail = {}) {
		super(AuthSignOut.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
	}
}


export class AuthConvert extends CustomEvent<AuthConvertDetail> {
	static readonly eventName = 'auth-convert';
	constructor(detail: AuthConvertDetail) {
		super(AuthConvert.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
	}
}

export class AuthSignUp extends CustomEvent<AuthSignUpDetail> {
	static readonly eventName = 'auth-sign-up';
	constructor(detail: AuthSignUpDetail) {
		super(AuthSignUp.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
	}
}

export class AuthSignIn extends CustomEvent<AuthSignInDetail> {
	static readonly eventName = 'auth-sign-in';
	constructor(detail: AuthSignInDetail) {
		super(AuthSignIn.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
	}
}



export class AuthAction extends CustomEvent<AuthDetail> {
	static readonly eventName = 'auth-action';
	public actionType!: ActionType
	constructor(detail: AuthDetail, actionType?: ActionType) {
		super(AuthAction.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
		if (actionType) {
			this.actionType = actionType
		}
	}
}


/** Types to use for their respective action Type */
type Constructor<T = {}, D = {}> = new (detail: D ) => T;

/** function that extends type  */
function factory<Type = AuthAction>(actionType: ActionType) {
	class C extends AuthAction {
		override actionType = actionType
	}
	return C as unknown as Constructor<CustomEvent<Type>, Type>
}

type TokenKey =  'team' | 'customer' | 'buidActive' 
export interface RequestTokenUpdateDetail extends AuthDetail {
	key: TokenKey, // the token key to update those are end points of /api/v1/user
	value: string // the value to update to
	appID?: string // the appID to update the token for
}

export interface NotifyEmailNotReceived extends AuthDetail {
	team: string,
	email: string,
	message: string
}

// The type of entity that can request access
// @deprecated - we use requestAccess machine instead
type EntityType = 'organisation' | 'app' | 'user'
// The type of access that can be requested
// @deprecated - we use requestAccess machine instead
type AccessType = 'read' | 'write' | 'update' | 'delete' | 'owner'
export interface RequestAccess extends AuthDetail {
	context: {
		appID: string // e.g. gds
		organisationID: string // e.g. ida_secretariat
	}
	origin?: string // the origin of the request - since cloud function could not know
	request: {
		entityType: EntityType
		access: AccessType
		id: string // the id of the entity
	}
	target: {
		entityID: string
		entityName: string
	}
	message: string
}
/** Event for requesting access over an entity. */

export interface ResetEmail extends AuthDetail {
	email: string,
}


type ActionType =
	'sendEmailVerification' |
	'requestTokenUpdate' |
	'notifyEmailNotReceived' |
	'requestAccess' |
	'resetEmail' |
	'refreshToken'
export const RequestTokenUpdate = factory<RequestTokenUpdateDetail>('requestTokenUpdate')
// @deprecated - we use requestAccess machine instead
export const RequestAccess = factory<RequestAccess>('requestAccess')
export const NotifyEmailNotReceived = factory<NotifyEmailNotReceived>('notifyEmailNotReceived')
export const SendEmailVerification = factory<AuthDetail>('sendEmailVerification')
export const ResetEmail = factory<ResetEmail>('resetEmail')
export const RefreshToken = factory<AuthDetail>('refreshToken')

declare global {
	interface HTMLElementEventMap {
		'auth-sign-out': AuthSignOut,
		'auth-sign-up': AuthSignUp,
		'auth-sign-in': AuthSignIn,
		'auth-convert': AuthConvert,
		'auth-action': AuthAction
	}
}