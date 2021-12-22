export type LoggerOptions = {
  layout?: 'basic' | 'json';
  filename: string;
  maxFileSize?: number;
  separator?: string;
};
