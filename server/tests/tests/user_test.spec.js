import { test, expect } from '@playwright/test';

const baseUrl = "http://localhost:5000";

let accessToken = "";

// get user details test
test('should get the user details', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/users/Obby`);
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});

// Login test
test('should login the user', async ({ request }) => {
    const response = await request.post(`${baseUrl}/api/users/login`, {
        data: {
            email: "obby@test.com",
            password: "maman123456"
        }
    });
    console.log(await response.json());
    expect(response.status()).toBe(200);
});

//Logout test
test('should logout the user', async ({ request }) => {
    const loginResponse = await request.post(`${baseUrl}/api/users/login`, {
        data: {
            email: "obby@test.com",
            password: "maman123456"
        }
    });
    expect(loginResponse.status()).toBe(200);

    const loginResponseBody = await loginResponse.json();
    accessToken = loginResponseBody.accessToken;
    
    const logoutResponse = await request.post(`${baseUrl}/api/users/logout`, {
        data: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    console.log(await logoutResponse.json());
    expect(logoutResponse.status()).toBe(200);
});

// Signup test
// test('should sign up the user', async ({ request }) => {
//     const response = await request.post(`${baseUrl}/api/users/signup`, {
//         data: {
//             displayName: "Dobby",
//             email: "Dobby@yahoo.com",
//             password: "maman123456",
//             gender:"Man",
//             dateOfBirth:"1990-01-01",
//         }
//     });
//     const responseBody = await response.json();
//     console.log(responseBody);
//     expect(response.status()).toBe(200);
// });