import { ProtoExtends } from "@lit-app/shared/types.js"

/**
 * Represents an email with optional fields for various email components.
 */
export type EmailT = {
	to?: string | null
	cc?: string | null
	bcc?: string | null
	subject?: string | null
	text?: string | null
	replyTo?: string | null
}
export type EmailDialogT = EmailT & {
	heading?: string | null
}

type EntityType = 'user' | 'organisation'
export type CallToAction = {
	id?: string
	entity: {
		[key in EntityType]: string
	}
}
type To = {
	to: string,
	// template?: EmailTemplate
	action?: CallToAction
	target: {
		entity: string
		entityID: string
	}
}

export type EmailDataT = EmailT & {
	isBulk?: boolean
	isTest?: boolean
	// we need to send the domain because cloud function need to know which template to use
	origin: string
	// Note(CG): we need to send entityTarget so as to count messages sent
	target: {
		entity: string
		entityID: string
	}
	// template?: EmailData
	action?: CallToAction
	team: string

}
export type EmailBulkDataT = ProtoExtends<EmailT, {
	to: To[]
	action?: {
		id: string
	}
	// we need to send the domain because cloud function need to know which template to use
	origin: string
	team: string

}>;