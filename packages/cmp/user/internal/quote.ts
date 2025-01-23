import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import '../img';
import('@material/web/labs/card/outlined-card.js');

type UserOrganisationT = {
	name: string;
	href?: string;
	logoURL?: string;
}

/**
 * A use quote container 
 * 
 * css variables:
 * --lapp-user-quote-height: height of the user quote header. Will be used to calc margins an avatar size
 * 
 */

export class UserQuote extends LitElement {

	static override shadowRootOptions: ShadowRootInit = {
		delegatesFocus: true,
		mode: 'open',
	};

	static override styles = css`
    :host {
      display: flex;
			flex-direction: row;
			height: 100%;
			--_lapp-user-quote-img-size: var(--lapp-user-quote-img-size, 64px);
			--_lapp-user-quote-color: var(--lapp-user-quote-color, var(--color-outline));
			--_lapp-user-quote-gap: var(--lapp-user-quote-gap, var(--space-medium));
    }
		
		::slotted(*:last-child) {
			margin-bottom: 0;
			--margin-header-bottom: 0;
		}

		figure {
			flex: 1;
			display: flex;
			flex-direction: column;
			position: relative;
			gap: var(--_lapp-user-quote-gap);
			margin: 0;
			padding-top: 38px;
			margin-left: -25px;
		}
		svg {
			opacity: 0.3;
			fill: var(--_lapp-user-quote-color);
		}
		blockquote {
			flex: 1;
			display: inline-flex;
			flex-direction: column;
			justify-content: space-around;
			margin: 0;
		}
		md-divider {
			width: 50%;
			margin: auto;
		}

		figcaption {
			flex: 0;
			flex-wrap: wrap;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--_lapp-user-quote-gap);
			position: relative;
		}

		#organisation, #aorganisation {
			flex: 0;
		}

		img.user {
			object-fit: cover;
			border-radius: 50%;
			filter: grayscale(60%);
			width: var(--_lapp-user-quote-img-size);
			height: var(--_lapp-user-quote-img-size);
			border: 3px solid var(--color-outline);
		}
		img.organisation {
			object-fit: contain;
			max-height: var(--_lapp-user-quote-img-size);
			width: calc( var(--_lapp-user-quote-img-size) / 1 );
		}

		cite {
			font-style: normal;
			min-width: 140px;
			flex: 1;
		}

		#title {
			color: var(--color-secondary-text);
			font-size: var(--font-size-small);
		}

    `;
	@property() href!: string;
	@property() target!: string;
	/**
	 * The quote to display - can be set as slot as well
	 */
	@property() quote!: string;
	@property() photoURL!: string;
	@property() userName!: string;
	@property() userTitle!: string;
	@property({ attribute: false }) organisation!: UserOrganisationT;



	override render() {
		if (this.href) {
			return html`<a href=${this.href} target="${this.target || ''}">
				<md-focus-ring  style="--md-focus-ring-shape: 10px"></md-focus-ring>
				${this.renderInside()}
			</a>`
		}
		return this.renderInside();

	}

	renderInside() {
		return html`
		<svg xmlns="http://www.w3.organisation/2000/svg" width="51" height="38" viewBox="0 0 51 38" >
				<path d="M23.7505 2.78534L20.3937 3.56574e-06C7.75623 7.16231 1.83242 15.3194 0.25274 24.4712C-0.932022 32.0314 2.02988 38 9.53337 38C14.8648 38 19.9988 34.4188 21.1835 28.4503C22.1708 21.4869 18.2216 17.3089 13.2851 16.3141C15.2597 9.54975 23.553 2.78534 23.7505 2.78534ZM40.7321 15.9162C42.9041 9.35081 50.8025 2.78535 51 2.78535L47.6432 8.3302e-06C35.0057 7.16231 29.0819 15.3194 27.5022 24.4712C26.3175 32.0314 29.2794 38 36.7829 38C42.1143 38 47.2483 34.4189 48.2356 28.4503C49.4203 21.4869 45.6686 16.911 40.7321 15.9162Z"/>
		</svg>
		<figure>
			<blockquote>
				${this.quote ? this.quote : html`<slot></slot>`}
			</blockquote> 
			<md-divider></md-divider>
			<figcaption id="user">
				<img class="user" loading="lazy" alt="picture of ${this.userName}" .src=${this.photoURL}></img>
			<cite id="attribution" >
					<div id="name">— ${this.userName}</div>
					${this.userTitle ? html`<div id="title">${this.userTitle}</div>` : nothing}
			</cite>
			${this.organisation ? html`
					${this.organisation.href ? html`
						<a id="aorganisation" href="${this.organisation.href || ''}" target="_blank">${this.renderOrganisation()}</a>
						` : this.renderOrganisation()}
				` : nothing}
				</figcaption>
		</figure>
		`
	}

	renderOrganisation() {
		return html`
		${this.organisation.logoURL ?
				html`<img class="organisation" loading="lazy" alt="picture of ${this.organisation.name}" .src=${this.organisation.logoURL}></img>` :
				nothing}
		`
	}
}
