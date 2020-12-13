import * as yup from 'yup';

export const passwordSchema = yup
  .string()
  .test(
    'Password',
    'The password must be at least 8 characters long and must contain an upper case letter, and a number or a special character.',
    (string?: string) =>
      !!string &&
      string.length > 8 &&
      /[A-Z]/.test(string) &&
      [/[0-9]/, /[\W\D]/].map((regex) => regex.test(string)).filter(Boolean)
        .length >= 1,
  );
