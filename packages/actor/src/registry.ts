
import type Actor from './actor';

/**
 * Represents a registry for actors.
 */
class ActorRegistry {
	private static actors: Map<string, Actor> = new Map();

	/**
	 * Registers an actor in the registry.
	 * @param actor The actor to register.
	 */
	static register(actor: Actor) {
		if(!actor.actorId) throw new Error('Actor must have an ID to be registered.');
		ActorRegistry.actors.set(actor.actorId, actor);
	}

	/**
	 * Unregisters an actor from the registry.
	 * @param actor The actor to unregister.
	 */
	static unregister(actor: Actor) {
		ActorRegistry.actors.delete(actor.actorId!);
	}

	/**
	 * Retrieves an actor from the registry based on its ID.
	 * @param actorId The ID of the actor to retrieve.
	 * @returns The actor with the specified ID, or undefined if not found.
	 */
	static get(actorId: string): Actor | undefined {
		return ActorRegistry.actors.get(actorId);
	}

	/**
	 * Retrieves all actors from the registry.
	 * @returns An array of all actors in the registry.
	 */
	static getAll(): Actor[] {
		return Array.from(ActorRegistry.actors.values());
	}
}

// expose the ActorRegistry  on dev
if (import.meta.env.DEV) {
	// @ts-expect-error - expose the ActorRegistry on the window object
	window._actorRegistry = ActorRegistry;
}

export { ActorRegistry };
export default ActorRegistry;