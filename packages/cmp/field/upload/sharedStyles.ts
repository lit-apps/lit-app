import { css } from 'lit';
const styles = css`
 
 /** we need to reset styles because field does a all:unset on .content ::slotted(*) . */ 
 lapp-upload-document-firebase,
 lapp-upload-document {
		background-color: var(--color-on-primary);
    overflow: hidden;
    border: 1px dashed var(--color-divider);
    border-radius: 4px;
    margin: 8px 16px;
    transition: border-color 0.6s;
    position: relative;
    margin-top: calc(2 * var(--_with-label-top-space) + var(--_label-text-populated-line-height));
    padding-top: var(--_with-label-top-space);

	}

  /** smaller margin top for a11y variant */
  .field[variant="a11y"] lapp-upload-document-firebase,
  .field[variant="a11y"] lapp-upload-document {
    margin-top: calc( var(--_with-label-top-space) + var(--_label-text-populated-line-height));
  }

	

`;
export default styles;	