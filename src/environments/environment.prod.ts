// Environnement de production
export const environment = {
  production: true,
  
  apiUrl: 'http://localhost:8081/api/api',
  
  authUrl: 'http://localhost:8081/api/auth',
  
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  
  
  requestTimeout: 30000,
  
  maxAmountWithoutJustification: 10000
};
