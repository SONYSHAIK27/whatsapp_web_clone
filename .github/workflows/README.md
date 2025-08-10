# GitHub Actions Setup

This directory contains GitHub Actions workflows for automatic deployment and testing.

## Workflows

### 1. `deploy.yml` - Automatic Vercel Deployment
Automatically deploys to Vercel when you push to master/main branch.

### 2. `test.yml` - Build and Test
Runs tests and builds the application to ensure code quality.

## Required Secrets

To use the automatic deployment, you need to add these secrets to your GitHub repository:

### How to Add Secrets:
1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret below:

### Required Secrets:

#### `VERCEL_TOKEN`
- Get from: [Vercel Account Settings](https://vercel.com/account/tokens)
- Click "Create Token"
- Give it a name like "GitHub Actions"
- Copy the token

#### `ORG_ID`
- Get from: [Vercel Dashboard](https://vercel.com/dashboard)
- Go to Settings → General
- Copy "Team ID" (this is your Org ID)

#### `PROJECT_ID`
- Get from: [Vercel Dashboard](https://vercel.com/dashboard)
- Go to your project settings
- Copy "Project ID"

#### `MONGODB_URI`
- Your MongoDB Atlas connection string
- Example: `mongodb+srv://username:password@cluster.mongodb.net/whatsapp`

#### `REACT_APP_SERVER_URL`
- Your Vercel app URL
- Example: `https://your-app.vercel.app`

## How It Works

1. **Push code** to master/main branch
2. **GitHub Actions** automatically triggers
3. **Installs dependencies** and builds the app
4. **Runs tests** to ensure quality
5. **Deploys to Vercel** automatically
6. **Sets environment variables** from secrets

## Benefits

- ✅ **Automatic deployment** on every push
- ✅ **No manual work** required
- ✅ **Consistent deployments**
- ✅ **Environment variables** managed securely
- ✅ **Build testing** before deployment
