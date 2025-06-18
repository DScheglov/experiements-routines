import { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'node:http';
import { GenericResponse, Impl, ParsedRequest } from '../routines/types';

const parseJsonBody = async (req: IncomingMessage): Promise<unknown> => {
  const rawBody = await new Promise<string>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

  try {
    return JSON.parse(rawBody);
  } catch {
    return undefined;
  }
};

const jsonRoutine =
  (impl: Impl<ParsedRequest, {}, GenericResponse>) =>
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const body = await parseJsonBody(req);

      const request = {
        url: new URL(
          req.url || '/',
          `http://${req.headers.host || 'localhost'}`,
        ),
        headers: req.headers,
        cookies: parse(req.headers.cookie || ''),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parameters: (req as any).params,
        body,
      };

      const response = await impl(request, {});

      res.writeHead(response.status, response.headers);
      res.end(JSON.stringify(response.body));
    } catch (error) {
      console.error('Error processing request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end({ success: false, error: 'Internal Server Error' });
    }
  };

export default jsonRoutine;
