import { html, css, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '@lit-app/state';
import ActorState from '@lit-app/firebase-fsm/src/actorState';


const src = [
	'https://audio.transistor.fm/m/shows/40155/2658917e74139f25a86a88d346d71324.mp3',
	'https://ecouter.laplanetebleue.com/laplanetebleue1015-37e0a58.mp3'

]
type SpeechConfig = {
	language: string;
	rate: number;
	pitch: number;
}
import '@material/web/button/filled-button.js';
import { PlayerController } from './internal/player-controller';
/**
 * A component to listen to audio
 *  
 */

@customElement('lapp-audio')
export default class lappAudio extends LitElement {

	bindActorState!: StateController<ActorState> // = new StateController(this, actorState)

	playerController = new PlayerController(this, src[0], 'this is some text to speech', { pitch: 1, rate: 1, language: 'en' });
	static override styles = css`
			:host {}
		`;

	/**
	 * the audio source
	 */
	@property() src: string = src[0];
	@property() speech: string = 'this is some text to speech';
	@property({ attribute: false }) speechConfig: SpeechConfig = { pitch: 1, rate: 1, language: 'en' };
	@property() crossOrigin: 'anonymous' | 'use-credentials' = 'anonymous';

	// override willUpdate(props: PropertyValues<this>) {
	// 	if (props.has('speech') || props.has('speechConfig')  || props.has('src')) {
	// 		this.bindMachine();
	// 	}
	// 	super.willUpdate(props);
	// }



	override render() {
		// const onEnded = () => actorState.send({ type: 'end' });
		const play = () => this.playerController.play();
		const pause = () => this.playerController.pause();
		const restart = () => this.playerController.restart();
		console.log('render', this.playerController,  this.playerController.paused, this.playerController.error);
		// ${actorState.matches( 'Loading' ) ? html`Loading ...` : nothing}
		// ${actorState.matches( 'Init' ) ? html`Init ...` : nothing}
		// ${actorState.matches({ Active: 'Paused' }) ? html`<md-filled-button @click=${play}>play</md-filled-button>` : nothing}
		return html`

			${this.playerController.error ? html`Error: ${this.playerController.error}` : nothing}
			${this.playerController.paused ? html`<md-filled-button @click=${play}>play</md-filled-button>` : nothing}
			${!this.playerController.paused ? html`<md-filled-button @click=${pause}>pause</md-filled-button>` : nothing}
			<div>
				<md-filled-button @click=${() => this.playerController.src = this.playerController.src === src[0] ? src[1] : src[0] }>switch</md-filled-button>
			</div>
		`;
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'lapp-audio': lappAudio;
	}
}
