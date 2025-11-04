# Token Refresh Mechanism

## Overview
This application implements automatic token refresh when encountering 401 Unauthorized errors from the API server.

## How It Works

### 1. **Initial Request**
- Every API request includes the access token in the Authorization header
- If the token is valid, the request proceeds normally

### 2. **401 Error Detection**
When a request receives a 401 Unauthorized response:
- The axios interceptor in `apiClient.ts` catches the error
- It checks if this is the first retry attempt (`_retry` flag)
- Login and refresh endpoints are excluded from auto-refresh

### 3. **Token Refresh Process**

#### Single Refresh Request
- A flag `isRefreshing` prevents multiple simultaneous refresh requests
- If already refreshing, subsequent requests are queued in `failedQueue`

#### Refresh Attempt
1. Retrieves the refresh token from localStorage
2. Makes a refresh request to `/auth/refresh` endpoint
3. If successful:
   - Updates both access and refresh tokens in localStorage
   - Updates the Authorization header with new token
   - Processes all queued requests with the new token
   - Retries the original failed request

#### Refresh Failure
If the refresh fails (invalid/expired refresh token):
1. Clears all tokens from localStorage
2. Processes queued requests with error
3. Calls the `handleUnauthorized()` method
4. Shows a message to the user
5. Redirects to the login page

### 4. **User Notification**
- When tokens cannot be refreshed, the user sees an alert message
- The message is handled by `AuthProvider.tsx` callback
- Automatic redirect to `/login` page

## Key Features

✅ **Automatic Token Refresh**: No user interaction needed for valid refresh tokens

✅ **Request Queuing**: Multiple failed requests wait for a single refresh operation

✅ **Graceful Degradation**: Clear error handling when refresh fails

✅ **User Feedback**: Alert message before redirect to login

✅ **No Duplicates**: Prevents multiple refresh requests

## Files Modified

### `src/services/apiClient.ts`
- Added `isRefreshing` flag and `failedQueue` array
- Implemented `processQueue()` method
- Enhanced response interceptor with smart refresh logic
- Added `refreshTokenRequest()` using a clean axios instance
- Improved `handleUnauthorized()` method

### `src/services/authService.ts`
- Re-enabled `refreshToken()` method
- Added documentation about automatic refresh

### `src/components/providers/AuthProvider.tsx`
- Enhanced unauthorized callback with user notification
- Added console logging for debugging

## Testing Scenarios

### Scenario 1: Token Expires During Usage
1. User is actively using the app
2. Access token expires
3. Next API request gets 401
4. System automatically refreshes token
5. Request succeeds with new token
6. User doesn't notice anything

### Scenario 2: Refresh Token Expires
1. User hasn't used app for a long time
2. Both access and refresh tokens expire
3. System tries to refresh but fails
4. User sees alert: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
5. Redirects to login page

### Scenario 3: Multiple Concurrent Requests
1. Multiple API calls happen simultaneously
2. All receive 401 errors
3. Only one refresh request is made
4. Other requests wait in queue
5. All requests retry with new token after refresh succeeds

## API Contract

The refresh endpoint must return:
```json
{
  "status": true,
  "data": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token"
  }
}
```

## Environment Variables
Make sure `NEXT_PUBLIC_API_URL` is set correctly in your `.env` file.

## Future Improvements
- Add toast notifications instead of alerts
- Add retry counter to prevent infinite loops
- Add telemetry for refresh failures
- Implement token expiry time checking before requests
