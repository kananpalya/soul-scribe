import { Buffer } from 'buffer';

export const encrypt = (text: string, password: string): string => {
  try {
    const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: number) => textToChars(password).reduce((a, b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (e) {
    console.error('Encryption failed:', e);
    return text;
  }
};

export const decrypt = (encoded: string, password: string): string => {
  try {
    const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: number) => textToChars(password).reduce((a, b) => a ^ b, code);
    
    return encoded
      .match(/.{1,2}/g)!
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
  } catch (e) {
    console.error('Decryption failed:', e);
    return encoded;
  }
};