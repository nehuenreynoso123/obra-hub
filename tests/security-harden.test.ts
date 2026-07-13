import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const ROOT = process.cwd();

function readRootFile(relativePath: string): string {
  return readFileSync(`${ROOT}/${relativePath}`, 'utf-8');
}

describe('Security Hardening — PR1', () => {
  describe('.gitignore hardening', () => {
    it('excludes .env pattern', () => {
      const content = readRootFile('.gitignore');
      // Platform-agnostic: match .env at start of a line (handles \r\n and \n)
      expect(content).toMatch(/(?:^|\r?\n)\.env(?:\r?\n|$)/m);
    });

    it('excludes .env.* wildcard pattern', () => {
      const content = readRootFile('.gitignore');
      expect(content).toContain('.env.*');
    });

    it('excludes log files via *.log', () => {
      const content = readRootFile('.gitignore');
      expect(content).toContain('*.log');
    });

    it('excludes coverage directory', () => {
      const content = readRootFile('.gitignore');
      expect(content).toContain('coverage/');
    });

    it('excludes .DS_Store', () => {
      const content = readRootFile('.gitignore');
      expect(content).toContain('.DS_Store');
    });

    it('excludes *.pem sensitive files', () => {
      const content = readRootFile('.gitignore');
      expect(content).toContain('*.pem');
    });
  });

  describe('.dockerignore creation', () => {
    it('file exists', () => {
      expect(existsSync(`${ROOT}/.dockerignore`)).toBe(true);
    });

    it('excludes node_modules', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('node_modules');
    });

    it('excludes .git directory', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('.git');
    });

    it('excludes .env files', () => {
      const content = readRootFile('.dockerignore');
      // Match .env at line boundary — same pattern as .gitignore test
      expect(content).toMatch(/(?:^|\r?\n)\.env(?:\r?\n|$)/m);
    });

    it('excludes .env.* variants', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('.env.*');
    });

    it('excludes log files', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('*.log');
    });

    it('excludes dist and build directories', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('dist');
      expect(content).toContain('build');
    });

    it('excludes coverage directory', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('coverage');
    });

    it('excludes *.pem sensitive files', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('*.pem');
    });

    it('excludes *.key sensitive files', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('*.key');
    });

    it('excludes *.cert sensitive files', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('*.cert');
    });

    it('excludes data directory', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('data');
    });

    it('excludes tests directory', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('tests');
    });

    it('excludes markdown files', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('*.md');
    });

    it('excludes docker-compose.yml', () => {
      const content = readRootFile('.dockerignore');
      expect(content).toContain('docker-compose.yml');
    });
  });

  describe('.env git tracking', () => {
    it('.env is not tracked in the git index', () => {
      const tracked = execSync('git ls-files .env', {
        encoding: 'utf-8',
        cwd: ROOT,
      }).trim();
      expect(tracked).toBe('');
    });
  });

  describe('.env.example', () => {
    it('.env.example file exists', () => {
      expect(existsSync(`${ROOT}/.env.example`)).toBe(true);
    });

    it('.env.example is tracked by git', () => {
      const tracked = execSync('git ls-files .env.example', {
        encoding: 'utf-8',
        cwd: ROOT,
      }).trim();
      expect(tracked).toBe('.env.example');
    });

    it('.env.example does not contain real credential values', () => {
      const content = readRootFile('.env.example');
      // Ensure placeholder patterns, not real passwords
      expect(content).not.toMatch(/PASSWORD\s*=\s*(?!guest|password|changeme|your_)[^\s]+/i);
    });
  });

  describe('docker-compose.yml cleanup', () => {
    it('does not define node_modules named volume', () => {
      const content = readRootFile('docker-compose.yml');
      expect(content).not.toMatch(/^\s+node_modules:/m);
    });

    it('does not define esdata named volume', () => {
      const content = readRootFile('docker-compose.yml');
      expect(content).not.toMatch(/^\s+esdata:/m);
    });

    it('does not have a top-level volumes section', () => {
      const content = readRootFile('docker-compose.yml');
      expect(content).not.toMatch(/^volumes:\s*$/m);
    });
  });
});
