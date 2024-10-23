import { css, CSSResult } from 'lit';

/**
 * style to patch with previous version of MD2
 */
const style: CSSResult = css`

    md-primary-tab[disabled], md-secondary-tab[disabled] { 
        pointer-events: none;
    }
`;

export default style;
