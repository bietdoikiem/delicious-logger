import { Request } from 'express';
import { Color, colorize } from './color';

const logRequest = (req: Request) => {
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

export { logRequest };
