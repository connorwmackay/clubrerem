
class Validation {
    constructor() {
        this.status = "";
    }

    isValidEmail(email) {
        if (typeof(email) == String) {
            email.forEach((char) => {
                if (char === '@') {
                    return true;
                }
            });
        }

        this.status = "Invalid email address.";
        return false;
    }

    isValidPassword(password) {
        if (typeof(password) == String) {
            if (password.length > 8) {
                return true;
            }
        }

        this.status = "Invalid password.";
        return false;
    }

    isPasswordCheckAccurate(password, passwordCheck) {
        if (typeof(password) == String && typeof(passwordCheck) == String) {
            if (password == passwordCheck) {
                return true;
            }
        }

        this.status = "Passwords do not match";
        return false;
    }

    setStatus(status) {
        this.status = status;
    }
}

module.exports=Validation;