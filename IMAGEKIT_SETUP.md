# ImageKit Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_GAPnMAhr9BNu04vNPwwzaMH4fBk=
IMAGEKIT_PRIVATE_KEY=private_Smvy9cJj1+bq5TXnITr65+d7GAw=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/8vvqhvynx
```

## ImageKit Credentials

- **URL Endpoint**: `https://ik.imagekit.io/8vvqhvynx`
- **Public Key**: `public_GAPnMAhr9BNu04vNPwwzaMH4fBk=`
- **Private Key**: `private_Smvy9cJj1+bq5TXnITr65+d7GAw=` (Keep confidential)

## Image Transformations

ImageKit supports URL-based transformations. When displaying images, you can add transformation parameters to the URL:

### Example Transformations:
- Resize: `?tr=w-800,h-600`
- Quality: `?tr=q-80`
- Format: `?tr=f-auto`
- Combined: `?tr=w-1200,h-1200,c-at_max,q-auto`

### Usage in Components:
```typescript
// Original image URL
const imageUrl = "https://ik.imagekit.io/8vvqhvynx/printmarket/products/image.jpg"

// With transformations
const optimizedUrl = `${imageUrl}?tr=w-1200,h-1200,c-at_max,q-auto`
```

## Features

- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ On-the-fly transformations
- ✅ Free tier: 20GB bandwidth/month
- ✅ Secure uploads with authentication

## Testing

After setting up environment variables, test the upload by:
1. Going to `/marketplace/my-products/new`
2. Selecting product images
3. Images should upload to ImageKit automatically
4. Check ImageKit dashboard to verify uploads
