import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

type AlertResponse = {
  has_alert: boolean;
  date?: string | null;
  message?: string | null;
  error?: string;
};

function runPythonScript(): Promise<AlertResponse> {
  const scriptPath = path.join(process.cwd(), 'scripts', 'suffolk_alert.py');

  return new Promise((resolve, reject) => {
    const child = spawn('python3', [scriptPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => reject(err));

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`python exited with code ${code}: ${stderr || stdout}`));
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed as AlertResponse);
      } catch (err) {
        reject(
          new Error(
            `failed to parse python output: ${err instanceof Error ? err.message : String(err)}; raw: ${stdout}`,
          ),
        );
      }
    });
  });
}

export async function GET() {
  try {
    const data = await runPythonScript();
    console.log('[suffolk-alert] fetched alert data:', data);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[suffolk-alert]', message);
    return NextResponse.json({ has_alert: false, error: message }, { status: 500 });
  }
}
