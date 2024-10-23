/**
  background is black
  text is yellow
  primary -color is yellow
*/

import {type theme} from './type'
const th: theme = {
  name: 'dark mode ||',
  index: 11,
  desc: 'inverted (yellow)',
  longDesc: 'dark background, yellow text',
  theme: {
    '--dark-theme':true,
    '--color-accent-rgb':'255, 34, 0',
    '--color-accent':'#ff2200',
    '--color-brand-rgb':'255, 0, 0',
    '--color-brand':'#ff0000',
    '--color-outline':'#938F99',
    '--color-secondary-text': '#ffee00',
    '--color-disabled-text': '#505050',
    '--md-sys-color-primary':'#ffff00',
    '--md-sys-color-on-primary':'#000000',
    '--md-sys-color-primary-container':'#00b300',
    '--md-sys-color-on-primary-container':'#ffd100',
    '--md-sys-color-primary-rgb':'255, 255, 0',
    '--md-sys-color-on-primary-rgb':'0, 0, 0',
    '--md-sys-color-secondary':'#00ff00',
    '--md-sys-color-on-secondary':'#000000',
    '--md-sys-color-secondary-container':'#005300',
    '--md-sys-color-on-secondary-container':'#73ff5b',
    '--md-sys-color-secondary-rgb':'0, 255, 0',
    '--md-sys-color-on-secondary-rgb':'0, 0, 0',
    '--md-sys-color-tertiary':'#ff2200',
    '--md-sys-color-on-tertiary':'#000000',
    '--md-sys-color-tertiary-container':'#920900',
    '--md-sys-color-on-tertiary-container':'#ffdad2',
    '--md-sys-color-tertiary-rgb':'51, 255, 0',
    '--md-sys-color-on-tertiary-rgb':'0, 0, 0',
    '--md-sys-color-background':'#000000',
    '--md-sys-color-on-background': '#ffff00',
    '--md-sys-color-surface':'#000000',
    '--md-sys-color-on-surface':'#E6E1E5',
    '--md-sys-color-inverse-surface':'#E6E1E5',
    '--md-sys-color-inverse-on-surface':'#000000',
    '--md-sys-color-surface-variant':'#49454F',
    '--md-sys-color-on-surface-variant':'#CAC4D0',
    '--md-sys-color-background-rgb': '0, 0, 0',  
    '--md-sys-color-surface-rgb': '0, 0, 0',

  }
}

export default th
