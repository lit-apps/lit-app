import { css, CSSResult } from 'lit';

export const styles: CSSResult = css`
  .content:not(.show-close-icon) ::slotted(md-icon-button)  {
    display: none;
  }
  .content.show-close-icon ::slotted(lapp-icon)  {
    display: none;
  }
`;
