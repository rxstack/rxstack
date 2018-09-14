export const formatFunc: Function = (info: any): string => {
  const {
    timestamp, level, message, ...args
  } = info;
  const source = args['source'] ? `[${args['source']}]` : '';
  delete args['source'];
  const meta = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
  const ts = timestamp.slice(0, 19).replace('T', ' ');
  return `${source} ${ts} [${level}]: ${message} ${meta}`;
};