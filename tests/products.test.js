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

describe('Products Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return all products with status 200', async () => {
      const mockProducts = [
        { _id: '654321654321654321654321', name: 'Product 1', price: 9.99 },
        { _id: '654321654321654321654322', name: 'Product 2', price: 19.99 }
      ];
      dbMockModule._toArrayFn.mockResolvedValue(mockProducts);

      const res = await request(app).get('/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
      expect(dbMockModule._dbMock.collection).toHaveBeenCalledWith('products');
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product with status 200 if found', async () => {
      const mockProduct = { _id: '654321654321654321654321', name: 'Product 1', price: 9.99 };
      dbMockModule._findOneFn.mockResolvedValue(mockProduct);

      const res = await request(app).get('/products/654321654321654321654321');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      dbMockModule._findOneFn.mockResolvedValue(null);

      const res = await request(app).get('/products/654321654321654321654321');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found.');
    });

    it('should return 400 if ID is invalid', async () => {
      const res = await request(app).get('/products/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });
  });
});
