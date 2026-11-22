import { test, expect, type Page } from '@playwright/test';
import {  fileURLToPath  } from 'node:url';
import path from 'node:path';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiHar = path.join(__dirname, 'hars', 'backend.har');

const constructorName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';
const orderNumber = 12345;
const constructorId = '643d69a5c3f7b9001cfa0941';
const filingId ='643d69a5c3f7b9001cfa0945';


const addIngredients = async (page: Page, name: string): Promise<void> => { 
    const ingredientCard = page.getByRole('listitem').filter({hasText: name});
    await ingredientCard.getByRole('button', {name: 'Добавить'}).click();
}

const openConstructor = async (page: Page): Promise<void> => { 
    await page.routeFromHAR(apiHar, { 
        url: '**/api/**', 
    })

    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Соберите бургер'})).toBeVisible();
    await expect(page.getByText(constructorName)).toBeVisible();
}

    const authorizeUser = async (page: Page): Promise<void> => { 
        await page.context().addCookies([
             {
                name: 'accessToken',
                 value: 'Bearer test-access-token',
                domain: 'localhost',
                 path: '/',
                 httpOnly: false,
                secure: false,
                sameSite: 'Lax',
    },
        ]);

        await page.addInitScript(() => { 
            window.localStorage.setItem('refreshToken', 'test-refresh-token');
        });
    }

test.describe('add ingredients to constructor works correctly', function () {
    test.beforeEach(async ({page}) => { 
        await openConstructor(page);
    });

    test('добавление булок в конструктор', async ({ page }) => { 
        await addIngredients(page, constructorName)

        const constructor = page.locator('section').filter({ 
            has: page.getByRole('button', {name: 'Оформить заказ' })
        })

        await expect(constructor.getByText(`${constructorName} (верх)`)).toBeVisible();
        await expect(constructor.getByText(`${constructorName} (низ)`)).toBeVisible();
    });

    test('добавление булки и начинки одновременно', async ({page}) => { 
        await addIngredients(page, constructorName);
        await addIngredients(page, fillingName);

          const constructor = page.locator('section').filter({ 
            has: page.getByRole('button', {name: 'Оформить заказ' })
        })

       await expect(constructor.getByText(`${constructorName} (верх)`)).toBeVisible();
        await expect(constructor.getByText(`${constructorName} (низ)`)).toBeVisible();
        await expect(constructor.getByText(fillingName)).toBeVisible();
    });

    test('закрытия модального окна по крестику', async ({page}) => { 
        await openConstructor(page);

        await page.getByRole('link').filter({hasText:constructorName }).click();
        const ingredientsModal = page.getByRole('dialog');
        await expect(ingredientsModal).toBeVisible();

        await ingredientsModal.getByRole('button', {name: 'Закрыть'}).click();

        await expect(ingredientsModal).toBeHidden();
        await expect(page).toHaveURL('/');
    });

    test('закрытия модального окна по оверлею', async ({page}) => { 
        await openConstructor(page);

        await page.getByRole('link').filter({hasText:constructorName }).click();
        const ingredientsModal = page.getByRole('dialog');
        await expect(ingredientsModal).toBeVisible();

        await ingredientsModal.getByRole('button', {name: 'Закрыть'}).click();
        await page.getByTestId('modal-overlay').click({
            position: {x: 5, y: 5}
        })
        await expect(ingredientsModal).toBeHidden();
        await expect(page).toHaveURL('/');
    });

    test('открытия модального окна ингредиента', async ({page}) => { 
        await openConstructor(page);

        const ingredientsModal = page.getByRole('dialog');
         await expect(ingredientsModal).toBeVisible();
         await expect(ingredientsModal.getByRole('heading',  {name: 'Детали ингредиента'})).toBeVisible();
         await expect(ingredientsModal.getByText('Калории, ккал')).toBeVisible();
    });

    test('создания заказа, очистка конструктора, закрытия окно заказа', async ({page})  => { 
            await authorizeUser(page);

            let requestBody: {ingredients: string[]} | undefined;
            let authorizationHeader: string | undefined;

            page.on('request', (request) => { 
                if (request.url().endsWith('/api/orders') && request.method() === 'POST') { 
                    requestBody = request.postDataJSON() as {   ingredients: string[]  };
                    authorizationHeader = request.headers().authorization; 
                }
            });

            await openConstructor(page);
            await expect(page.getByText('Test User')).toBeVisible();

            await addIngredients(page, constructorName);
            await addIngredients(page, fillingName);
            await page.getByRole('button', {name: 'Оформить заказ'}).click();

            const orderModal = page.getByRole('dialog');

            await expect(orderModal).toBeVisible();
            await expect(orderModal.getByText(String(orderNumber))).toBeVisible();
            await expect(orderModal.getByText('идентификатор заказа')).toBeVisible();
            await expect(orderModal.getByText('ваш заказ начали готовить')).toBeVisible();

            expect(requestBody?.ingredients).toEqual([constructorId, filingId, constructorId]);
            expect(authorizationHeader).toBe('Bearer test-access-token');

            const constructor = page.locator('section').filter({
                has: page.getByRole('button', {name: 'оформить заказ'}),
            })
            await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
            await expect(constructor.getByText('Выберите начинку')).toBeVisible();

            await orderModal.getByRole('button', {name: 'Закрыть'}).click();

            await expect(orderModal).toBeHidden();
    });
});
