const fs = require('fs');
const path = require('path');

const gradle = fs.readFileSync(
  path.resolve(__dirname, '../android/app/build.gradle'),
  'utf8',
);

const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1];

if (!versionName || !versionCode) {
  console.error('sync-version: could not parse versionName/versionCode from build.gradle');
  process.exit(1);
}

const out = `export const APP_VERSION = '${versionName}';\nexport const BUILD_NUMBER = ${versionCode};\n`;

fs.writeFileSync(
  path.resolve(__dirname, '../src/config/version.ts'),
  out,
);

console.log(`sync-version: v${versionName} (${versionCode})`);
