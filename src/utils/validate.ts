import joi from 'joi';

export const idSchema = joi.string().required();

export const passwordSchema = joi
  .string()
  .required()
  .custom((value: string, helper) => {
    return (
      (!!value &&
        value.length > 8 &&
        /[A-Z]/.test(value) &&
        [/[0-9]/, /[\W\D]/].map((regex) => regex.test(value)).filter(Boolean)
          .length >= 1) ||
      helper.message({
        invalidPassword: 'Password must be at least 8 characters long',
      })
    );
  });
