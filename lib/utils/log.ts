import { Request } from 'express';
import { Color, colorize } from './color';

// TODO: Save and Log Request in a file (?)

/**
 * Log incoming request to server including payload
 *
 * @param req Request
 */
export const logRequest = (req: Request) => {
  const { body, query, headers } = req;
  const logData = {
    body,
    query,
    headers,
  };
  console.log(
    `[${new Date().toLocaleString().replace(',', '')}] ${colorize(
      `[${req.method}]`,
      Color.FgCyan
    )} - ${colorize(`${req.url}`, Color.FgYellow)} - ${JSON.stringify(logData)}`
  );
};
