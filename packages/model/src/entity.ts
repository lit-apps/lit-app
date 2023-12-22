
console.warn('Entity is deprecated. Use EntityAbstract and entityFact instead.')

import EntityAbstract from './entityAbstract';

/**
 * Base class for entity. 
 * 
 * And entity has a model, defining the structure of the data,
 * and actions, defining the operations that can be performed on the data.
 * 
 */
export default class Entity extends EntityAbstract { 

 /**
 	* inspired from https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-1488919713
 	* We will need to set the type of constructor on all subclasses so that
 	* the type of actions is properly inferred. 
 	*/
	declare ['constructor']: typeof Entity;
  static override icon: string = ''

  
  static _entityName: string
  static override get entityName(): string {
    const name = this._entityName || this.name
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
  static override set entityName(name: string) {
    this._entityName = name
  }




  




}



