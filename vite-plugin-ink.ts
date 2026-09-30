import type { Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Compiler, CompilerOptions } from 'inkjs/full';

/**
 * Compiles `*.ink` imports to story JSON at build time: `import story from './main.ink'`.
 * Supports `INCLUDE other.ink` (resolved relative to the importing file; watched for HMR).
 */
export default function ink(): Plugin {
  return {
    name: 'ink',
    enforce: 'pre',
    transform(src, id) {
      if (!id.endsWith('.ink')) return null;
      const dir = dirname(id);
      const included: string[] = [];
      const fileHandler = {
        ResolveInkFilename: (name: string) => resolve(dir, name),
        LoadInkFileContents: (path: string) => {
          included.push(path);
          return readFileSync(path, 'utf8');
        },
      };
      const errors: string[] = [];
      const warnings: string[] = [];
      // ErrorType: 0 author note, 1 warning, 2 error
      const onMsg = (msg: string, type: number) => (type === 2 ? errors : warnings).push(msg);
      const compiler = new Compiler(src, new CompilerOptions(id, [], false, onMsg, fileHandler));
      let json = '';
      try {
        json = compiler.Compile().ToJson() ?? '';
      } catch (e) {
        errors.push(String(e));
      }
      for (const f of included) this.addWatchFile(f);
      for (const w of warnings) this.warn(w);
      if (errors.length || !json) this.error(`ink compile failed (${id}):\n${errors.join('\n')}`);
      return { code: `export default ${json};`, map: null };
    },
  };
}
