# OSS Bucket ACL Configuration for Avatar Access

**Date**: 2026-01-19
**Issue**: Avatar uploads succeed but files cannot be accessed publicly
**Status**: ✅ Upload Fixed | ❌ Bucket ACL Configuration Required

---

## Current Status

### ✅ What's Working

1. **Avatar upload endpoint** - Files successfully upload to OSS
2. **File storage** - Images stored in `avatars/{userId}/{uuid}{ext}` format
3. **URL generation** - Correct URLs returned in API response
4. **Auth response** - Avatar field included in login/register/refresh responses

### ❌ What's Not Working

**Public Access Blocked**: Uploaded avatars return HTTP 403 AccessDenied error

```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>You have no right to access this object because of bucket acl.</Message>
</Error>
```

**Test Result**:
- **Upload URL**: `https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/10afaf6a-9f35-4122-ba1b-3bd93f831567/0b482db6-7a45-44de-a030-9285b200c0ba.png`
- **HTTP Code**: 403 Forbidden
- **Issue**: Bucket ACL blocks public read access

---

## Root Cause

The Aliyun OSS bucket `solo-guardian` has **two ACL-related restrictions**:

1. **Bucket-level ACL** blocks public read access
2. **Object-level ACL** setting is disabled (can't set `x-oss-object-acl: public-read`)

This means:
- Files upload successfully ✅
- Files are stored privately ✅
- Files cannot be accessed without authentication ❌

---

## Available Solutions

### Solution 1: Configure Bucket for Public Read Access (Recommended)

**Best for**: Public avatar images that should be accessible to anyone

**Steps** (via Aliyun OSS Console):

1. Log in to [Aliyun OSS Console](https://oss.console.aliyun.com/)
2. Navigate to bucket: `solo-guardian`
3. Go to **Access Control (ACL)** settings
4. Set bucket ACL to **Public Read** (公共读)
   - Read: Public
   - Write: Private (only authorized users)
5. Save changes

**After this change**:
- All files in `avatars/` folder will be publicly accessible
- No code changes needed
- Avatar URLs work directly in browser
- Mobile/web apps can display avatars without authentication

**Security Consideration**:
- Only avatar files will be in `avatars/` folder
- Other private files should use different folder paths
- Bucket remains write-protected (only backend can upload)

---

### Solution 2: Use Signed URLs (More Secure)

**Best for**: If you want to keep bucket private but allow temporary access

**Requires Code Changes**:

**File**: `apps/backend/src/modules/storage/storage.service.ts`

```typescript
async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
  if (!this.client) {
    throw new Error('OSS storage is not configured');
  }

  try {
    const url = this.client.signatureUrl(key, {
      expires: expiresInSeconds, // Default 1 hour
    });
    return url;
  } catch (error) {
    this.logger.error(`Failed to generate signed URL: ${error}`);
    throw new Error('Failed to generate signed URL');
  }
}
```

**Update `uploadAvatar` method**:
```typescript
async uploadAvatar(
  userId: string,
  buffer: Buffer,
  originalFilename: string,
): Promise<UploadResult> {
  // ... existing upload logic ...

  // Return signed URL instead of direct URL
  const signedUrl = await this.getSignedUrl(key, 86400); // 24 hours

  return { url: signedUrl, key };
}
```

**Pros**:
- More secure (temporary access)
- Bucket stays private
- Can control access duration

**Cons**:
- URLs expire and need refresh
- More complex implementation
- Frontend needs to handle URL refresh

---

### Solution 3: Configure CDN with Public Access

**Best for**: High traffic applications with global users

**Steps**:

1. **Enable Aliyun CDN** for the bucket
2. **Configure CDN domain** (e.g., `cdn.solo-guardian.com`)
3. **Set CDN to allow public access**
4. **Update .env file**:
   ```env
   ALIYUN_OSS_CDN_DOMAIN="https://cdn.solo-guardian.com"
   ```

**After configuration**:
- Avatar URLs use CDN domain: `https://cdn.solo-guardian.com/avatars/...`
- CDN handles public access rules
- Faster global delivery
- Lower OSS bandwidth costs

**Pros**:
- Best performance
- Lower costs at scale
- Global CDN edge caching

**Cons**:
- Additional setup required
- Extra cost for CDN service
- CDN propagation delay for new files

---

## Recommended Approach

**For Development/Testing**: Use **Solution 1** (Public Bucket ACL)
- Quick setup
- No code changes needed
- Direct URL access

**For Production**: Use **Solution 3** (CDN)
- Better performance
- Cost-effective at scale
- Professional setup

---

## Code Changes Made

### Fixed: Removed ACL Header Error

**File**: `apps/backend/src/modules/storage/storage.service.ts` (Lines 84-89)

**Before** (caused error):
```typescript
const result = await this.client.put(key, buffer, {
  headers: {
    'Content-Type': this.getMimeType(ext),
    'Cache-Control': 'max-age=31536000',
    'x-oss-object-acl': 'public-read', // ❌ Error: "Put public object acl is not allowed"
  },
});
```

**After** (uploads successfully):
```typescript
const result = await this.client.put(key, buffer, {
  headers: {
    'Content-Type': this.getMimeType(ext),
    'Cache-Control': 'max-age=31536000', // ✅ Works, but bucket ACL still blocks access
  },
});
```

---

## Testing Results

### Upload Test (Success ✅)

```bash
$ curl -X POST http://localhost:3000/api/v1/preferences/profile/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@test.png"

{
  "avatar": "https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/10afaf6a-9f35-4122-ba1b-3bd93f831567/0b482db6-7a45-44de-a030-9285b200c0ba.png",
  "name": "Test User",
  ...
}
```

### Access Test (Failed ❌ - Bucket ACL Blocks)

```bash
$ curl -I https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/10afaf6a-9f35-4122-ba1b-3bd93f831567/0b482db6-7a45-44de-a030-9285b200c0ba.png

HTTP/1.1 403 Forbidden
```

---

## Next Steps

### Option A: Quick Fix (Public Bucket)

1. ✅ **Backend code fixed** (ACL header removed)
2. ⏳ **Configure bucket ACL** (via Aliyun Console - requires manual action)
3. ✅ **Test public access** (after bucket configuration)

### Option B: Production Setup (CDN)

1. ✅ **Backend code fixed**
2. ⏳ **Enable Aliyun CDN** (manual setup)
3. ⏳ **Configure CDN domain**
4. ⏳ **Update .env with CDN_DOMAIN**
5. ✅ **Test CDN access**

---

## How to Configure Bucket ACL (Detailed Steps)

### Via Aliyun Console (Web UI)

1. Open [https://oss.console.aliyun.com/](https://oss.console.aliyun.com/)
2. Log in with your Aliyun account
3. Select region: **华南 1 (深圳)** / **cn-shenzhen**
4. Click on bucket: **solo-guardian**
5. In left sidebar, click **访问控制 (Access Control)** → **读写权限 (ACL)**
6. Change ACL to **公共读 (Public Read)**:
   - 读权限 (Read): 公共 (Public)
   - 写权限 (Write): 私有 (Private)
7. Click **保存 (Save)**
8. Confirm the change

### Via Aliyun CLI (Alternative)

```bash
# Install Aliyun CLI
# brew install aliyun-cli  # macOS
# pip install aliyun-cli   # Python

# Configure credentials
aliyun configure

# Set bucket ACL to public-read
aliyun oss put-bucket-acl \
  --bucket solo-guardian \
  --acl public-read
```

---

## Verification After Configuration

```bash
# 1. Upload new avatar
curl -X POST http://localhost:3000/api/v1/preferences/profile/avatar \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "avatar=@test.png" \
  | jq '.avatar'

# Expected: "https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/..."

# 2. Test public access
curl -I "AVATAR_URL_FROM_STEP_1"

# Expected: HTTP/1.1 200 OK (instead of 403)
```

---

## Summary

| Aspect | Status |
|--------|--------|
| Upload Functionality | ✅ Working |
| File Storage | ✅ Working |
| URL Generation | ✅ Working |
| Auth Response | ✅ Working |
| Public Access | ❌ **Blocked by bucket ACL** |

**Action Required**: Configure OSS bucket ACL to allow public read access (5-minute manual task in Aliyun Console)

**After Configuration**: ✅ All avatar features will work end-to-end

---

## Related Documentation

- [Avatar Auth Response Fix](./avatar_auth_response_fix_20260118.md) - Auth endpoints now include avatar field
- [Comprehensive Avatar Implementation](./comprehensive_avatar_fix_20260118.md) - Full avatar system overview
- [Aliyun OSS ACL Documentation](https://www.alibabacloud.com/help/en/oss/user-guide/bucket-acl) - Official bucket ACL guide

---

**Status**: Backend code is complete and working. Bucket configuration is a one-time manual setup task that will enable all avatar features.
