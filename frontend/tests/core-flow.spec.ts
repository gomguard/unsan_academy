import { test, expect } from '@playwright/test';

test.describe('Core User Flows', () => {
  /**
   * Test A: Landing Page to Salary Calculator
   * Verifies the main CTA flow from landing page
   */
  test.describe('Landing to Calculator', () => {
    test('should display hero section with correct messaging', async ({ page }) => {
      await page.goto('/');

      // Check if hero text is visible
      await expect(page.getByText('당신의 기술, 시장가는 얼마입니까?')).toBeVisible();
    });

    test('should navigate to dashboard when CTA is clicked', async ({ page }) => {
      await page.goto('/');

      // Find and click the main CTA button
      const ctaButton = page.getByRole('link', { name: /내 몸값.*진단/i });
      await expect(ctaButton).toBeVisible();
      await ctaButton.click();

      // Verify navigation to dashboard or salary check page
      await expect(page).toHaveURL(/\/(dashboard|salary-check)/);
    });
  });

  /**
   * Test B: Skill Tree Navigation
   * Verifies job node interaction and modal display
   */
  test.describe('Skill Tree Navigation', () => {
    test('should display skill tree page', async ({ page }) => {
      await page.goto('/skill-tree');

      // Check if skill tree is loaded
      await expect(page.locator('.react-flow')).toBeVisible({ timeout: 10000 });
    });

    test('should open job detail when node is clicked', async ({ page }) => {
      await page.goto('/skill-tree');

      // Wait for React Flow to load
      await page.waitForSelector('.react-flow', { timeout: 10000 });

      // Click on a job node (look for a clickable node element)
      const jobNode = page.locator('.react-flow__node').first();
      await jobNode.click();

      // Wait for modal or detail view to appear
      // Check for salary-related text in the modal
      await expect(page.getByText(/연봉|salary/i)).toBeVisible({ timeout: 5000 });
    });
  });

  /**
   * Test C: Community Posting Flow
   * Verifies the post creation flow
   */
  test.describe('Community Posting', () => {
    test('should display community page with posts', async ({ page }) => {
      await page.goto('/community');

      // Check if community header is visible
      await expect(page.getByText('커뮤니티')).toBeVisible();

      // Check if posts are loaded
      await expect(page.locator('[class*="PostCard"], [class*="post"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('should open write modal when FAB is clicked', async ({ page }) => {
      await page.goto('/community');

      // Find and click the FAB (floating action button)
      const fabButton = page.locator('button').filter({ has: page.locator('svg') }).last();
      await fabButton.click();

      // Check if write modal is visible
      await expect(page.getByText('새 글 작성')).toBeVisible({ timeout: 3000 });
    });

    test('should create a new post', async ({ page }) => {
      await page.goto('/community');

      // Click FAB to open write modal
      const fabButton = page.locator('button').filter({ has: page.locator('svg') }).last();
      await fabButton.click();

      // Wait for modal
      await expect(page.getByText('새 글 작성')).toBeVisible();

      // Fill in the form
      const testTitle = `테스트 게시글 ${Date.now()}`;
      await page.getByPlaceholder('제목을 입력하세요').fill(testTitle);
      await page.getByPlaceholder('내용을 입력하세요').fill('이것은 E2E 테스트로 작성된 게시글입니다.');

      // Submit the form
      await page.getByRole('button', { name: '게시하기' }).click();

      // Verify the new post appears in the feed
      await expect(page.getByText(testTitle)).toBeVisible({ timeout: 5000 });
    });
  });

  /**
   * Test D: Career Hub Navigation
   * Verifies job detail page functionality
   */
  test.describe('Career Hub', () => {
    test('should display job details correctly', async ({ page }) => {
      await page.goto('/career/maint_01');

      // Check if job title is visible
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Check if tabs are visible
      await expect(page.getByText('개요')).toBeVisible();
      await expect(page.getByText('교육')).toBeVisible();
      await expect(page.getByText('연봉')).toBeVisible();
      await expect(page.getByText('커뮤니티')).toBeVisible();
    });

    test('should switch tabs correctly', async ({ page }) => {
      await page.goto('/career/maint_01');

      // Click on salary tab
      await page.getByText('연봉').click();

      // Verify salary content is visible
      await expect(page.getByText(/연봉 범위|시뮬레이터/i)).toBeVisible({ timeout: 3000 });
    });
  });

  /**
   * Test E: Navigation Flow
   * Verifies bottom navigation works correctly
   */
  test.describe('Navigation', () => {
    test('should navigate via bottom nav', async ({ page }) => {
      await page.goto('/dashboard');

      // Check bottom nav is visible
      const bottomNav = page.locator('nav').last();
      await expect(bottomNav).toBeVisible();

      // Navigate to different pages via bottom nav
      await page.getByRole('link', { name: /직업|Jobs/i }).click();
      await expect(page).toHaveURL(/\/jobs/);
    });
  });
});
