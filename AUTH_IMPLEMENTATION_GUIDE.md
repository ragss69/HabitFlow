# Authentication Implementation Guide

## Overview

This guide explains the authentication system implementation for the Goalify habit tracker MVP using Next.js App Router, Supabase Auth, and JWT tokens.

## 🎯 Solutions Implemented

### 1. Redirect Logic on Initial Page Load

**Problem**: When running `npm run dev`, the app loads `app/page.tsx` (root route `/`) but should redirect based on auth status.

**Solution**: 
- **Root Page (`/`)**: Handles client-side redirects based on localStorage
- **Middleware**: Handles server-side redirects based on cookies for better performance
- **Auth Status Check**: 
  - If user is logged in AND has "Remember Me" → redirect to `/dashboard`
  - If user is not logged in OR didn't check "Remember Me" → redirect to `/auth`

### 2. Modal Form for Dashboard

**Problem**: "Add Your First Goal" button navigates to `/goals` page instead of showing a modal.

**Solution**: 
- Integrated `AddGoalModal` component directly into dashboard
- Button now opens modal overlay instead of page navigation
- Form submission handled within dashboard context
- Clean routing maintained (no unnecessary navigation)

## 📁 File Structure

```
src/
├── app/
│   ├── page.tsx                    # Root page with redirect logic
│   ├── dashboard/page.tsx          # Dashboard with modal integration
│   ├── auth/page.tsx              # Authentication page
│   ├── goals/page.tsx             # Goals management page
│   ├── api/auth/
│   │   ├── login/route.ts         # Login API with cookie setting
│   │   ├── signup/route.ts        # Signup API with cookie setting
│   │   ├── logout/route.ts        # Logout API with cookie clearing
│   │   └── verify/route.ts        # Token verification
│   └── layout.tsx                 # Root layout
├── components/
│   └── AddGoalModal.tsx           # Goal creation modal
├── lib/
│   └── auth-utils.ts              # Authentication utilities
├── middleware.ts                   # Server-side redirect logic
└── types/
    └── index.ts                   # TypeScript interfaces
```

## 🔐 Authentication Flow

### 1. Initial Page Load
```typescript
// src/app/page.tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  const rememberMe = localStorage.getItem("rememberMe");

  if (token && rememberMe === "true") {
    router.push("/dashboard");
  } else {
    router.push("/auth");
  }
}, [router]);
```

### 2. Server-Side Middleware
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const rememberMe = request.cookies.get('rememberMe')?.value;
  
  if (pathname === '/') {
    if (token && rememberMe === 'true') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }
}
```

### 3. Login/Signup with Cookies
```typescript
// API routes set both localStorage and cookies
response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
});
```

## 🎨 Modal Implementation

### Dashboard Integration
```typescript
// src/app/dashboard/page.tsx
const [isModalOpen, setIsModalOpen] = useState(false);

const handleAddGoal = async (goalData: GoalFormData) => {
  // API call to create goal
  // Update local state
  setIsModalOpen(false);
};

// Button click handler
<button onClick={() => setIsModalOpen(true)}>
  Add Your First Goal
</button>

// Modal component
<AddGoalModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleAddGoal}
/>
```

## 🛡️ Security Best Practices

### 1. Token Storage
- **Cookies**: Used for server-side middleware (httpOnly, secure)
- **localStorage**: Used for client-side access
- **Remember Me**: Controls token expiration (30 days vs 1 day)

### 2. Authentication Checks
- **Client-side**: Check localStorage for immediate UI feedback
- **Server-side**: Check cookies in middleware for security
- **API routes**: Verify JWT tokens for protected endpoints

### 3. Logout Process
```typescript
const handleLogout = async () => {
  // Clear server-side cookies
  await fetch("/api/auth/logout", { method: "POST" });
  
  // Clear client-side storage
  localStorage.removeItem("token");
  localStorage.removeItem("rememberMe");
  
  // Redirect to auth
  window.location.href = "/auth";
};
```

## 🚀 Performance Optimizations

### 1. Middleware Benefits
- **Faster redirects**: Server-side redirects before page load
- **Reduced client-side code**: Less JavaScript execution
- **Better SEO**: Proper redirects for search engines

### 2. Cookie Strategy
- **httpOnly**: Prevents XSS attacks
- **secure**: HTTPS-only in production
- **sameSite**: CSRF protection
- **maxAge**: Automatic expiration

## 🔧 Configuration

### Environment Variables
```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    appDir: true,
  },
};
```

## 🧪 Testing Scenarios

### 1. Authentication Flow
- [ ] Fresh user visits `/` → redirected to `/auth`
- [ ] User logs in with "Remember Me" → redirected to `/dashboard`
- [ ] User logs in without "Remember Me" → session expires in 1 day
- [ ] User visits `/dashboard` without auth → redirected to `/auth`

### 2. Modal Functionality
- [ ] "Add Your First Goal" button opens modal
- [ ] Form submission creates goal
- [ ] Modal closes after successful submission
- [ ] No page navigation occurs

### 3. Logout Flow
- [ ] Logout clears both cookies and localStorage
- [ ] User redirected to `/auth`
- [ ] Subsequent visits to `/` redirect to `/auth`

## 📝 Best Practices Summary

### 1. **Dual Storage Strategy**
- Use cookies for server-side middleware
- Use localStorage for client-side access
- Keep both in sync for consistency

### 2. **Security First**
- httpOnly cookies prevent XSS
- JWT tokens with expiration
- Secure cookie flags in production

### 3. **User Experience**
- Fast redirects with middleware
- Modal forms for better UX
- Clear authentication states

### 4. **Code Organization**
- Separate concerns (auth utils, components, pages)
- TypeScript for type safety
- Consistent error handling

## 🔄 Future Enhancements

1. **Refresh Tokens**: Implement refresh token rotation
2. **Session Management**: Add session tracking
3. **Multi-factor Auth**: Add 2FA support
4. **Social Login**: Integrate OAuth providers
5. **Rate Limiting**: Add API rate limiting
6. **Audit Logging**: Track authentication events

## 🐛 Troubleshooting

### Common Issues

1. **Middleware not working**: Check cookie names and values
2. **Modal not opening**: Verify state management and event handlers
3. **Auth redirects failing**: Check localStorage vs cookie consistency
4. **Token expiration**: Verify JWT secret and expiration times

### Debug Steps

1. Check browser dev tools for cookies and localStorage
2. Verify API responses include proper cookies
3. Test middleware with different auth states
4. Monitor network requests for authentication calls

This implementation provides a robust, secure, and user-friendly authentication system for your habit tracker MVP. 