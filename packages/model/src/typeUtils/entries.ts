type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]


// an util function to return type safe Object.entries 
// (see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/55012175#55012175)
function entries<T extends Object>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}

export default entries; 