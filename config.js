'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'local database';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'test database';
exports.PORT = process.env.PORT || 8080;