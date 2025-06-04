/**
 * A controller that manages the speech synthesis.
 */

import { ToastEvent } from '@lit-app/shared/event';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { cancelSynth } from './speech-controller';
import { PlayerI } from './types';


let pauseTimeout: NodeJS.Timeout;
let activeAudio: HTMLAudioElement | null;

export function cancelAudio() {
	if (activeAudio) {
		activeAudio.pause();
	}
	if (pauseTimeout) {
		clearTimeout(pauseTimeout);
	}
}
export class AudioController implements ReactiveController, PlayerI {
	audio!: HTMLAudioElement | null;
	private _src!: string;

	get speaking() {
		const sp = ((this.audio?.currentTime || 0) > 0) && !this.audio?.paused && !this.audio?.ended;
		console.log('Speaking', sp, this.audio?.currentTime, this.audio?.paused, this.audio?.ended);
		return sp
	}

	get paused() {
		return !!this.audio?.paused && !this.audio?.ended;
	}
	get error() {
		return this.audio?.error?.message;
	}
	get ready() {
		return this.audio?.readyState === 4;
	}

	get src() {
		return this._src;
	}
	set src(value: string) {
		this._src = value;
		console.log('Set Src', value);
		if (this.audio && value) {
			const paused = this.paused;
			this.pause();
			this.createAudio(this.src)
			if (!paused) {
				this.play();
			}
		}
	}

	constructor(protected host: ReactiveControllerHost, src?: string) {
		// Register for lifecycle updates
		host.addController(this);
		if (src) {
			this.src = src;
		}
	}

	private createAudio(src: string = this.src) {
		try {
			this.audio = new Audio(src);
			this.audio.preload = 'auto';
			this.audio.oncanplay = (e) => {
				console.log('Audio Can Play', e, this.audio?.paused);
				this.host.requestUpdate();
			}
			this.audio.onloadedmetadata = (e) => {
				console.log('Audio Loaded Metadata', e, this.audio?.paused);
			}
			this.audio.onloadeddata = (e) => {
				console.log('Audio Loaded Data', e, this.audio?.paused);
			}
			this.audio.onplay = (e) => {
				console.log('Audio Play', e);
				this.host.requestUpdate();
			}
			this.audio.onpause = (e) => {
				console.log('Audio Pause', e);
				this.host.requestUpdate();
			}
			this.audio.onended = (e) => {
				console.log('Audio Ended', e);
				this.host.requestUpdate();
			}
			this.audio.onerror = (e) => {
				console.error('Audio Error', e);
				const toastEvent = new ToastEvent(`Error while loading audio: ${e}`, 'error');
				(this.host as unknown as HTMLElement).dispatchEvent(toastEvent);
				this.host.requestUpdate();
			}
		} catch (error) {
			// this.error = error.message
			console.error('Caught Error', error);
		}

		// audio.play();

	}
	pause() {
		pauseTimeout = setTimeout(() => {
			this.stop();
		}, 6000)
		this.audio!.pause();
	}
	async play() {
		cancelSynth();

		if (!this.audio) {
			this.createAudio(this._src);
		}
		activeAudio = this.audio;
		if (pauseTimeout) {
			clearTimeout(pauseTimeout);
		}
		this.audio!.play();
	}

	async restart() {
		cancelSynth();
		if (pauseTimeout) {
			clearTimeout(pauseTimeout);
		}
		activeAudio = this.audio;
		this.audio!.currentTime = 0;
		this.audio!.play();
	}
	dispose() {
		this.audio?.pause();
		this.audio = null;
	}
	stop() {
		this.audio!.currentTime = this.audio!.duration;
		this.audio!.play();
		clearTimeout(pauseTimeout);
		this.host.requestUpdate();
	}
	hostConnected(): void {
		this.createAudio(this.src);
		// this.state.addEventListener(StateEvent.eventName, this.callback);
		// this.callback();

	}
	hostDisconnected(): void {
		this.dispose()
	}

}