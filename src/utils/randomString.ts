export interface RandomStringOptions {
  number?: boolean;
  symbol?: boolean;
  symbolList?: string[];
}

/**
 * 生成随机字符串
 * @param length 生成随机字符的长度
 * @param options 可选
 * -number 是否出现数字 默认否
 * -symbol 是否出现复杂的字符（不是symbol类型，）
 * -symbolList 复杂字符列表 可选
 */
export function randomString(
  length: number,
  options: RandomStringOptions = {
    number: false,
    symbol: false,
    symbolList: '_-+=~!@#$%^&*()[]:"?><,.;{}`'.split(''),
  },
): string {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (options.number) {
    letters.push(...'1234567890'.split(''));
  }

  if (options.symbol) {
    letters.push(...(options as any).symbolList);
  }

  return Array.from({ length })
    .fill('-')
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('');
}
