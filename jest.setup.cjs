const { readFileSync } = require('node:fs');

const envFile = `${process.cwd()}/.env`;
const content = readFileSync(envFile, 'utf-8');
const envs = Object.fromEntries(
  content
    .split('\n')
    .filter((line) => line.trim() !== '')
    .filter((line) => !line.startsWith('#'))
    .map((line) => {
      const [key, value] = line.split('=');
      return [key, value];
    }),
);

Object.assign(process.env, envs);
