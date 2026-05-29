import { test, expect } from '@playwright/test';

test.describe('MadameSoul E2E Onboarding & Login Flow', () => {
  test('should load app, step through onboarding slides, and show login screen', async ({ page }) => {
    // Go to the app homepage
    await page.goto('/');

    // Wait for the onboarding screen to appear (it should contain "Welcome to MadameSoul" or translated variant)
    await expect(page.locator('text=Welcome to MadameSoul').or(page.locator('text=MadameSoul\'a Hoş Geldin'))).toBeVisible();

    // Verify first slide tag
    await expect(page.getByText('Welcome', { exact: true })).toBeVisible();

    // Click Next button
    const nextBtn = page.getByRole('button', { name: /NEXT|İLERİ/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Verify second slide tag
    await expect(page.getByText('Discovery', { exact: true })).toBeVisible();
    await nextBtn.click();

    // Verify third slide tag
    await expect(page.getByText('Journey', { exact: true })).toBeVisible();

    // Click Start button on the last slide
    const startBtn = page.getByRole('button', { name: /START|BAŞLA/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // After completing onboarding, the login container should be visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should allow skipping onboarding directly to login', async ({ page }) => {
    await page.goto('/');

    // Click skip button
    const skipBtn = page.getByRole('button', { name: /SKIP|GEÇ|ATLA/i });
    await expect(skipBtn).toBeVisible();
    await skipBtn.click();

    // Login inputs should be visible immediately
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
