import { CSSResult, css } from 'lit';

/**
 * A helper css for handling print 
 * 
 * it exposes 3 classes:
 * - .no-print : to hide element in print
 * - .print-only : to show element only in print
 * - .no-break : to avoid break inside element when printing
 */
const style: CSSResult = css`
  
  .print-only {
    display: none;
  }
  
  @media print {
    .no-print {
      display: none;
    }
    .print-only {
      display: block;
    }
    .no-break {
      break-inside: avoid;
    }
    .page {
      page-break-after: always;
    }
  }
`

export default style;