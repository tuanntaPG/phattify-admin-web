// UAT
export const SERVER_URL = "http://ilosemobileapp.azurewebsites.net/api/";

// export const SERVER_URL = "http://phattifymobileservice.azurewebsites.net/api/";
// export const SERVER_URL = "http://localhost:3000/api/";
export const STATUS = {
    error: 'error',
    success: 'success'
};
export const GENDER = {
    Male: '0',
    Female: '1'
};
export const CACHE_SERVICE = {
    GetCountries: 7 * 60 * 60 * 24, // 1 week
    GetHealthChecklist: 7 * 60 * 60 * 24 // 1 week
};