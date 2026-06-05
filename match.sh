#!/usr/bin/env bash
set -euo pipefail

# Sync admin/portfolio.json into PORTFOLIO_JSON in script.js
cd "$(dirname "$0")"

node -e "
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('admin/portfolio.json', 'utf-8'));
const jsonStr = JSON.stringify(json, null, 2);
const script = fs.readFileSync('script.js', 'utf-8');

const start = '// PORTFOLIO_JSON_START';
const end = '// PORTFOLIO_JSON_END';
const startIdx = script.indexOf(start);
const endIdx = script.indexOf(end);

if (startIdx === -1 || endIdx === -1) {
  console.error('Error: PORTFOLIO_JSON markers not found in script.js');
  process.exit(1);
}

const before = script.slice(0, startIdx + start.length);
const after = script.slice(endIdx);
const replacement = before + '\nconst PORTFOLIO_JSON = ' + jsonStr + ';\n' + after;
fs.writeFileSync('script.js', replacement);
console.log('✓ PORTFOLIO_JSON synced from admin/portfolio.json');
"
