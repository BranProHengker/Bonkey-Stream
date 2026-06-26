const fs = require('fs');
const path = require('path');

// Try loading from .env or .env.local if present
try {
  const envPath = fs.existsSync(path.join(process.cwd(), '.env.local'))
    ? path.join(process.cwd(), '.env.local')
    : fs.existsSync(path.join(process.cwd(), '.env'))
    ? path.join(process.cwd(), '.env')
    : null;

  if (envPath) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  // Ignore env loading errors
}

const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_ORG_ID;
const vercelToken = process.env.VERCEL_TOKEN;

// Get action from CLI argument: node scripts/pause-project.js [pause/unpause]
const action = process.argv[2] || 'pause';

if (action !== 'pause' && action !== 'unpause') {
  console.error('Error: Action must be either "pause" or "unpause".');
  console.error('Usage:');
  console.error('  node scripts/pause-project.js pause');
  console.error('  node scripts/pause-project.js unpause');
  process.exit(1);
}

async function controlProject() {
  if (!projectId || !vercelToken) {
    console.error('Error: Please define VERCEL_PROJECT_ID and VERCEL_TOKEN in your environment or .env.local file.');
    process.exit(1);
  }

  const url = new URL(`https://api.vercel.com/v1/projects/${projectId}/${action}`);
  if (teamId) {
    url.searchParams.append('teamId', teamId);
  }

  console.log(`${action === 'pause' ? 'Pausing' : 'Resuming/Unpausing'} Vercel project: ${projectId}...`);
  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vercelToken}`,
      },
    });

    const status = res.status;
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      console.log(`Success! Project ${action === 'pause' ? 'paused' : 'resumed/unpaused'} successfully.`);
      console.log(data);
    } else {
      console.error(`Failed to perform action. HTTP Status: ${status}`);
      console.error(data);
    }
  } catch (error) {
    console.error('Error connecting to Vercel API:', error);
  }
}

controlProject();
