type AnyObject = {
  [p: string]: any;
};
export function assignObjectFilterSource<
  T extends AnyObject,
  U extends AnyObject
>(source: T, target: U): T {
  const mergeConfig: AnyObject = {};
  Object.keys(source).map((key) => {
    if (target.hasOwnProperty(key)) {
      mergeConfig[key] = target[key];
    }
  });
  return Object.assign(source, mergeConfig);
}
