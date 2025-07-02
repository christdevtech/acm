# Cookie-Based Petition Support System

This document explains the implementation of the cookie-based petition support tracking system that prevents users from supporting the same petition multiple times.

## Overview

The system uses HTTP-only cookies to track whether a user has already supported a specific petition. This provides a more reliable method than IP-based tracking alone, as it persists across browser sessions and works better for users behind shared IP addresses.

## Implementation Details

### 1. API Endpoints

#### `/api/support-petition` (POST)
- **Purpose**: Create a new petition support record
- **Cookie Behavior**: 
  - Checks for existing support cookie before processing
  - Sets a petition-specific cookie upon successful support
  - Cookie name format: `petition_support_{petitionId}`
  - Cookie expires after 1 year
  - HTTP-only, secure in production, SameSite=lax

#### `/api/check-petition-support` (GET)
- **Purpose**: Check if user has already supported a petition
- **Parameters**: `petitionId` (query parameter)
- **Returns**: `{ hasSupported: boolean, petitionId: string }`

### 2. Cookie Configuration

```javascript
response.cookies.set(supportCookieName, 'true', {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
})
```

### 3. Client-Side Components

#### PetitionSupport Component
- Checks for existing support on component mount
- Includes `credentials: 'include'` in all fetch requests
- Shows loading state while checking support status
- Disables support button if already supported

#### PetitionCard Component
- Same functionality as PetitionSupport component
- Only checks support status if `showSupportButton` is true

### 4. Security Features

#### CSRF Protection
- Configured in `payload.config.ts`
- Allows requests from trusted domains only
- Prevents cross-site request forgery attacks

#### Cookie Security
- HTTP-only cookies prevent XSS attacks
- Secure flag in production ensures HTTPS-only transmission
- SameSite=lax provides CSRF protection while allowing normal navigation

### 5. Fallback Mechanism

The system maintains IP-based tracking as a fallback:
- If a user has an existing IP-based support record but no cookie, a cookie is set
- This ensures backward compatibility with existing support records
- Provides additional protection against duplicate supports

## Usage

### For Users
1. User visits a petition page
2. System checks for existing support cookie
3. If no cookie exists, support button is enabled
4. Upon supporting, a cookie is set to prevent future duplicate supports
5. Cookie persists for 1 year across browser sessions

### For Developers
- All petition support requests must include `credentials: 'include'`
- Components automatically handle support status checking
- No additional configuration needed for new petition pages

## Benefits

1. **Persistent Tracking**: Cookies persist across browser sessions
2. **Better User Experience**: Immediate feedback on support status
3. **Reduced Server Load**: Client-side checking reduces unnecessary API calls
4. **Security**: HTTP-only cookies prevent XSS, CSRF protection prevents attacks
5. **Reliability**: Works better than IP-only tracking for shared networks

## Browser Compatibility

- Works in all modern browsers that support cookies
- Gracefully degrades to IP-based tracking if cookies are disabled
- No JavaScript required for cookie setting (handled server-side)

## Privacy Considerations

- Cookies are petition-specific and contain no personal information
- Only stores a boolean flag indicating support status
- Automatically expires after 1 year
- Can be cleared by user through browser settings