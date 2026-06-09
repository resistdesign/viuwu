import { writeFile } from 'node:fs/promises';

const domain = process.env.CUSTOM_DOMAIN?.trim();

if (domain) {
  await writeFile(new URL('../public/CNAME', import.meta.url), `${domain}\n`, 'utf8');
  console.log(`Configured custom domain: ${domain}`);
} else {
  console.log('CUSTOM_DOMAIN is unset; using the GitHub Pages project URL.');
}
