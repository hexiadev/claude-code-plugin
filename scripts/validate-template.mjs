import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const manifestPath = resolve(repoRoot, '.claude-plugin/plugin.json');
const marketplacePath = resolve(repoRoot, '.claude-plugin/marketplace.json');
const mcpPath = resolve(repoRoot, '.mcp.json');
const skillPath = resolve(repoRoot, 'skills/use-hexia-workspace/SKILL.md');
const logoPath = resolve(repoRoot, 'assets/logo.svg');

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

expect(existsSync(manifestPath), 'Missing .claude-plugin/plugin.json');
expect(existsSync(marketplacePath), 'Missing .claude-plugin/marketplace.json');
expect(existsSync(mcpPath), 'Missing .mcp.json');
expect(existsSync(skillPath), 'Missing skills/use-hexia-workspace/SKILL.md');
expect(existsSync(logoPath), 'Missing assets/logo.svg');

const manifest = readJson(manifestPath);
const marketplace = readJson(marketplacePath);
const mcp = readJson(mcpPath);

expect(manifest.name === 'hexia-workspace', 'plugin.json must keep name "hexia-workspace"');
expect(typeof manifest.version === 'string' && manifest.version.length > 0, 'plugin.json is missing version');
expect(typeof manifest.description === 'string' && manifest.description.length > 0, 'plugin.json is missing description');
expect(manifest.license === 'MIT', 'plugin.json must declare license "MIT"');
expect(manifest.mcpServers === './.mcp.json', 'plugin.json must reference "./.mcp.json"');
expect(typeof manifest.homepage === 'string' && manifest.homepage.length > 0, 'plugin.json is missing homepage');
expect(manifest.repository === 'https://github.com/hexiadev/claude-code-plugin', 'plugin.json must point to the public Claude Code plugin repository');

expect(marketplace.name === 'hexia-plugins', 'marketplace.json must keep marketplace name "hexia-plugins"');
expect(Array.isArray(marketplace.plugins) && marketplace.plugins.length === 1, 'marketplace.json must define exactly one plugin entry');
expect(marketplace.plugins?.[0]?.name === 'hexia-workspace', 'marketplace.json must list the hexia-workspace plugin');
expect(marketplace.plugins?.[0]?.source === './', 'marketplace.json must point plugin source to the repository root with "./"');
expect(marketplace.plugins?.[0]?.repository === manifest.repository, 'marketplace.json repository must match plugin.json repository');

const server = mcp?.mcpServers?.['hexia-workspace'];
expect(Boolean(server), '.mcp.json must define mcpServers.hexia-workspace');
expect(server?.type === 'http', '.mcp.json must use HTTP transport');
expect(server?.url === 'https://api.hexia.dev/mcp/message', '.mcp.json must point to the public Hexia MCP endpoint');

if (failures.length > 0) {
  console.error('Template validation failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Template validation passed.');
