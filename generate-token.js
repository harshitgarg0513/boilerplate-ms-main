const jwt = require('jsonwebtoken');

const AUTH_JWT_SECRET = "3p7t4iZqB8xKj6D9eNfH1R1vL5aW9YpXcM2sT4oQmU8JrVd2F";

// Payload (customize if needed)
// Use `sub`/`username` and numeric `role` so guards expect the canonical shape
const payload = {
  sub: 1,
  username: "test",
  role: 6
};

// Generate token
const token = jwt.sign(payload, AUTH_JWT_SECRET, {
  expiresIn: "1h",
});

console.log("JWT Token:\n");
console.log(token);
