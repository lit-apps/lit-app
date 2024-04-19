import { css } from 'lit';
const styles = css`
:host {
  --_primary-container-color: var(--md-fab-primary-container-color, var(--md-sys-color-on-primary));
  --_secondary-container-color: var(--md-fab-secondary-container-color, var(--md-sys-color-on-secondary));
  --_tertiary-container-color: var(--md-fab-tertiary-container-color, var(--md-sys-color-on-tertiary));

  --_primary-icon-color: var(--md-fab-primary-icon-color, var(--md-sys-color-primary));
  --_secondary-icon-color: var(--md-fab-secondary-icon-color, var(--md-sys-color-secondary));
  --_tertiary-icon-color: var(--md-fab-tertiary-icon-color, var(--md-sys-color-tertiary));

  --_primary-label-text-color: var(--md-fab-primary-label-text-color, var(--md-sys-color-primary));
  --_secondary-label-text-color: var(--md-fab-secondary-label-text-color, var(--md-sys-color-secondary));
  --_tertiary-label-text-color: var(--md-fab-tertiary-label-text-color, var(--md-sys-color-tertiary));
 
  --_primary-hover-state-layer-color:  var(--md-sys-color-primary);
  --_secondary-hover-state-layer-color:  var(--md-sys-color-secondary);
  --_tertiary-hover-state-layer-color:  var(--md-sys-color-tertiary);

  --_primary-pressed-state-layer-color:  var(--md-sys-color-primary);
  --_secondary-pressed-state-layer-color:  var(--md-sys-color-secondary);
  --_tertiary-pressed-state-layer-color:  var(--md-sys-color-tertiary);
}

.fab.primary {
  border-color: var(--_primary-icon-color);
}
.fab.secondary {
  border-color: var(--_secondary-icon-color);
}
.fab.tertiary {
  border-color: var(--_tertiary-icon-color);
}

`;
export default styles;