const validateEmail = (email) => {
    const pattern = /^[a-z\d]+[\w.-]@[a-z\d]+[a-z\d-]\.[a-z]{2,63}$/i;
    if (pattern.test(email)) {
        return true;
    } else {
        return false;
    }
};

export default validateEmail;
