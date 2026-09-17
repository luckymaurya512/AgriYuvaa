@echo off
echo ==============================================
echo Copying AI Generated Assets to AgriYuvaa...
echo ==============================================

copy /Y "C:\Users\lucky\.gemini\antigravity-ide\brain\c1c6370d-a724-42da-8633-c200f0354c38\hero_background_1789645938143.jpg" "landing\public\hero-bg.jpg"
copy /Y "C:\Users\lucky\.gemini\antigravity-ide\brain\c1c6370d-a724-42da-8633-c200f0354c38\agriyuvaa_og_banner_1789644420325.jpg" "landing\public\og-banner.png"
copy /Y "C:\Users\lucky\.gemini\antigravity-ide\brain\c1c6370d-a724-42da-8633-c200f0354c38\agriyuvaa_og_banner_1789644420325.jpg" "frontend\public\og-banner.png"

echo.
echo [SUCCESS] Assets successfully copied to public folders!
echo ==============================================
