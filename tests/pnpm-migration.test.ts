import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const ROOT = process.cwd();

function readRootFile(relativePath: string): string {
  return readFileSync(`${ROOT}/${relativePath}`, 'utf-8');
}

describe('pnpm Migration — PR2', () => {
  describe('lock file conversion', () => {
    it('root pnpm-lock.yaml exists', () => {
      expect(existsSync(`${ROOT}/pnpm-lock.yaml`)).toBe(true);
    });

    it('frontend pnpm-lock.yaml exists', () => {
      expect(existsSync(`${ROOT}/src/apps/backoffice/frontend/pnpm-lock.yaml`)).toBe(true);
    });

    it('root package-lock.json no longer exists', () => {
      expect(existsSync(`${ROOT}/package-lock.json`)).toBe(false);
    });

    it('frontend package-lock.json no longer exists', () => {
      expect(existsSync(`${ROOT}/src/apps/backoffice/frontend/package-lock.json`)).toBe(false);
    });

    it('root pnpm-lock.yaml is a valid YAML file', () => {
      const content = readRootFile('pnpm-lock.yaml');
      expect(content).toMatch(/^lockfileVersion:/m);
    });
  });

  describe('.npmrc CRA compatibility', () => {
    it('.npmrc file exists', () => {
      expect(existsSync(`${ROOT}/.npmrc`)).toBe(true);
    });

    it('contains shamefully-hoist=true', () => {
      const content = readRootFile('.npmrc');
      expect(content).toContain('shamefully-hoist=true');
    });

    it('contains node-linker=hoisted', () => {
      const content = readRootFile('.npmrc');
      expect(content).toContain('node-linker=hoisted');
    });
  });

  describe('package.json scripts migration', () => {
    it('no npm run references remain in any script', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      const scripts = Object.values(pkg.scripts) as string[];
      for (const script of scripts) {
        // Use word boundary to avoid matching "npm run" inside "pnpm run"
        expect(script).not.toMatch(/\bnpm run\b/);
      }
    });

    it('no npm start references remain in any script', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      const scripts = Object.values(pkg.scripts) as string[];
      for (const script of scripts) {
        expect(script).not.toMatch(/\bnpm start\b/);
      }
    });

    it('dev:backoffice:frontend uses pnpm start', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      expect(pkg.scripts['dev:backoffice:frontend']).toContain('pnpm start');
    });

    it('build:backoffice:frontend uses pnpm run build', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      expect(pkg.scripts['build:backoffice:frontend']).toContain('pnpm run build');
    });

    it('build script uses pnpm run', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      expect(pkg.scripts['build']).toContain('pnpm run');
    });

    it('test script uses pnpm run', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      expect(pkg.scripts['test']).toContain('pnpm run');
    });

    it('test:features script uses pnpm run', () => {
      const pkg = JSON.parse(readRootFile('package.json'));
      expect(pkg.scripts['test:features']).toContain('pnpm run');
    });
  });

  describe('Dockerfile modernization', () => {
    it('uses Node 18-alpine base image', () => {
      const content = readRootFile('Dockerfile');
      expect(content).toMatch(/node:18-alpine/);
    });

    it('does not reference Node 12', () => {
      const content = readRootFile('Dockerfile');
      expect(content).not.toMatch(/node:12/);
    });

    it('enables corepack', () => {
      const content = readRootFile('Dockerfile');
      expect(content).toContain('corepack enable');
    });

    it('uses pnpm install instead of npm install', () => {
      const content = readRootFile('Dockerfile');
      expect(content).toContain('pnpm install');
    });

    it('does not contain npm install', () => {
      const content = readRootFile('Dockerfile');
      expect(content).not.toMatch(/\bnpm install\b/);
    });

    it('references pnpm-lock.yaml', () => {
      const content = readRootFile('Dockerfile');
      expect(content).toContain('pnpm-lock.yaml');
    });

    it('does not reference package-lock.json', () => {
      const content = readRootFile('Dockerfile');
      expect(content).not.toContain('package-lock.json');
    });

    it('has multi-stage build pattern', () => {
      const content = readRootFile('Dockerfile');
      const fromAsMatches = content.match(/FROM\s+.+\s+AS\s+\w+/g);
      expect(fromAsMatches).not.toBeNull();
      expect(fromAsMatches!.length).toBeGreaterThanOrEqual(2);
    });

    it('CMD runs mooc backend', () => {
      const content = readRootFile('Dockerfile');
      expect(content).toContain('dist/src/apps/mooc/backend/start');
    });

    it('has at least 3 stages', () => {
      const content = readRootFile('Dockerfile');
      const fromMatches = content.match(/^FROM\s/gm);
      expect(fromMatches).not.toBeNull();
      expect(fromMatches!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('.dockerignore does not exclude pnpm-lock.yaml', () => {
    it('does not exclude pnpm-lock.yaml', () => {
      const content = readRootFile('.dockerignore');
      expect(content).not.toContain('pnpm-lock.yaml');
    });

    it('still excludes node_modules', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('node_modules');
    });

    it('still excludes .env', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toMatch(/(?:^|\r?\n)\.env(?:\r?\n|$)/m);
    });
  });

  describe('pnpm is available', () => {
    it('pnpm --version succeeds', () => {
      const output = execSync('pnpm --version', { encoding: 'utf-8', cwd: ROOT }).trim();
      expect(output).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
});
