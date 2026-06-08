import { test, expect } from '@playwright/test';

test.describe('MadameSoul E2E Onboarding, Login, Card Draw and Diary Flow', () => {
  const randomEmail = `test_e2e_${Date.now()}_${Math.floor(Math.random() * 1000)}@madamesoul.com`;
  const testPassword = 'Password123!';

  test('should complete the entire user journey: onboarding, signup, drawing cards, interpreting, and diary editing', async ({ page }) => {
    // Increase test timeout due to Gemini generation API simulation
    test.setTimeout(60000);

    // Go to the app homepage
    await page.goto('/');

    // 1. Onboarding Flow
    // Wait for onboarding screen
    await expect(page.locator('text=Welcome to MadameSoul').or(page.locator('text=MadameSoul\'a Hoş Geldin'))).toBeVisible();

    // Verify first slide tag
    await expect(page.getByText('Welcome', { exact: true })).toBeVisible();

    // Click Next button to slide 2
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

    // 2. Authentication (Sign Up)
    // After completing onboarding, the login container should be visible
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Toggle to Sign Up mode
    const toggleSignUpBtn = page.getByRole('button', { name: /Don't have an account|Hesabınız yok mu/i });
    await toggleSignUpBtn.click();

    // Fill credentials
    await page.locator('input[type="email"]').fill(randomEmail);
    await page.locator('input[type="password"]').fill(testPassword);

    // Accept KVKK Consent
    await page.locator('input[type="checkbox"]').check();

    // Click Register
    const registerBtn = page.getByRole('button', { name: /Sign Up|Kaydol/i }).first();
    await registerBtn.click();

    // Wait for Splash screen after successful login
    // The main Start button for readings should appear
    const startReadingBtn = page.getByRole('button', { name: /Start Your Reading|Falına Başla/i });
    await expect(startReadingBtn).toBeVisible({ timeout: 15000 });
    await startReadingBtn.click();

    // 3. User Info Form Filling
    await page.locator('input[type="text"]').first().fill('E2E Tester');
    await page.locator('input[type="date"]').fill('1990-01-01');
    await page.locator('input[type="text"]').nth(1).fill('Istanbul');
    
    // Click submit/next on form
    const formSubmitBtn = page.getByRole('button', { name: /Select Cards|Kartları Seç/i });
    await formSubmitBtn.click();

    // 4. Interactive Card Selection Grid (Drawing Step)
    // Selection page should be visible
    await expect(page.getByText(/Kaderinizin Kartlarını Seçin|Select the Cards of Your Destiny/i)).toBeVisible();

    // The deck of 35 cards is rendered as clickable divs. Let's click 3 unselected cards.
    const cards = page.locator('div.grid.grid-cols-5 > div, div.grid.grid-cols-7 > div, div.grid.grid-cols-9 > div, div.grid.grid-cols-10 > div');
    await expect(cards.first()).toBeVisible();

    // Click first card
    await cards.nth(0).click();
    await page.waitForTimeout(200);

    // Click second card
    await cards.nth(1).click();
    await page.waitForTimeout(200);

    // Click third card
    await cards.nth(2).click();
    await page.waitForTimeout(200);

    // Verify 3 cards are selected
    await expect(page.getByText(/Seçilen: 3 \/ 3|Selected: 3 \/ 3/i)).toBeVisible();

    // Interpret Spread button should appear
    const interpretBtn = page.getByRole('button', { name: /Açılımı Yorumla|Interpret Spread/i });
    await expect(interpretBtn).toBeVisible();
    
    // Click using force: true to bypass stability checks due to animate-bounce class
    await interpretBtn.click({ force: true });

    // 5. Result Interpretation
    // Wait for interpretation result text (markdown-body) to be generated and shown
    await expect(page.locator('div.markdown-body')).toBeVisible({ timeout: 30000 });

    // 6. Profile & Personalization Diary
    // Open profile modal
    const profileBtn = page.locator('div[title="Profile"]');
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    // In profile modal, under past readings, there should be 1 reading listed
    await expect(page.getByText(/Past Readings|Geçmiş Kehanetler/i)).toBeVisible();
    
    // Locate the past reading row and click it to expand accordion details
    const readingRow = page.locator('text=Reading with cards');
    await expect(readingRow.first()).toBeVisible();
    await readingRow.first().click();

    // Toggle favorite star
    const starBtn = page.locator('button > svg.lucide-star').first();
    await expect(starBtn).toBeVisible();
    await starBtn.click();

    // Edit custom title
    const customTitleInput = page.locator('input[placeholder*="Reading with cards"i]');
    await expect(customTitleInput).toBeVisible();
    await customTitleInput.fill('My Special E2E Reading');

    // Add reflection notes
    const reflectionNotesTextarea = page.locator('textarea[placeholder*="write"i]').or(page.locator('textarea[placeholder*="yazabilirsiniz"i]'));
    await expect(reflectionNotesTextarea).toBeVisible();
    await reflectionNotesTextarea.fill('This reading resonates strongly with my career plans.');

    // Click Save Notes
    const saveNotesBtn = page.getByRole('button', { name: /Save Notes|Notu Kaydet/i });
    await expect(saveNotesBtn).toBeVisible();
    await saveNotesBtn.click();

    // Wait for success toast / status update
    await expect(page.locator('div').filter({ hasText: /updated successfully|başarıyla güncellendi/i }).first()).toBeVisible();

    // Verify list displays new custom title
    await expect(page.getByText('My Special E2E Reading')).toBeVisible();

    // Close Profile modal
    const closeProfileBtn = page.locator('button > svg.lucide-x').first();
    await closeProfileBtn.click();
  });
});
