/**
 * Decorator to merge static properties of a class with the properties of a superclass.
 * This is used form instance to inherit actions defined in a superclass when extending
 * @param key - the static key to merge
 */

export default function mergeStatic(key: string): ClassDecorator {
  return (target: any) => {
    if (target.hasOwnProperty(key)) {
      const proto = Object.getPrototypeOf(target)[key];
      // merge individual keys with proto keys
      Object.keys(target[key]).forEach((k) => {
        if (proto[k]) {
          target[key][k] = { ...proto[k], ...target[key][k] };
        }
      });

      target[key] = { ...proto, ...target[key] };

    }
    return target;
  };
}
