import alignIcon from './class/alignIcon.js';
import badge from './class/badge.js';
import typography from './class/typography.js';
import tooltip from './class/tooltip.js';
import header from './class/header.js';
import layoutGrid from './class/layout-grid.js';
import { css, CSSResult } from 'lit';
import { Layouts, Alignment, Factors } from './flex/index.js';

const styles: CSSResult[] = [
  typography,
  alignIcon,
  badge,
  Layouts as unknown as CSSResult,
  layoutGrid,
  Factors as unknown as CSSResult,
  Alignment as unknown  as CSSResult,
  tooltip,
  header,
  
  css`
  
  .content {
    max-width: min(100vw, 1300px);
    
  }
  .secondary {
    color: var(--color-secondary-text);
  }
  
  .warning {
    color: var(--color-warning);
  }
  
  h5, h6 {
    margin-bottom: 0;
  }
  h5.secondary, h6.secondary {
    margin-top: var(--space-x-large);
  }
  
  h2 lapp-icon { 
    color: var(--color-secondary-text);
   } 


`];

export default styles;