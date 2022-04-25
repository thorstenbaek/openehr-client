/**
 * Generates random strings. By default this returns random 8 characters long
 * alphanumeric strings.
 * @param strLength The length of the output string. Defaults to 8.
 * @param charSet A string containing all the possible characters.
 *     Defaults to all the upper and lower-case letters plus digits.
 * @category Utility
 */

export function randomString(
  strLength = 8,
  charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string {
  const result = [];
  const len = charSet.length;
  while (strLength--) {
    result.push(charSet.charAt(Math.floor(Math.random() * len)));
  }
  return result.join('');
}
