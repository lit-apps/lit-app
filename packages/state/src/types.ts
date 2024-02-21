import { State } from './state';

export interface AccessibilityStateI extends State {
	signlanguage: boolean;
	voice: boolean;
	readaloud: boolean;
	readaloudConfig: {
		rate: number
	};
	easyread: boolean;
	easyreadEmulate: boolean;
	accessibleDevice: boolean;
}