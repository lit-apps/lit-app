import {marked} from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';

marked.use({ 
  ...gfmHeadingId({prefix: 'md-'})
});

export {marked}