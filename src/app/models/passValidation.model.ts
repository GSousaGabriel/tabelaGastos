export interface passValidation {
    [index: string]: boolean,
    hasLowerCase: boolean,
    hasUpperCase: boolean,
    hasNumber: boolean,
    lengthIsValid: boolean,
    hasSpecialChar: boolean,
}
