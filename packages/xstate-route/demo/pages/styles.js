import { unsafeCSS } from "lit";
export const sharedStyles = unsafeCSS `
	:host {
		
	}

	router-link {
	    border-bottom: 2px solid currentColor;
	    outline: none;
	}
	
	router-link, a {
	    color: grey;
		cursor: pointer;
	}

	router-link:focus, router-link:hover, a:hover, a:focus {
		color: black;
	}
	
	router-link[active] {
		color: red;
	}
	
	a[data-active] {
		color: red;
	}
	a[disabled], a[disabled]:hover {
		pointer-events: none;
		color: #fa8e41;
 }
	
`;
//# sourceMappingURL=styles.js.map