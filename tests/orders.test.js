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

describe('Orders Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return all orders with status 200', async () => {
      const mockOrders = [
        { _id: '654321654321654321654321', customerName: 'John Doe', productName: 'Product 1', quantity: 2, totalAmount: 19.98 },
        { _id: '654321654321654321654322', customerName: 'Jane Smith', productName: 'Product 2', quantity: 1, totalAmount: 19.99 }
      ];
      dbMockModule._toArrayFn.mockResolvedValue(mockOrders);

      const res = await request(app).get('/orders');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrders);
      expect(dbMockModule._dbMock.collection).toHaveBeenCalledWith('orders');
    });
  });

  describe('GET /orders/:id', () => {
    it('should return an order with status 200 if found', async () => {
      const mockOrder = { _id: '654321654321654321654321', customerName: 'John Doe', productName: 'Product 1', quantity: 2, totalAmount: 19.98 };
      dbMockModule._findOneFn.mockResolvedValue(mockOrder);

      const res = await request(app).get('/orders/654321654321654321654321');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });

    it('should return 404 if order not found', async () => {
      dbMockModule._findOneFn.mockResolvedValue(null);

      const res = await request(app).get('/orders/654321654321654321654321');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Order not found.');
    });

    it('should return 400 if ID is invalid', async () => {
      const res = await request(app).get('/orders/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });
  });
});
