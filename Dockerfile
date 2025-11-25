# 1. Base image: NÂNG CẤP LÊN NODE 20 (Next.js mới yêu cầu >= 20.9.0)
FROM node:20-alpine AS base

# 2. Dependencies: Cài đặt các gói cần thiết
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json để cài đặt dependencies trước
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder: Build source code Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Nếu bạn dùng Prisma, cần generate client trước khi build
RUN npx prisma generate

# Build project
RUN npm run build

# 4. Runner: Chạy ứng dụng (Production image)
FROM base AS runner
WORKDIR /app

# Sửa lỗi warning LegacyKeyValueFormat bằng cách thêm dấu "="
ENV NODE_ENV=production
# Tắt telemetry của Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file public (ảnh, static assets)
COPY --from=builder /app/public ./public

# Copy bản build standalone (chỉ chứa file cần thiết để chạy)
# Lưu ý: Cần cấu hình output: 'standalone' trong next.config.mjs hoặc next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy thư mục uploads để lưu ảnh (nếu bạn dùng lưu ảnh local)
# Tạo thư mục và cấp quyền
RUN mkdir -p /app/public/uploads && chown nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

# Sửa lỗi warning LegacyKeyValueFormat
ENV PORT=3000
# Quan trọng: Cần set hostname là 0.0.0.0 để Docker map port ra ngoài được
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]