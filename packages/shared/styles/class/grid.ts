import { css, CSSResult } from "lit";

const style: CSSResult = css`

    :host {
      
    }
    
    
    .grid {
      display: grid;
      --_grid-gap: var(--grid-gap, var(--space-large));
      --_grid-max: var(--grid-max, 300px);
      --_grid-min-max: var(--grid-min-max, minmax(var(--_grid-min-max), auto));
      --_grid-auto-rows: var(--grid-auto-rows, var(--_grid-min-max));

      --_grid-columns: var(--grid-columns, 3);
      --__grid-columns: var(--_grid-columns);
      --_grid-frame: var(--grid-frame, 1fr);
      --_grid-repeat: var(--grid-repeat, repeat(var(--__grid-columns), var(--_grid-frame)));
      --_grid-template-columns: var(--grid-template-columns, var(--_grid-repeat));
      grid-auto-rows: var(--_grid-auto-rows); 
      grid-template-columns: var(--_grid-template-columns);
      gap: var(--_grid-gap);
    }

    .grid.col-2 {
      --_grid-columns: 2;
    }
    .grid.col-4 {
      --_grid-columns: 4;
    }

    @media (max-width: 1288px) {
      .grid.col-4 {
        --__grid-columns: var(--grid-columns, calc( var(--_grid-columns) - 1));
      }
    }
    @media (max-width: 992px) {
      .grid {
        --__grid-columns: var(--grid-columns, calc( var(--_grid-columns) - 1));
      }
      .grid.col-4 {
        --__grid-columns: var(--grid-columns, calc( var(--_grid-columns) - 2));
      }
    }

    @media (max-width: 600px) {
      .grid {
        --__grid-columns: var(--grid-columns, calc( var(--_grid-columns) - 2));
      }
      .grid.col-4 {
        --__grid-columns: var(--grid-columns, calc( var(--_grid-columns) - 3));
      }
    }
  `
export default style;

