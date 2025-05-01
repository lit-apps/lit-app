import { ReactiveController, ReactiveControllerHost } from 'lit';
import { AudioController } from './audio-controller';
import { SpeechController } from './speech-controller';
import { PlayerI, SpeechConfigI } from './types';

/**
 * A controller that manages the audio player. 
 * There is a fallback mode that will user SpeechSynthesisUtterance if 
 * the audio is not supported or no source is provided.
 * 
 * TODO: 
 * - [ ] handle passing error to host
 * - [ ] review ready state 
 * 
 */


export class PlayerController implements ReactiveController, PlayerI {

	private audioController: AudioController | undefined;
	private speechController: SpeechController | undefined;

	get speaking() {
		return !!this.controller?.speaking;
	}

	get paused() {
		return !!this.controller?.paused;
	}

	_error!: string
	_src: string | undefined
	_speech: string | undefined
	_speechConfig: SpeechConfigI | undefined

	get error() {
		return this.controller?.error || this._error;
	}
	set error(value: string) {
		this._error = value;
		this.host.requestUpdate();
	}

	get ready() {
		return !!this.controller?.ready;
	}

	get src() {
		return this._src;
	}
	set src(value: string | undefined) {
		this._src = value;
		if (value && this.audioController) {
			this.audioController.src = value;
		}
	}

	get speech() {
		return this._speech;
	}
	set speech(value: string | undefined) {
		this._speech = value;
		if (value && this.speechController) {
			this.speechController.speech = value;
		}
	}

	get speechConfig() {
		return this._speechConfig;
	}
	set speechConfig(value: SpeechConfigI | undefined) {
		this._speechConfig = value;
		if (value && this.speechController) {
			this.speechController.config = value;
		}
	}

	get controller() {
		if (this.audioController && !this.audioController.error) {
			return this.audioController;
		}
		else if (this.speechController && !this.speechController.error) {
			return this.speechController;
		}
		this.error = 'No audio or speech controller available';
		return null
	}
	constructor(
		protected host: ReactiveControllerHost,
		src?: string,
		speech?: string,
		speechConfig?: SpeechConfigI) {
		// Register for lifecycle updates
		if (src) {
			this.src = src;
		}
		if (speech) {
			this.speech = speech;
		}
		if (speechConfig) {
			this.speechConfig = speechConfig;
		}
		host.addController(this);
	}

	async play() {
		await this.controller?.play();
	}
	pause() {
		this.controller?.pause();
	}
	stop() {
		this.controller?.stop();
	}

	async restart() {
		await this.controller?.restart();
	}
	dispose() {
		this.audioController?.dispose();
		this.speechController?.dispose();
		this.audioController = undefined;
		this.speechController = undefined;
	}

	attachControllers() {
		if (this.src) {
			this.audioController = new AudioController(this.host, this.src);
		} if (this.speech) {
			this.speechController = new SpeechController(this.host, this.speech, this.speechConfig);
		}
	}
	hostConnected(): void {
		this.attachControllers();
	}
	hostDisconnected(): void {
		this.dispose()
	}
}