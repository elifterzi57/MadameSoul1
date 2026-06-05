import { describe, it, expect, vi } from 'vitest';

// Emulate requireRole in unit tests to test its logic
const requireRole = (allowedRoles: ('user' | 'employee' | 'admin')[]) => {
  return (req: any, res: any, next: any) => {
    const role = req.user?.role || 'user';
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};

describe('RBAC requireRole Middleware Logic', () => {
  it('should allow request if user has the allowed role', () => {
    const req = { user: { role: 'admin' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    const middleware = requireRole(['admin', 'employee']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should block request and return 403 if user has a different role', () => {
    const req = { user: { role: 'user' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    const middleware = requireRole(['admin', 'employee']);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: Access denied" });
  });

  it('should default to standard user and block request if user object has no role claim', () => {
    const req = { user: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    const middleware = requireRole(['admin']);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should default to standard user and allow if standard user role is permitted', () => {
    const req = { user: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    const middleware = requireRole(['user']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
