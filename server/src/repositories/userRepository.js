var BaseRepository = require('./baseRepository');

var findByEmailOrUsername = function findByEmailOrUsername(emailOrUsername) {
  self = this;

  return new Promise((resolve, reject) => {
    self.connection()
      .then((connection) => {
        return connection.query(`
          SELECT
            id,
            firstname,
            lastname,
            email,
            username,
            password,
            isActive
          FROM
            users
          WHERE
            email = ? OR
            username = ?
          LIMIT 1
        `,
        [emailOrUsername, emailOrUsername],
        (error, rows, columns) => {
          self.release(connection);

          if (error) {
            return reject(error);
          }

          resolve(rows[0]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

var UserRepository = function UserRepository() {};

UserRepository.prototype = BaseRepository();
UserRepository.prototype.findByEmailOrUsername = findByEmailOrUsername;

module.exports = UserRepository;
