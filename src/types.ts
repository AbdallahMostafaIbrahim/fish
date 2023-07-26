import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: {
        email: string;
        name: string;
        _id: string;
      };
    }
  }
}
