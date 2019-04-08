import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import pool from '../models/database';

const salt = bcrypt.genSaltSync(10);
const secret = 'andela';

/**
 * @class UserController
 */
class UserController {
  /**
   * creates new user
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof UserController
   */
  // eslint-disable-next-line consistent-return
  static signup(request, response) {
    if (!request.body.firstName) {
      return response.status(400).json({
        status: 400,
        error: 'First name is required',
      });
    }
    if (!request.body.lastName) {
      return response.status(400).json({
        status: 400,
        error: 'Last name is required',
      });
    }
    if (!request.body.email) {
      return response.status(400).json({
        status: 400,
        error: 'Email is required',
      });
    }
    if (!request.body.password) {
      return response.status(400).json({
        status: 400,
        error: 'Password is required',
      });
    }
    if (request.body.password !== request.body.confirmPassword) {
      return response.status(400).json({
        status: 400,
        error: 'Passwords do not match',
      });
    }
    const data = {
      email: request.body.email,
      firstname: request.body.firstName,
      lastname: request.body.lastName,
      password: bcrypt.hashSync(request.body.password, salt),
      type: 'user',
      registered: moment().format(),
      isAdmin: false,
    };

    pool.connect((err, client, done) => {
      const query = `INSERT INTO users(
        email,
        firstname,
        lastname,
        password,
        type,
        registered,
        isAdmin
      ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const values = Object.values(data);

      client.query(query, values, (error, result) => {
        done();
        if (error) {
          if (error.code === '23505') {
            return response.status(400).json({
              status: 400,
              error: 'Email already exist',
            });
          }
          return response.status(500).json({
            status: 400,
            error,
          });
        }
        const user = result.rows[0];
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        }, secret);
        const { password, registered, ...userdata } = user;

        return response.status(201).json({
          status: 201,
          data: {
            token,
            id: userdata.id,
            firstName: userdata.firstname,
            lastName: userdata.lastname,
            email: userdata.email,
          },
        });
      });
    });
  }
}

export default UserController;
