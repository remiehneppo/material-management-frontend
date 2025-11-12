# Docker Build Instructions

## Build và chạy với Docker

### 1. Build Docker image

```bash
docker build -t material-management-fe .
```

### 2. Chạy container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url:8000 \
  material-management-fe
```

### 3. Sử dụng Docker Compose (Recommended)

Tạo file `.env` trong thư mục gốc:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Sau đó chạy:

```bash
# Build và start services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild khi có thay đổi
docker-compose up -d --build
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: URL của backend API (mặc định: `http://localhost:8000`)
- `NODE_ENV`: Environment mode (production/development)
- `PORT`: Port mà ứng dụng sẽ chạy (mặc định: 3000)

## Multi-stage Build

Dockerfile sử dụng multi-stage build để tối ưu kích thước image:

1. **deps**: Cài đặt dependencies
2. **builder**: Build ứng dụng Next.js
3. **runner**: Chạy ứng dụng production (chỉ chứa files cần thiết)

## Notes

- Image size: ~150-200MB (optimized)
- Node version: 20-alpine
- Non-root user: nextjs (uid: 1001)
- Standalone output: Enabled for optimal Docker deployment

## Development

Để chạy development mode:

```bash
npm run dev
```

Không cần Docker cho development, chỉ cần cho production deployment.
