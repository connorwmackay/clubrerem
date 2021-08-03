const { hashPassword, isPasswordCorrect, getRandomAuthKey } = require('../scripts/password');

test('Hashes and validates plaintext password "Password 1!"', () => {
    const password = "Password 1!";
    const passwordSalt = hashPassword(password);
    const passStatus = isPasswordCorrect(password, passwordSalt[0], passwordSalt[1]);

    return expect(passStatus).toBe(true);
});

test('Auth Key Generation', () => {
    const authKey = getRandomAuthKey();
    console.log(authKey);

    return expect(typeof authKey).toBe("string");
});