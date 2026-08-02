function validateCredentials(body) {
    const { username, password } = body;

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        username.trim() === "" ||
        password.trim() === "" ||
        username.split(" ").length > 1
    ) {
        return false;
    }
    return true;
}

module.exports = {
    validateCredentials
}