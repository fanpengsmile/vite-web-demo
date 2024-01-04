const innerConsole: { [index: string]: any } = console;
const createlog =
  (util: string) =>
  (...args: string[]) => {
    const fun = innerConsole[util] ? innerConsole[util] : innerConsole.log;
    // eslint-disable-next-line prefer-spread, no-void
    fun.apply(void 0, args);
  };

const consoleColor = (title: string, version: string) =>
  createlog('log')(
    `%c ${title} %c ${version} `,
    'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
    'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
  );
export default consoleColor;
