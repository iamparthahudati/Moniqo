const DEV_URL = 'http://10.0.2.2/moniqo-api/api'; // Android emulator
// const DEV_URL = 'http://192.168.1.x/moniqo-api/api'; // Physical device — replace IP
const PROD_URL = 'https://bloomingnews24.com/moniqo-api/api';

const IS_DEV = __DEV__;

export const API_BASE_URL = IS_DEV ? DEV_URL : PROD_URL;

export const API_TIMEOUT = 15000; // 15 seconds
