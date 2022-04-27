export function deepCopy<T>(sth: T): unknown {
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
    // return sth.outerHTML;
    return `<${sth.nodeName}${attributes}>...</${sth.nodeName}>`;
  }
  if (sth instanceof Function) {
    return `>>>${sth.toString()}<<<`;
  }
  if (sth instanceof Object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = {...(sth as { [key: string]: any })} as { [key: string]: any };
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
