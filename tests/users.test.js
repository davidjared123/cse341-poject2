const request = require('supertest');

// Mock authenticate middleware to bypass login
jest.mock('../middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => {
    req.session = req.session || {};
    req.session.user = { username: 'testuser', displayName: 'Test User' };
    req.isAuthenticated = () => true;
    next();
  }
}));

// Mock MongoDB
jest.mock('../config/db', () => {
  const toArrayFn = jest.fn();
  const findOneFn = jest.fn();
  const collectionMock = {
    find: jest.fn().mockReturnValue({ toArray: toArrayFn }),
    findOne: findOneFn
  };
  const dbMock = {
    collection: jest.fn().mockReturnValue(collectionMock)
  };
  const clientMock = {
    db: jest.fn().mockReturnValue(dbMock)
  };
  return {
    initDb: jest.fn((callback) => callback(null, clientMock)),
    getDb: jest.fn().mockReturnValue(clientMock),
    _toArrayFn: toArrayFn,
    _findOneFn: findOneFn,
    _dbMock: dbMock
  };
});

const app = require('../server');
const dbMockModule = require('../config/db');

describe('Users Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        { _id: '654321654321654321654321', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', username: 'janedoe', role: 'Customer' },
        { _id: '654321654321654321654322', firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', username: 'bobsmith', role: 'Admin' }
      ];
      dbMockModule._toArrayFn.mockResolvedValue(mockUsers);

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(dbMockModule._dbMock.collection).toHaveBeenCalledWith('users');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user with status 200 if found', async () => {
      const mockUser = { _id: '654321654321654321654321', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', username: 'janedoe', role: 'Customer' };
      dbMockModule._findOneFn.mockResolvedValue(mockUser);

      const res = await request(app).get('/users/654321654321654321654321');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      dbMockModule._findOneFn.mockResolvedValue(null);

      const res = await request(app).get('/users/654321654321654321654321');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found.');
    });

    it('should return 400 if ID is invalid', async () => {
      const res = await request(app).get('/users/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });
  });
});
