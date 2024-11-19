import { type ThemeT } from './types';
const th: ThemeT = {
  name: 'default',
  index: -100,
  desc: 'default theme dark',
  longDesc: 'default theme dark',
  lightTheme: '_default',
  theme: {
    '--dark-theme': true,
    '--color-brand-rgb': '18, 38, 70',
    '--color-brand': 'none',
    '--color-secondary-text': '#cbcbcb',
    '--color-disabled-text': '#a8a8a8',
    
    '--md-sys-color-primary': '#bbc3ff',
    '--md-sys-color-on-primary': '#0013a0', 
    '--md-sys-color-primary-container': '#2335b5',
    '--md-sys-color-on-primary-container': '#dee0ff',
    '--md-sys-color-secondary': '#4adcc4',
    '--md-sys-color-on-secondary': '#00382f',
    '--md-sys-color-secondary-container': '#005145',
    '--md-sys-color-on-secondary-container': '#6cf9e0',
    '--md-sys-color-tertiary': '#ffb2c0',
    '--md-sys-color-on-tertiary': '#670024',
    '--md-sys-color-tertiary-container': '#910036',
    '--md-sys-color-on-tertiary-container': '#ffd9df',

    '--md-sys-color-primary-rgb': '187, 195, 255',
    '--md-sys-color-secondary-rgb': '74, 220, 196',
    '--md-sys-color-tertiary-rgb': '255, 178, 192',

    '--md-sys-color-on-primary-rgb': '0, 19, 160',
    '--md-sys-color-on-secondary-rgb': '0, 56, 47',
    '--md-sys-color-on-tertiary-rgb': '102, 0, 37',

    '--md-sys-color-background-rgb': '28, 27, 31',  
    '--md-sys-color-surface-rgb': '28, 27, 31',

  }

};

export default th