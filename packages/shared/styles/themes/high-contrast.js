"use strict";
/**
  background is yellow
  text is black
  primary -color is b
*/
var th = {
    name: 'high contrast',
    index: 3,
    desc: 'black text',
    longDesc: 'darker colors, higher contrast',
    theme: {
        '--color-primary-rgb': '0, 88, 155',
        '--color-primary': '#00589b',
        '--color-primary-dark': '#003e6d',
        '--color-primary-light': '#007edd',
        '--color-secondary-rgb': '0, 172, 193',
        '--color-secondary': '#00acc1',
        '--color-secondary-dark': '#007c91',
        '--color-secondary-light': '#5ddef4',
        '--color-accent-rgb': '0, 184, 212',
        '--color-accent': '#00b8d4',
        '--color-brand-rgb': '0, 161, 212',
        '--color-brand': '#00a1d4',
        '--color-background': '#ffffff',
        '--color-primary-text': '#000000',
        '--color-secondary-text': '#2c2c2c',
        '--color-disabled-text': '#646464',
        '--color-divider': '#b6b6b6',
        '--md-sys-color-background-rgb': '255, 255, 255',
        '--md-sys-color-surface-rgb': '255, 255, 255'
    }
};
export default th;
