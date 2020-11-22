import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsPassword implements ValidatorConstraintInterface {
  validate(text: string) {
    return (
      text.length > 8 &&
      /[A-Z]/.test(text) &&
      [/[0-9]/, /[\W\D]/].map((regex) => regex.test(text)).filter(Boolean)
        .length >= 1
    );
  }

  defaultMessage() {
    return 'The password must be at least 8 characters long and must contain an upper case letter, and a number or a special character.';
  }
}
