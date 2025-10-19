import { test, expect } from '@playwright/test';

test.describe('Plants Management E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/graphql', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      if (postData.query.includes('userPlants')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              userPlants: {
                plants: [
                  {
                    id: '1',
                    name: 'Test Plant',
                    species: 'Test Species',
                    user_id: 'user-1',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                  }
                ],
                total: 1,
                page: 1,
                limit: 10
              }
            }
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: {} })
        });
      }
    });
  });

  test('should display plants dashboard', async ({ page }) => {
    await page.goto('/monitoring');
    
    // Wait for the page to load
    await expect(page.getByText('Plantas Monitoreadas')).toBeVisible();
    
    // Check if plants are displayed
    await expect(page.getByText('Test Plant')).toBeVisible();
    await expect(page.getByText('Test Species')).toBeVisible();
    
    // Check total count
    await expect(page.getByText('1')).toBeVisible();
  });

  test('should search plants', async ({ page }) => {
    await page.goto('/monitoring');
    
    // Wait for plants to load
    await expect(page.getByText('Test Plant')).toBeVisible();
    
    // Search for a plant
    const searchInput = page.getByPlaceholderText('🔍 Buscar plantas...');
    await searchInput.fill('Test');
    
    // Verify search results
    await expect(page.getByText('Test Plant')).toBeVisible();
  });

  test('should navigate to new plant page', async ({ page }) => {
    await page.goto('/monitoring');
    
    // Click on "Nueva Planta" button
    const newPlantButton = page.getByText('Nueva Planta');
    await expect(newPlantButton).toBeVisible();
    
    await newPlantButton.click();
    
    // Verify navigation
    await expect(page).toHaveURL('/monitoring/new');
  });

  test('should navigate to plant detail page', async ({ page }) => {
    await page.goto('/monitoring');
    
    // Wait for plants to load
    await expect(page.getByText('Test Plant')).toBeVisible();
    
    // Click on a plant card
    const plantCard = page.getByText('Test Plant').closest('div');
    await plantCard?.click();
    
    // Verify navigation to plant detail
    await expect(page).toHaveURL('/monitoring/1');
  });

  test('should handle loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/graphql', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            userPlants: {
              plants: [],
              total: 0,
              page: 1,
              limit: 10
            }
          }
        })
      });
    });

    await page.goto('/monitoring');
    
    // Check loading state
    await expect(page.getByText('Cargando plantas...')).toBeVisible();
  });

  test('should handle error state', async ({ page }) => {
    // Mock API error
    await page.route('**/api/graphql', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error'
        })
      });
    });

    await page.goto('/monitoring');
    
    // Check error state
    await expect(page.getByText('Error al cargar las plantas')).toBeVisible();
  });
});
