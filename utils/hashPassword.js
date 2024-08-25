import bcrypt from 'bcryptjs';
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export default hashPassword;
