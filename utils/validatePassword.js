/*
    This function is used to validate the password.
    - The password must be between 6 to 16 characters long.
    - The password must contain at least one numeric digit.
    - The password must contain at least one uppercase letter.
    - The password must contain at least one special character.
    - The password must not contain any whitespace.
*/

const validatePassword = (password) => {
    const pattern =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,16}$/;
    if (pattern.test(password)) {
        return true;
    } else {
        return false;
    }
};

export default validatePassword;
