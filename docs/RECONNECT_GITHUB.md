# Langkah-langkah Reconnect ke GitHub Repository Baru

## Step 1: Hapus remote lama
git remote remove origin

## Step 2: Tambahkan remote baru (ganti URL dengan repository baru Anda)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

## Step 3: Verify remote
git remote -v

## Step 4: Push ke repository baru
git push -u origin main

# Jika branch Anda bernama 'master', gunakan:
# git push -u origin master

# Jika ada error authentication, gunakan Personal Access Token:
# 1. Buka GitHub → Settings → Developer settings → Personal access tokens
# 2. Generate new token (classic)
# 3. Pilih scope: repo (full control)
# 4. Copy token
# 5. Saat git push, gunakan token sebagai password

## Alternative: Push dengan force (jika ada conflict)
# git push -u origin main --force
