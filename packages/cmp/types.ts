export type HTMLEvent<
T extends HTMLElement = HTMLElement, 
CT extends HTMLElement = HTMLElement> = Event & {
  target: T;
	currentTarget: CT;
}

export type HTMLCustomEvent<
	T extends HTMLElement = HTMLElement, 
	CT extends HTMLElement = HTMLElement> = CustomEvent & {
  target: T;
	currentTarget: CT;
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };