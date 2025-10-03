# ========== Base Stage ==========
FROM node:20-alpine AS base

WORKDIR /neuroloom-app

COPY package*.json ./

# ========== Dev Stage ==========
FROM base AS dev

ENV NODE_ENV=development

# Install all dependencies (including dev for dev build)
RUN npm install

# Copy source
COPY . .

# Expose hot-reload port
EXPOSE 3000

CMD ["npm", "run", "dev"]

# ========== Build Stage (for production) ==========
FROM base AS build

ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only-production -ignore-scripts

# Build step 
RUN npm run build

# ========== Production Stage ==========
FROM node:20-alpine AS prod

# Set Working directory
WORKDIR /neuroloom-app

# Copy only necessary files from build
COPY --from=build /neuroloom-app/node_modules ./node_modules
COPY --from=build /neuroloom-app/package*.json ./
COPY --from=build /neuroloom-app/.next ./.next 
COPY --from=build /neuroloom-app/public ./public 

# Set Node environment
ENV NODE_ENV=production

# Expose Port
EXPOSE 3000

CMD ["npm", "start"]