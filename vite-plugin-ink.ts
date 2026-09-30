import type { Plugin } from 'vite';
import { Compiler } from 'inkjs/full';

/** Compiles `*.ink` imports to story JSON at build time: `import story from './x.ink'`. */
export default function ink(): Plugin {
  return {
    name: 'ink',
    enforce: 'pre',
    transform(src, id) {
      if (!id.endsWith('.ink')) return null;
      const compiler = new Compiler(src);
      const story = compiler.Compile();
      if (compiler.errors.length) {
        this.error(`ink compile failed (${id}):\n${compiler.errors.join('\n')}`);
      }
      for (const w of compiler.warnings) this.warn(`${id}: ${w}`);
      return { code: `export default ${story.ToJson()};`, map: null };
    },
  };
}
