const crypto = require('crypto');
const fs = require('fs');

const fields = JSON.parse(fs.readFileSync('blackfields.json'));

const result = {};

fields.forEach(field => {
  const hash = crypto.createHash('sha256').update(field).digest('hex');
  result[field] = `0x${hash}`;
});

fs.writeFileSync('blacklisted-hashes.json', JSON.stringify(result, null, 2));
console.log("✅ Hashed field map saved to blacklisted-hashes.json");
