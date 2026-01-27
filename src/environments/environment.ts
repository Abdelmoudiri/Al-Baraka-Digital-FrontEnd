// Environnement de développement
export const environment = {
  production: false,
  
  apiUrl: 'http://localhost:8081/api',
  
  authUrl: 'http://localhost:8081/api/auth',
  
  //  JWT
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  
  // Timeout 
  requestTimeout: 30000,
  
  // Montant (en DH)
  maxAmountWithoutJustification: 10000
};
