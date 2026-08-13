import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import config from '../config.js';

export function securityMiddleware(app) {
  // Helmet for basic security headers
  app.use(helmet());

  // CORS configuration: allow the configured frontend origin in development
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, server-to-server)
      if (!origin) return callback(null, true);
      if (origin === config.FRONTEND_URL) return callback(null, true);
      // In development allow localhost origins matching the frontend
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost' && config.FRONTEND_URL.includes('localhost')) {
          return callback(null, true);
        }
      } catch (e) {
        // ignore
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
  };

  app.use(cors(corsOptions));

  // JSON body parsing (minimal configuration)
  app.use(express.json());
}
