const { Pool } = require("pg");

// set up connection to the server
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1
  `;
  const queryParams = [email.toLowerCase()];

  return pool.query(queryString, queryParams).then((result) => {
    if (result.rows[0] === 0) {
      return null;
    }
    return result.rows[0];
  });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  SELECT id, name, email 
  FROM users
  WHERE id = $1`;
  const queryParams = [id];

  return pool
  .query(queryString, queryParams)
  .then((result) => {
    if (result.rows[0] === 0) {
      return null;
    }
    return result.rows[0];
  });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  queryParams = [user.name, user.email, user.password];
  return pool
  .query(queryString, queryParams)
  .then((result) => {
    return result.rows[0];
  });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
  FROM properties 
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews on properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  LIMIT $2
  `;
  const queryParams = [guest_id, limit];
  return pool.query(queryString, queryParams).then((result) => {
    return result.rows;
  });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city like $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (queryParams.length > 1) {
      queryString += ` AND properties.owner_id = $${queryParams.length}`;
    } else {
      queryString += `WHERE properties.owner_id = $${queryParams.length}`;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    if (queryParams.length > 1) {
      queryString += ` AND cost_per_night >= $${queryParams.length}`;
    } else {
      queryString += `WHERE cost_per_night >= $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    if (queryParams.length > 1) {
      queryString += ` AND cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `WHERE cost_per_night <= $${queryParams.length}`;
    }
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams).then((result) => {
    return result.rows;
  });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night * 100,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
  ];

  let queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
    cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province,  
    post_code, country)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `;
  return pool.query(queryString, queryParams).then((result) => {
    return result.rows;
  });
};
exports.addProperty = addProperty;
