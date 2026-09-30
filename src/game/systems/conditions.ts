/**
 * Tiny condition language for map objects, evaluated against ink variables.
 * Atoms: `var` (truthy), `!var`, `var>=2`, `var==1`, `var!=0`, `var<3`; joined with `&&`.
 */
export function evaluate(expr: string | undefined, get: (name: string) => unknown): boolean {
  if (!expr) return true;
  return expr.split('&&').every((part) => atom(part.trim(), get));
}

const ATOM = /^(!?)([A-Za-z_]\w*)\s*(?:(>=|<=|==|!=|>|<)\s*(-?\d+))?$/;

function atom(src: string, get: (name: string) => unknown) {
  const m = ATOM.exec(src);
  if (!m) throw new Error(`Bad condition: "${src}"`);
  const [, not, name, op, num] = m;
  const v = get(name);
  if (op) {
    const a = Number(v ?? 0);
    const b = Number(num);
    const r = op === '>=' ? a >= b : op === '<=' ? a <= b : op === '==' ? a === b : op === '!=' ? a !== b : op === '>' ? a > b : a < b;
    return not ? !r : r;
  }
  const truthy = Boolean(v) && v !== 0;
  return not ? !truthy : truthy;
}
