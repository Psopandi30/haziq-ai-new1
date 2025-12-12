# Build Android APK - Setup Guide

## Prerequisites
1. Node.js & npm installed
2. Android Studio installed
3. Java JDK installed

## Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

## Step 2: Initialize Capacitor
```bash
npx cap init
# App name: Haziq AI
# Package ID: com.iai.haziqai (atau sesuai keinginan)
```

## Step 3: Build Web Assets
```bash
npm run build
```

## Step 4: Add Android Platform
```bash
npx cap add android
```

## Step 5: Sync Assets to Android
```bash
npx cap sync android
```

## Step 6: Open in Android Studio
```bash
npx cap open android
```

## Step 7: Build APK in Android Studio
1. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
2. Wait for build to complete
3. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Important Configuration Files

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iai.haziqai',
  appName: 'Haziq AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### android/app/src/main/AndroidManifest.xml
Add permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Troubleshooting

### Issue: White screen on Android
**Solution:** Check `capacitor.config.ts` webDir matches your build output

### Issue: API calls fail
**Solution:** Add CORS headers in Supabase or use proxy

### Issue: Build fails
**Solution:** 
1. Check Java version: `java -version` (need JDK 11 or 17)
2. Update Gradle in Android Studio
3. Clean build: `cd android && ./gradlew clean`

## Production Build (Release APK)

1. Generate signing key:
```bash
keytool -genkey -v -keystore haziq-ai-release.keystore -alias haziq-ai -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../haziq-ai-release.keystore')
            storePassword 'your-password'
            keyAlias 'haziq-ai'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

4. APK location: `android/app/build/outputs/apk/release/app-release.apk`
