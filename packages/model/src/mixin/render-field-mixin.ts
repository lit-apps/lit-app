import { NestedKeys } from '@lit-app/shared/types.js';
import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { LitElement, TemplateResult } from 'lit';
import { EntityElement, entityI, EntityI, FieldConfig } from '../types.js';
import { DefaultI } from '../types/entity.js';


export declare class RenderFieldMixinInterface<D extends DefaultI = DefaultI> {
  renderField: (path: NestedKeys<D>, config?: FieldConfig, data?: D) => TemplateResult;
}

type BaseT<D extends DefaultI> = LitElement & Omit<EntityElement<D>, 'entity' | 'isFormValid' | 'consumingMode'>;
// {
//   docId: string;
//   entityStatus: EntityStatus;
//   authorization: AuthorizationT;
// }

/**
 * RenderFieldMixin  
 */
export const RenderFieldMixin = <D extends DefaultI = DefaultI>(
  Entity: EntityI<D>,
  realTime: boolean
) => <T extends MixinBase<BaseT<D>>>(
  superClass: T
): MixinReturn<T, RenderFieldMixinInterface<D>> => {


    abstract class RenderFieldMixinClass extends superClass {

      declare entity: entityI<D>;

      constructor(...args: any[]) {
        super(...args);
        this.entity = new Entity(this as unknown as EntityElement<D>, realTime);
      }

      renderField(path: NestedKeys<D>, config?: FieldConfig, data?: D) {
        return this.entity.renderField(path, config, data);
      }


    };
    return RenderFieldMixinClass
  }

export default RenderFieldMixin;

