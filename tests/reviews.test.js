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

describe('Reviews Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reviews', () => {
    it('should return all reviews with status 200', async () => {
      const mockReviews = [
        { _id: '654321654321654321654321', productId: '654321654321654321654320', reviewerName: 'John Doe', rating: 5, comment: 'Nice!' },
        { _id: '654321654321654321654322', productId: '654321654321654321654320', reviewerName: 'Jane Smith', rating: 4, comment: 'Good' }
      ];
      dbMockModule._toArrayFn.mockResolvedValue(mockReviews);

      const res = await request(app).get('/reviews');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReviews);
      expect(dbMockModule._dbMock.collection).toHaveBeenCalledWith('reviews');
    });
  });

  describe('GET /reviews/:id', () => {
    it('should return a review with status 200 if found', async () => {
      const mockReview = { _id: '654321654321654321654321', productId: '654321654321654321654320', reviewerName: 'John Doe', rating: 5, comment: 'Nice!' };
      dbMockModule._findOneFn.mockResolvedValue(mockReview);

      const res = await request(app).get('/reviews/654321654321654321654321');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReview);
    });

    it('should return 404 if review not found', async () => {
      dbMockModule._findOneFn.mockResolvedValue(null);

      const res = await request(app).get('/reviews/654321654321654321654321');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Review not found.');
    });

    it('should return 400 if ID is invalid', async () => {
      const res = await request(app).get('/reviews/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });
  });
});
