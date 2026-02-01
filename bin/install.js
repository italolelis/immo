#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasUninstall = args.includes('--uninstall') || args.includes('-u');
const hasHelp = args.includes('--help') || args.includes('-h');

const banner = '\n' +
  cyan + '  ██╗███╗   ███╗███╗   ███╗ ██████╗\n' +
  '  ██║████╗ ████║████╗ ████║██╔═══██╗\n' +
  '  ██║██╔████╔██║██╔████╔██║██║   ██║\n' +
  '  ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║\n' +
  '  ██║██║ ╚═╝ ██║██║ ╚═╝ ██║╚██████╔╝\n' +
  '  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝ ╚═════╝' + reset + '\n' +
  '\n' +
  '  IMMO ' + dim + 'v' + pkg.version + reset + '\n' +
  '  Real estate investment analysis for Claude Code.\n';

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx immo-cc [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}     Install globally (to ~/.claude)
    ${cyan}-l, --local${reset}      Install locally (to current directory)
    ${cyan}-u, --uninstall${reset}  Uninstall IMMO
    ${cyan}-h, --help${reset}       Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install globally (recommended)${reset}
    npx immo-cc --global

    ${dim}# Install to current project only${reset}
    npx immo-cc --local

    ${dim}# Uninstall IMMO globally${reset}
    npx immo-cc --global --uninstall

  ${yellow}After Installation:${reset}
    Run ${cyan}/immo:help${reset} in Claude Code to get started.
`);
  process.exit(0);
}

/**
 * Get the Claude config directory
 */
function getClaudeDir() {
  if (process.env.CLAUDE_CONFIG_DIR) {
    return process.env.CLAUDE_CONFIG_DIR;
  }
  return path.join(os.homedir(), '.claude');
}

/**
 * Recursively copy directory with path replacement
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix) {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix);
    } else if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      const claudeDirRegex = /~\/\.claude\//g;
      content = content.replace(claudeDirRegex, pathPrefix);
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Uninstall IMMO
 */
function uninstall(isGlobal) {
  const targetDir = isGlobal
    ? getClaudeDir()
    : path.join(process.cwd(), '.claude');

  const locationLabel = isGlobal
    ? targetDir.replace(os.homedir(), '~')
    : targetDir.replace(process.cwd(), '.');

  console.log(`  Uninstalling IMMO from ${cyan}${locationLabel}${reset}\n`);

  if (!fs.existsSync(targetDir)) {
    console.log(`  ${yellow}Directory does not exist: ${locationLabel}${reset}`);
    console.log(`  Nothing to uninstall.\n`);
    return;
  }

  let removedCount = 0;

  // Remove IMMO commands
  const immoCommandsDir = path.join(targetDir, 'commands', 'immo');
  if (fs.existsSync(immoCommandsDir)) {
    fs.rmSync(immoCommandsDir, { recursive: true });
    removedCount++;
    console.log(`  ${green}✓${reset} Removed commands/immo/`);
  }

  // Remove immo directory (references)
  const immoDir = path.join(targetDir, 'immo');
  if (fs.existsSync(immoDir)) {
    fs.rmSync(immoDir, { recursive: true });
    removedCount++;
    console.log(`  ${green}✓${reset} Removed immo/`);
  }

  // Remove IMMO agents
  const agentsDir = path.join(targetDir, 'agents');
  if (fs.existsSync(agentsDir)) {
    const files = fs.readdirSync(agentsDir);
    let agentCount = 0;
    for (const file of files) {
      if (file.startsWith('immo-') && file.endsWith('.md')) {
        fs.unlinkSync(path.join(agentsDir, file));
        agentCount++;
      }
    }
    if (agentCount > 0) {
      removedCount++;
      console.log(`  ${green}✓${reset} Removed ${agentCount} IMMO agents`);
    }
  }

  if (removedCount === 0) {
    console.log(`  ${yellow}No IMMO files found to remove.${reset}`);
  }

  console.log(`
  ${green}Done!${reset} IMMO has been uninstalled.
`);
}

/**
 * Install IMMO
 */
function install(isGlobal) {
  const src = path.join(__dirname, '..');

  const targetDir = isGlobal
    ? getClaudeDir()
    : path.join(process.cwd(), '.claude');

  const locationLabel = isGlobal
    ? targetDir.replace(os.homedir(), '~')
    : targetDir.replace(process.cwd(), '.');

  const pathPrefix = isGlobal
    ? `${targetDir}/`
    : './.claude/';

  console.log(`  Installing IMMO to ${cyan}${locationLabel}${reset}\n`);

  // Install commands
  const commandsSrc = path.join(src, 'commands', 'immo');
  const commandsDest = path.join(targetDir, 'commands', 'immo');
  if (fs.existsSync(commandsSrc)) {
    copyWithPathReplacement(commandsSrc, commandsDest, pathPrefix);
    const count = fs.readdirSync(commandsDest).filter(f => f.endsWith('.md')).length;
    console.log(`  ${green}✓${reset} Installed ${count} commands to commands/immo/`);
  }

  // Install reference docs
  const immoSrc = path.join(src, 'immo');
  const immoDest = path.join(targetDir, 'immo');
  if (fs.existsSync(immoSrc)) {
    copyWithPathReplacement(immoSrc, immoDest, pathPrefix);
    console.log(`  ${green}✓${reset} Installed immo/ (references & templates)`);
  }

  // Install agents
  const agentsSrc = path.join(src, 'agents');
  if (fs.existsSync(agentsSrc)) {
    const agentsDest = path.join(targetDir, 'agents');
    fs.mkdirSync(agentsDest, { recursive: true });

    const agentEntries = fs.readdirSync(agentsSrc, { withFileTypes: true });
    let agentCount = 0;
    for (const entry of agentEntries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        let content = fs.readFileSync(path.join(agentsSrc, entry.name), 'utf8');
        const dirRegex = /~\/\.claude\//g;
        content = content.replace(dirRegex, pathPrefix);
        fs.writeFileSync(path.join(agentsDest, entry.name), content);
        agentCount++;
      }
    }
    console.log(`  ${green}✓${reset} Installed ${agentCount} agents`);
  }

  // Write VERSION file
  const versionDest = path.join(targetDir, 'immo', 'VERSION');
  fs.mkdirSync(path.dirname(versionDest), { recursive: true });
  fs.writeFileSync(versionDest, pkg.version);
  console.log(`  ${green}✓${reset} Wrote VERSION (${pkg.version})`);

  console.log(`
  ${green}Done!${reset} Launch Claude Code and run ${cyan}/immo:help${reset} to get started.

  ${yellow}Quick Start:${reset}
    1. Navigate to your investment project folder
    2. Run ${cyan}/immo:init${reset} to set up investor profile
    3. Add property documents to ${cyan}properties/[location]/${reset}
    4. Run ${cyan}/immo:scout [location]${reset} to research the location
    5. Run ${cyan}/immo:analyze [location]${reset} to analyze units
`);
}

// Main logic
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (hasUninstall) {
  if (!hasGlobal && !hasLocal) {
    console.error(`  ${yellow}--uninstall requires --global or --local${reset}`);
    process.exit(1);
  }
  uninstall(hasGlobal);
} else if (hasGlobal || hasLocal) {
  install(hasGlobal);
} else {
  // Default to global install
  console.log(`  ${dim}No location specified, installing globally...${reset}\n`);
  install(true);
}
