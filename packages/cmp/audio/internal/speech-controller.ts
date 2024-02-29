import { ReactiveController, ReactiveControllerHost } from 'lit';
import { PlayerI, SpeechConfigI } from './types';
import hasTouchscreen from '@lit-app/shared/hasTouchscreen';
import { ToastEvent } from '@lit-app/event';
import { cancelAudio } from './audio-controller';

// Note(CG): we need a different implementation for chrome and firefox as 
// chrome stops after some time and FF do not support pause
const isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
const touchscreen = hasTouchscreen();
let synth = window.speechSynthesis;

let voice;
let voices: SpeechSynthesisVoice[] = [];
let countPopulate = 0;
const populateVoice = async () => {
	voices = synth.getVoices();

	if (!voices.length && countPopulate < 10) {
		countPopulate++;
		await wait(500);
		voices = await populateVoice();
	}
	return voices;
};

const setVoice = (locale) => {
	voice = voices.find(v => v.lang === locale);
	console.log('Voice', voice, locale);
	if (!voice) {
		voice = voices.find(v => v.lang.startsWith(locale));
	}
	if (!voice) {
		throw new Error('synth:noVoice');
	}
};

let initiated = false;
let count = 0;
const init = async () => {
	if (initiated) {
		return;
	}
	synth = window.speechSynthesis;
	if (!synth) {
		count++;
		// Note(CG): we give some more time instantiate speechSynthesis
		if (count < 10) {
			return setTimeout(init, 500);
		}
		throw new Error('synth:notSupported');
	}
	const voices = await populateVoice();
	if (!voices.length) {
		throw new Error('synth:emptyVoices');
	}
	setVoice(navigator.language || 'en-GB');
	initiated = true;
}

let pauseTimeout; // we reset the controller when paused after 6 seconds
let synthTimeout; 
async function synthTimer() {
	// Note(CG): removing pause as it seems to cause problems in chrome android
	// https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
	if (!touchscreen) {
		synth.pause();
		await wait(5);
	}
	synth.resume();
	synthTimeout = setTimeout(synthTimer, 10000);
}

const clear = () => {
	if (synthTimeout) {
		clearTimeout(synthTimeout);
	}
}
const utter = (utterance: SpeechSynthesisUtterance, paused: boolean) => {
	if (!isFF) {
		if (!paused) {
			synth.cancel();
		}
		clear();
		synthTimer()
	}
	paused ? synth.resume() : synth.speak(utterance);
}
const applyConfig = (utterance: SpeechSynthesisUtterance, config: SpeechConfigI) => {
	utterance.voice = voice
	utterance.pitch = config.pitch || 1
	utterance.rate = config.rate || 1
	// Always set the utterance language to the utterance voice's language
	// to prevent unspecified behavior.
	utterance.lang = utterance.voice?.lang || '';
}

/**
 * Cancels all queued voices to the speech synthesis.
 * This is called for instance when the user navigates away from a page.
 */
export function cancelSynth() {
	clear()
	synth?.cancel();
};

/**
 * A controller that manages the speech synthesis.
 */
export class SpeechController implements ReactiveController, PlayerI {

	private utterance: SpeechSynthesisUtterance | undefined;
	private _speech: string
	private _error: string
	private _speaking: boolean = false
	private _paused: boolean = false // we need to keep track of the paused state because of https://issues.chromium.org/issues/40885979
	private _config: SpeechConfigI = {
		language: 'en-GB',
		rate: 1,
		pitch: 1
	}

	get config() {
		return this._config;
	}
	set config(value: SpeechConfigI) {
		try {
			if (value.language && value.language !== this._config.language && voices.length) {
				setVoice(value.language);
			}
			this._config = value;
		} catch (e) {
			this.error = e.message;

		}
	}

	get speech() {
		return this._speech;
	}
	set speech(value: string) {
		const old = this._speech
		this._speech = value;
		// only create utterance is already set 
		if (this.utterance && value) {
			if (old !== this._speech) {
				synth.cancel()
			}
			this.createUtterance();
		}
	}
	get speaking() {
		return this._speaking
	}
	set speaking(value: boolean) {
		const old = this._speaking
		this._speaking = value;
		if (old !== value) {
			this.host.requestUpdate();
		}
	}

	get paused() {
		return this._paused
	}
	set paused(value: boolean) {
		const old = this._paused;
		this._paused = value;
		if (old !== value) {
			this.host.requestUpdate();
		}

	}

	get ready() {
		return initiated && !!voice;
	}

	get error() {
		return this._error
	}

	set error(value: string) {
		this._error = value;
		this.host.requestUpdate();
	}

	constructor(protected host: ReactiveControllerHost, speech?: string, speechConfig?: SpeechConfigI) {
		// Register for lifecycle updates
		host.addController(this);
		this.config = speechConfig ?? this.config;
		this.speech = speech ?? '';
	}

	private async createUtterance() {
		if (!initiated) {
			await init();
		}
		if (!voice) {
			throw new Error('No voice available');
		}

		synth.cancel();
		this.utterance = new SpeechSynthesisUtterance(this.speech);
		this.utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
			console.error('Speech Error - this might be ok', e);
			this.speaking = false;
			this.paused = false;
			clear()
			if (e.error === 'canceled' || e.error === 'interrupted' || e.error === 'network' || e.error === 'audio-busy') {
				return
			}
			this.error = e.error;
			const toastEvent = new ToastEvent(`Error while speaking: ${e.error}`, 'error');
			(this.host as unknown as HTMLElement).dispatchEvent(toastEvent);
		}
		// onpause and onresume are not called on chrome
		this.utterance.onend = () => { console.log('end'); clear(); this.paused = false; this.speaking = false; }
		this.utterance.onstart = () => { console.log('start'); clear(); this.paused = false; this.speaking = true; }
	}


	async play() {

		try {
			cancelAudio();
			if (!this.utterance) {
				await this.createUtterance();
			}
			applyConfig(this.utterance!, this.config)
			utter(this.utterance!, this._paused);
			this.paused = false;
			this.speaking = true;
			if(pauseTimeout) {
				clearTimeout(pauseTimeout);
			}
		} catch (error) {
			this.error = error.message;
			throw error
		}
	}
	pause() {
		synth.pause();
		clear();
		pauseTimeout = setTimeout(() => {
			this.stop()
		}, 6000);
		this.paused = true; // utterance onpaused is not called on chrome
		this.speaking = false;
		console.log('Pausing Speech', this.speech);
	}
	async restart() {
		cancelAudio();
		synth.cancel();
		if(pauseTimeout) {
			clearTimeout(pauseTimeout);
		}
		if (!this.utterance) {
			await this.createUtterance();
		}
		utter(this.utterance!, false);
		console.log('Restarting Speech', this.speech);
	}
	stop() {
		clear();
		this.speaking = false;
		this.paused = false;
		console.log('Stopping Speech', this.speech);
	}
	dispose() {
		synth.cancel();
		if(pauseTimeout) {
			clearTimeout(pauseTimeout);
		}
		this.utterance = undefined;
		console.log('Disposing Speech', this.speech);
	}

	hostConnected(): void {

	}
	hostDisconnected(): void {
		this.dispose()
	}
}