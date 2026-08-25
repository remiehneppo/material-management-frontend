# 🏗️ Material Management Frontend

Business terminology and lifecycle rules are maintained in the backend [`CONTEXT.md`](../material-management-backend/CONTEXT.md) and [`docs/adr`](../material-management-backend/docs/adr).

> **Hệ thống quản lý vật tư sửa chữa** - Giao diện người dùng hiện đại được xây dựng với **Vibe Coding** và Next.js

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

## 📋 Mô tả dự án

Hệ thống quản lý vật tư sửa chữa là một ứng dụng web toàn diện giúp tối ưu hóa quy trình quản lý và theo dõi vật tư cho các dự án sửa chữa. Dự án bao gồm:

- **Frontend**: Giao diện người dùng hiện đại (repository này)
- **Backend**: API server xử lý logic nghiệp vụ ([material-management](https://github.com/remiehneppo/material-management))

### ✨ Điểm nổi bật

🤖 **Frontend được xây dựng hoàn toàn với Vibe Coding** - Sử dụng AI để tăng tốc độ phát triển và đảm bảo chất lượng code cao.

### 🎯 Tính năng chính

- 🔐 **Xác thực & Phân quyền**: JWT authentication với auto-refresh token
- 📊 **Quản lý Dự án**: Theo dõi các dự án sửa chữa (SCCĐ, SCCN, SCCV)
- 📦 **Quản lý Vật tư**: CRUD vật tư, thiết bị, máy móc
- 📄 **Upload Excel**: Import dự trù vật tư từ file Excel
- ✅ **Workflow Phê duyệt**: Tạo và phê duyệt yêu cầu vật tư
- 📥 **Xuất báo cáo**: Export yêu cầu vật tư ra file DOCX
- 🎨 **UI/UX hiện đại**: Gradient design, animations, responsive

## 🛠️ Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next.js** | 15.5.6 | React framework với App Router |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Heroicons** | 2.2.0 | Icon library |
| **Axios** | 1.7.9 | HTTP client |
| **ESLint** | 9.x | Code linting |

## 📁 Cấu trúc dự án

```
material-management-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # Trang giới thiệu
│   │   ├── login/             # Trang đăng nhập
│   │   ├── materials/         # Quản lý vật tư
│   │   ├── profile/           # Thông tin cá nhân
│   │   ├── projects/          # Quản lý dự án
│   │   └── requests/          # Yêu cầu vật tư
│   ├── components/            # React components
│   │   ├── layout/           # Layout components (Header, Sidebar)
│   │   ├── materials/        # Material-related components
│   │   ├── projects/         # Project-related components
│   │   ├── providers/        # Context providers
│   │   └── requests/         # Request-related components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services
│   ├── types/                # TypeScript type definitions
│   └── config/               # Configuration files
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x hoặc **yarn** >= 1.22.x
- **Backend API**: Server phải chạy trước (xem [backend repo](https://github.com/remiehneppo/material-management))

### 1. Clone repository

```bash
git clone https://github.com/remiehneppo/material-management-frontend.git
cd material-management-frontend
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường

Tạo file `.env.local` trong thư mục root:

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8088/api/v1

# Optional: Custom port (default: 3000)
PORT=3000
```

### 4. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## 🔧 Các lệnh có sẵn

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra code với ESLint |

## 🐛 Debug

### Development Mode

1. **Chrome DevTools**: 
   - Mở DevTools (F12)
   - Tab "Sources" để debug JavaScript
   - Tab "Network" để kiểm tra API calls

2. **VS Code Debugging**:
   
   Tạo file `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Next.js: debug server-side",
         "type": "node-terminal",
         "request": "launch",
         "command": "npm run dev"
       },
       {
         "name": "Next.js: debug client-side",
         "type": "chrome",
         "request": "launch",
         "url": "http://localhost:3000"
       }
     ]
   }
   ```

3. **API Debugging**:
   - Kiểm tra console logs
   - Xem Network tab trong DevTools
   - API logs trong terminal server

### Common Issues

**Lỗi: Port 3000 đã được sử dụng**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Lỗi: Cannot connect to API**
- Kiểm tra backend server đang chạy
- Verify `NEXT_PUBLIC_API_URL` trong `.env.local`
- Check CORS settings trên backend

## 📦 Build Production

### 1. Build ứng dụng

```bash
npm run build
```

Lệnh này sẽ:
- Compile TypeScript
- Optimize React components
- Generate static assets
- Tạo thư mục `.next/` chứa production build

### 2. Test production build locally

```bash
npm run start
```

### 3. Deploy

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 2: Docker

```bash
# Build Docker image
docker build -t material-management-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url:8088/api/v1 \
  material-management-frontend
```

#### Option 3: PM2 (Production Server)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "material-frontend" -- start

# Other PM2 commands
pm2 list          # List running processes
pm2 logs          # View logs
pm2 restart all   # Restart
pm2 stop all      # Stop
pm2 delete all    # Delete from PM2
```

#### Option 4: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔗 API Integration

### Cấu hình API Client

File: `src/services/apiClient.ts`

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Services có sẵn

- **authService**: Login, logout, refresh token
- **equipmentMachineryService**: CRUD thiết bị/máy móc
- **maintenanceService**: Quản lý dự án sửa chữa
- **materialsProfileService**: Upload Excel, quản lý profile vật tư
- **materialRequestService**: Tạo/duyệt yêu cầu vật tư
- **userService**: Quản lý user

Xem chi tiết: [API_USAGE.md](./API_USAGE.md)

## 🎨 UI/UX Design Patterns

Frontend sử dụng các pattern design hiện đại:

- **Gradient Headers**: Header với gradient và decorative circles
- **Modern Cards**: Rounded corners, shadows, hover effects
- **Status Badges**: Dynamic colors theo trạng thái
- **Responsive Grid**: Auto-responsive với Tailwind
- **Animations**: fadeIn, slideUp, pulse, scale transforms
- **Icon System**: Heroicons + custom SVG components

## 🤝 Đóng góp

Dự án được xây dựng với **Vibe Coding** - AI-powered development workflow.

### Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Dự án này thuộc về **BaoTran** (@remiehneppo)

## 📞 Liên hệ

- **Author**: BaoTran
- **GitHub**: [@remiehneppo](https://github.com/remiehneppo)
- **Frontend Repo**: [material-management-frontend](https://github.com/remiehneppo/material-management-frontend)
- **Backend Repo**: [material-management](https://github.com/remiehneppo/material-management)

## 🙏 Credits

- Xây dựng với ❤️ và **Vibe Coding**
- Icons: [Heroicons](https://heroicons.com/)
- Framework: [Next.js](https://nextjs.org/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

---

© 2025 Material Management System. All rights reserved.
