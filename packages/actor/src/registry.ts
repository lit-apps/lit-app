import type Actor from './actor';

/**
 * Represents a registry for actors.
 */
class ActorRegistry {
	private static actors: Map<string, Actor<any, any>> = new Map();

	/**
	 * Registers an actor in the registry.
	 * @param actor The actor to register.
	 */
	static register(actor: Actor<any, any>) {
		if(!actor.actorId) throw new Error('Actor must have an ID to be registered.');
		ActorRegistry.actors.set(actor.actorId, actor);
	}

	/**
	 * Unregisters an actor from the registry.
	 * @param actor The actor to unregister.
	 */
	static unregister(actor: Actor<any, any>) {
		ActorRegistry.actors.delete(actor.actorId!);
	}

	/**
	 * Retrieves an actor from the registry based on its ID.
	 * @param actorId The ID of the actor to retrieve.
	 * @returns The actor with the specified ID, or undefined if not found.
	 */
	static get(actorId: string): Actor<any, any> | undefined {
		return ActorRegistry.actors.get(actorId);
	}

	/**
	 * Retrieves all actors from the registry.
	 * @returns An array of all actors in the registry.
	 */
	static getAll(): Actor<any, any>[] {
		return Array.from(ActorRegistry.actors.values());
	}
}

// expose the ActorRegistry  on dev
// @ts-ignore
if (import.meta.env.DEV) {
	// @ts-ignore
	window._actorRegistry = ActorRegistry;
}

export { ActorRegistry };
export default ActorRegistry;