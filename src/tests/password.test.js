const { hashPassword, isPasswordCorrect } = require('../scripts/password');

test('Hashes and validates plaintext password "Password 1!"', () => {
    const password = "Password 1!";
    const passwordSalt = hashPassword(password);
    const passStatus = isPasswordCorrect(password, passwordSalt[0], passwordSalt[1]);

    return expect(passStatus).toBe(true);
});