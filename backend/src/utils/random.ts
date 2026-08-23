import { randomInt } from 'crypto';

export const generateRandomOtpCode = (length: number = 6) => {
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DIGITS = '0123456789';
  const ALL_CHARS = LETTERS + DIGITS;

  const chars = [
    LETTERS[randomInt(LETTERS.length)],
    DIGITS[randomInt(DIGITS.length)],
  ];

  for (let i = chars.length; i < length; i++) {
    chars.push(ALL_CHARS[randomInt(ALL_CHARS.length)]);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
};
