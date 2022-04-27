export function deepCopy(sth: unknown): unknown {
  if (!sth) {
    return sth;
  }
  if (sth instanceof Array || Array.isArray(sth)) {
    const result: unknown[] = [];
    sth.forEach(it => result.push(deepCopy(it)));
    return result as never;
  }
  if (sth instanceof HTMLElement) {
    let attributes = '';
    sth.getAttributeNames().forEach(it => {
      attributes += ` ${it}="${sth.getAttribute(it)}"`;
    });
    return `<${sth.nodeName}${attributes}>...</${sth.nodeName}>`;
    // may also be an option...
    // return sth.outerHTML;
  }
  if (sth instanceof Function) {
    return `>>>${sth.toString()}<<<`;
  }
  if (sth instanceof Object) {
    const result: { [key: string]: unknown } = {};
    Object.entries(sth).forEach(([key, value]) => {
      result[key] = deepCopy(value);
    });
    return result;
  }
  return sth;
}

export function cloneArgs(...args: unknown[]): unknown[] {
  const result: unknown[] = [];
  args.forEach(it => result.push(deepCopy(it)));
  return result;
}
