/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copies whatever is given.
 * Handles simple types, Arrays, Dates, Functions, HTMLElements and Objects.
 * Because of it's planed usage for logging and to transfer data between Electron front- and backend, some types are
 * converted into string.
 *
 * @param source an any parameter that will be copied
 */
export function deepCopy(source: any): any {
  if (!source) {
    return source;
  }
  if (source instanceof Date) {
    return new Date(source.getTime());
  }
  if (source instanceof Array || Array.isArray(source)) {
    return source.map(elem => deepCopy(elem));
  }
  if (source instanceof HTMLElement) {
    let attributes = '';
    source.getAttributeNames().forEach(it => {
      attributes += ` ${it}="${source.getAttribute(it)}"`;
    });
    return `<${source.nodeName}${attributes}>...</${source.nodeName}>`;
    // may also be an option...
    // return source.outerHTML;
  }
  if (source instanceof Function) {
    return `${source.toString()}`;
  }
  if (source instanceof Object) {
    const result: { [key: string]: any } = {};
    Object.entries(source).forEach(([key, value]) => {
      result[key] = deepCopy(value);
    });
    return result;
  }
  return source;
}
