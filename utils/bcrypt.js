const bcrypt = require('bcryptjs');

const saltRounds = process.env.SALT_ROUNDS || 20000;

const genSalt = rounds => new Promise((resolve, reject) => {
  bcrypt.genSalt(rounds, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

const hash = async data => {
  const salt = await genSalt(saltRounds);
  new Promise((resolve, reject) => {
    bcrypt.hash(data, salt, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.password = result);
      }
    });
  });
}


const compare = (data, encrypted) => new Promise((resolve, reject) => {
  bcrypt.compare(data, encrypted, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

module.exports = {
  hash,
  compare,
};