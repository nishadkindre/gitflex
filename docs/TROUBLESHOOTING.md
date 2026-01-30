# GitHub API Troubleshooting Guide

This document helps you resolve common GitHub API authentication and connectivity issues in GitFlex.

## Common Error Messages

### "Bad credentials" (401 Error)

**Problem**: GitHub API returns `{"message": "Bad credentials", "documentation_url": "https://docs.github.com/rest", "status": "401"}`

**Solutions**:

1. **Check if .env file exists**
   ```bash
   ls -la | grep .env
   ```
   If no `.env` file exists, copy from example:
   ```bash
   cp .env.example .env
   ```

2. **Verify token format**
   Your token should look like: `ghp_xxxxxxxxxxxxxxxxxxxx` or `github_pat_xxxxx`

3. **Check .env file syntax**
   ```env
   # ✅ Correct
   VITE_GITHUB_TOKEN=ghp_your_actual_token_here
   
   # ❌ Wrong - has spaces
   VITE_GITHUB_TOKEN = ghp_your_token
   
   # ❌ Wrong - has quotes
   VITE_GITHUB_TOKEN="ghp_your_token"
   ```

4. **Restart development server**
   After changing .env, restart your dev server:
   ```bash
   npm run dev
   ```

### "Rate limit exceeded" (403 Error)

**Problem**: Too many API requests without authentication

**Solutions**:

1. **Add GitHub token** (recommended)
   - Increases limit from 60 to 5000 requests/hour
   - Follow token creation steps below

2. **Wait for rate limit reset**
   - Check reset time in error message
   - Usually resets every hour

3. **Use caching effectively**
   - GitFlex caches responses for 5 minutes
   - Avoid rapid page refreshes

### "User not found" (404 Error)

**Problem**: GitHub username doesn't exist

**Solutions**:
- Verify username spelling
- Check if user exists on GitHub.com
- Try a different username

## Setting Up GitHub Token

### Step 1: Create Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Set these options:
   - **Note**: GitFlex API Access
   - **Expiration**: No expiration (or as needed)
   - **Scopes**: No scopes needed for public data

### Step 2: Add Token to GitFlex

1. Create/edit `.env` file in project root:
   ```bash
   touch .env
   ```

2. Add your token:
   ```env
   VITE_GITHUB_TOKEN=ghp_your_token_here
   ```

3. Restart development server:
   ```bash
   npm run dev
   ```

### Step 3: Verify Setup

- Visit the About page in GitFlex
- You should see a green "GitHub API Connected" status
- Check rate limit: should show 5000/hour instead of 60/hour

## Token Security Best Practices

### ✅ Do:
- Keep tokens in `.env` file (never commit to git)
- Use minimal required permissions
- Regenerate tokens periodically
- Use different tokens for different projects

### ❌ Don't:
- Commit tokens to version control
- Share tokens publicly
- Use tokens with unnecessary permissions
- Hardcode tokens in source code

## Debugging Steps

### 1. Check Environment Variables
```javascript
console.log('Token exists:', !!import.meta.env.VITE_GITHUB_TOKEN);
console.log('Token preview:', import.meta.env.VITE_GITHUB_TOKEN?.slice(0, 8) + '...');
```

### 2. Test API Connection
Open browser console and run:
```javascript
fetch('https://api.github.com/rate_limit', {
  headers: {
    'Authorization': 'Bearer ' + import.meta.env.VITE_GITHUB_TOKEN
  }
})
.then(r => r.json())
.then(console.log);
```

### 3. Check Network Tab
1. Open Developer Tools → Network tab
2. Make a GitHub API request
3. Look for:
   - Authorization header in request
   - Response status and error messages
   - Rate limit headers in response

## Rate Limits Explained

| Scenario | Requests/Hour | Use Case |
|----------|---------------|----------|
| No token | 60 | Light usage, testing |
| With token | 5,000 | Production use, heavy usage |
| GitHub Enterprise | 15,000+ | Enterprise environments |

## Environment Variables Reference

```env
# Required for authenticated requests
VITE_GITHUB_TOKEN=your_token_here

# Optional - API base URL (default: https://api.github.com)
VITE_API_BASE_URL=https://api.github.com
```

## Still Having Issues?

1. **Check GitFlex GitHub Issues**: [Report a bug](https://github.com/nishadkindre/gitflex/issues)
2. **Verify GitHub API Status**: [status.github.com](https://status.github.com)
3. **Test with curl**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/rate_limit
   ```

## Quick Fix Checklist

- [ ] `.env` file exists in project root
- [ ] Token is valid (starts with `ghp_` or `github_pat_`)
- [ ] No quotes or spaces around token in `.env`
- [ ] Development server restarted after adding token
- [ ] Token has not expired
- [ ] GitHub API status is operational

---

**Need help?** Open an issue with:
- Error message (remove your token!)
- Steps to reproduce
- Browser console logs
- Network request details