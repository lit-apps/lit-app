import order from './order/internal/locale.mjs';
export default {
  yourAnswerTo: 'This is your answer to ',
  hint: 'hint',
  checked: 'checked',
  notChecked: 'not checked',
  undetermined: 'undetermined',
  option: 'option',
  noOptions: 'no options available',
  isTheAnswerTo: 'is the answer to the question',
  countOptions: 'There are {{count}} options to read. Click "read aloud" again to read them all.',
  chooseOption: 'Choose your answers from the following options',
  chooseOptions: 'Choose one answer from the following options',
  required: 'An answer to this question is required.',
  givenRate: 'You have given a rate of {{count}} out of {{max}} stars to ',
  giveRate: 'Give a rate between {{min}} and {{max}} stars',
  pleaseSpecify: 'please specify',
  readAloud: 'read aloud',
  star: 'Star',
  stars: 'Stars',
  error: {
    synth: {
      noVoice: 'Problem with read aloud: voice for current language {{lan}} is not supported by your device.',
      notSupported: 'Problem with read aloud: speech synthesis is not supported by your device.',
      emptyVoices: 'Problem with read aloud: no voices are available in your device.'
    }
  },
  order: order
 };
