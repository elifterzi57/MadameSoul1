import { test, expect } from '@playwright/test';

test.describe('MadameSoul Admin Panel E2E Check', () => {
  const randomEmail = `admin_test_e2e_${Date.now()}_${Math.floor(Math.random() * 1000)}@madamesoul.com`;
  const testPassword = 'Password123!';

  test('should sign up on main app, log in to admin panel, and run Gemini health check', async ({ page }) => {
    // Capture browser console logs
    page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });

    // 1. Sign Up on Main App
    await page.goto('/');
    
    // Complete onboarding
    await expect(page.locator('text=Welcome to MadameSoul').or(page.locator('text=MadameSoul\'a Hoş Geldin'))).toBeVisible();
    const nextBtn = page.getByRole('button', { name: /NEXT|İLERİ/i });
    await nextBtn.click();
    await nextBtn.click();
    const startBtn = page.getByRole('button', { name: /START|BAŞLA/i });
    await startBtn.click();

    // Toggle to Sign Up mode
    const toggleSignUpBtn = page.getByRole('button', { name: /Don't have an account|Hesabınız yok mu/i });
    await toggleSignUpBtn.click();

    // Fill credentials
    await page.locator('input[type="email"]').fill(randomEmail);
    await page.locator('input[type="password"]').fill(testPassword);
    const registerBtn = page.getByRole('button', { name: /Sign Up|Kaydol/i }).first();
    await registerBtn.click();

    // Accept post-login terms modal
    const acceptTermsBtn = page.getByRole('button', { name: /Onayla ve Devam Et|Accept & Continue/i });
    await expect(acceptTermsBtn).toBeVisible({ timeout: 10000 });
    await acceptTermsBtn.click();

    // Verify main page loaded
    const startReadingBtn = page.getByRole('button', { name: /Start Your Reading|Falına Başla/i });
    await expect(startReadingBtn).toBeVisible({ timeout: 15000 });

    // 2. Log In to Admin Panel (http://localhost:3001)
    await page.goto('http://localhost:3001/');
    await expect(page.locator('text=MadameSoul')).toBeVisible({ timeout: 10000 });

    // Fill credentials in Admin Panel
    await page.locator('input[type="email"]').fill(randomEmail);
    await page.locator('input[type="password"]').fill(testPassword);
    
    // Click submit button in Admin login form
    const loginBtn = page.getByRole('button', { name: /^Giriş Yap$|^GİRİŞ YAP$|^Log In$/i }).first();
    await loginBtn.click();

    // Verify Admin Panel loaded (should show welcome header or accordion list)
    const usersAccordionBtn = page.getByRole('button', { name: /Kullanıcı ve Bakiye/i }).first();
    await expect(usersAccordionBtn).toBeVisible({ timeout: 15000 });

    // 3. Expand "Sistem Parametreleri" Accordion Section
    const systemAccordionBtn = page.getByRole('button', { name: /Sistem Ayarları/i }).first();
    await expect(systemAccordionBtn).toBeVisible();
    await systemAccordionBtn.click();

    // 4. Trigger Gemini Connection Test
    const testConnectionBtn = page.getByRole('button', { name: /BAĞLANTIYI TEST ET|TEST CONNECTION/i });
    await expect(testConnectionBtn).toBeVisible();
    await testConnectionBtn.click();

    // 5. Verify Health Check Results Displayed
    const resultBox = page.locator('text=BAĞLANTI BAŞARILI').or(page.locator('text=BAĞLANTI HATASI'));
    await expect(resultBox).toBeVisible({ timeout: 15000 });
  });
});
