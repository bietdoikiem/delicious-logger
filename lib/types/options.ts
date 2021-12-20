export type LoggerOptions = {
  layout: 'base' | 'json';
  filename: string;
  maxFileSize?: number;
  dateFormat?: string;
  separator?: string;
};
