import {
  createRoot,
  testRootId,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test } from 'vitest';

import { cn } from '../../../utils/bem';
import { Toolbar } from '../Toolbar';

createRoot();
clearStack();

const cnToolbar = cn('Toolbar');

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnToolbar();

type AttachmentProps = React.ComponentProps<typeof Toolbar>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <Toolbar data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLDivElement;

/**
 * Проверяет, что в className элемента присутствуют все классы из переданной строки.
 * cn с модификаторами возвращает несколько классов через пробел,
 * поэтому нельзя использовать classList.contains напрямую.
 */
const hasClassName = (el: Element | null, className: string) =>
  !!el && className.split(' ').every((token) => el.classList.contains(token));

/**
 * Элемент слота рендерится внутри обёртки Slot, поэтому для поиска
 * flex-обёртки стороны нужно подняться на два уровня вверх.
 */
const getLeftWrapper = () =>
  getRender().querySelector('[data-left-item]')?.parentElement
    ?.parentElement as HTMLDivElement | null;

const getRightWrapper = () =>
  getRender().querySelector('[data-right-item]')?.parentElement
    ?.parentElement as HTMLDivElement | null;

describe('Компонент Toolbar', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок, когда слоты не заданы', () =>
      context.start(async () => {
        expect(() => renderComponent({})).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.tagName).toBe('DIV');
        expect(hasClassName(render, cnToolbar())).toBe(true);
      }));

    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({ leftSide: 'Текст' })).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(hasClassName(render, cnToolbar())).toBe(true);
        expect(render.tagName).toBe('DIV');
      }));

    test('по умолчанию применяет MixFlex с justify=space-between и gap=m', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст' });

        expect(
          hasClassName(
            getRender(),
            cnMixFlex({ justify: 'space-between', gap: 'm' }),
          ),
        ).toBe(true);
      }));

    test('применяет justify=flex-end, когда задан только rightSide', () =>
      context.start(async () => {
        renderComponent({ rightSide: 'Текст' });

        expect(
          hasClassName(
            getRender(),
            cnMixFlex({ justify: 'flex-end', gap: 'm' }),
          ),
        ).toBe(true);
      }));

    test('по умолчанию применяет MixSpace с отступами pH=s и pV=xs', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст' });

        expect(
          hasClassName(getRender(), cnMixSpace({ pH: 's', pV: 'xs' })),
        ).toBe(true);
      }));

    test('должен применять кастомный space', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', space: { pH: 'm', pV: 'l' } });

        expect(
          hasClassName(getRender(), cnMixSpace({ pH: 'm', pV: 'l' })),
        ).toBe(true);
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'leftSide': 'Текст', 'aria-label': 'toolbar' });

        expect(getRender().getAttribute('aria-label')).toBe('toolbar');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ leftSide: 'Текст', ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('свойство form', () => {
    test('по умолчанию используется форма default', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст' });

        expect(hasClassName(getRender(), cnToolbar({ form: 'default' }))).toBe(
          true,
        );
      }));

    test('применяет модификатор формы brick', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', form: 'brick' });

        const render = getRender();

        expect(hasClassName(render, cnToolbar({ form: 'brick' }))).toBe(true);
        expect(hasClassName(render, cnToolbar({ form: 'default' }))).toBe(
          false,
        );
      }));

    test('применяет модификатор формы defaultBrick', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', form: 'defaultBrick' });

        expect(
          hasClassName(getRender(), cnToolbar({ form: 'defaultBrick' })),
        ).toBe(true);
      }));

    test('применяет модификатор формы brickDefault', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', form: 'brickDefault' });

        expect(
          hasClassName(getRender(), cnToolbar({ form: 'brickDefault' })),
        ).toBe(true);
      }));
  });

  describe('свойство leftSide', () => {
    test('рендерит одиночный узел внутри Slot', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст' });

        const slot = getRender().querySelector(`.${cnToolbar('Slot')}`);

        expect(slot).toBeTruthy();
        expect(slot?.textContent).toBe('Текст');
      }));

    test('рендерит массив узлов в отдельных Slot', () =>
      context.start(async () => {
        renderComponent({
          leftSide: [
            <span key="1" data-left-one />,
            <span key="2" data-left-two />,
          ],
        });

        expect(
          getRender().querySelectorAll(`.${cnToolbar('Slot')}`).length,
        ).toBe(2);
        expect(getRender().querySelector('[data-left-one]')).toBeTruthy();
        expect(getRender().querySelector('[data-left-two]')).toBeTruthy();
      }));

    test('фильтрует null и undefined в массиве leftSide', () =>
      context.start(async () => {
        renderComponent({
          leftSide: [
            <span key="1" data-left-one />,
            <span key="2" data-left-two />,
            null,
            undefined,
          ],
        });

        expect(
          getRender().querySelectorAll(`.${cnToolbar('Slot')}`).length,
        ).toBe(2);
      }));

    test('не рендерит левую сторону, если leftSide не задан', () =>
      context.start(async () => {
        renderComponent({ rightSide: <span data-right-item>Право</span> });

        expect(getRender().querySelector('[data-left-item]')).toBeNull();
        expect(
          getRender().querySelectorAll(`.${cnToolbar('Slot')}`).length,
        ).toBe(1);
      }));
  });

  describe('свойство rightSide', () => {
    test('рендерит одиночный узел внутри Slot', () =>
      context.start(async () => {
        renderComponent({ rightSide: 'Текст' });

        const slot = getRender().querySelector(`.${cnToolbar('Slot')}`);

        expect(slot).toBeTruthy();
        expect(slot?.textContent).toBe('Текст');
      }));

    test('рендерит массив узлов в отдельных Slot', () =>
      context.start(async () => {
        renderComponent({
          rightSide: [
            <span key="1" data-right-one />,
            <span key="2" data-right-two />,
          ],
        });

        expect(
          getRender().querySelectorAll(`.${cnToolbar('Slot')}`).length,
        ).toBe(2);
        expect(getRender().querySelector('[data-right-one]')).toBeTruthy();
        expect(getRender().querySelector('[data-right-two]')).toBeTruthy();
      }));

    test('не рендерит правую сторону, если rightSide не задан', () =>
      context.start(async () => {
        renderComponent({ leftSide: <span data-left-item>Лево</span> });

        expect(getRender().querySelector('[data-right-item]')).toBeNull();
        expect(
          getRender().querySelectorAll(`.${cnToolbar('Slot')}`).length,
        ).toBe(1);
      }));
  });

  describe('свойство itemsGap', () => {
    test('по умолчанию применяет gap=s к левой и правой обёрткам', () =>
      context.start(async () => {
        renderComponent({
          leftSide: <span data-left-item>Лево</span>,
          rightSide: <span data-right-item>Право</span>,
        });

        expect(hasClassName(getLeftWrapper(), cnMixFlex({ gap: 's' }))).toBe(
          true,
        );
        expect(
          hasClassName(
            getRightWrapper(),
            cnMixFlex({ gap: 's', justify: 'flex-end' }),
          ),
        ).toBe(true);
      }));

    test('применяет одиночное значение gap к обеим сторонам', () =>
      context.start(async () => {
        renderComponent({
          leftSide: <span data-left-item>Лево</span>,
          rightSide: <span data-right-item>Право</span>,
          itemsGap: 'm',
        });

        expect(hasClassName(getLeftWrapper(), cnMixFlex({ gap: 'm' }))).toBe(
          true,
        );
        expect(
          hasClassName(
            getRightWrapper(),
            cnMixFlex({ gap: 'm', justify: 'flex-end' }),
          ),
        ).toBe(true);
      }));

    test('применяет массив значений gap по индексу стороны', () =>
      context.start(async () => {
        renderComponent({
          leftSide: <span data-left-item>Лево</span>,
          rightSide: <span data-right-item>Право</span>,
          itemsGap: ['s', 'l'],
        });

        expect(hasClassName(getLeftWrapper(), cnMixFlex({ gap: 's' }))).toBe(
          true,
        );
        expect(
          hasClassName(
            getRightWrapper(),
            cnMixFlex({ gap: 'l', justify: 'flex-end' }),
          ),
        ).toBe(true);
      }));
  });

  describe('свойство border', () => {
    test('при border=all добавляет модификатор border_all', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', border: 'all' });

        expect(hasClassName(getRender(), cnToolbar({ border: 'all' }))).toBe(
          true,
        );
      }));

    test('при border=true добавляет модификатор border_all', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', border: true });

        expect(hasClassName(getRender(), cnToolbar({ border: 'all' }))).toBe(
          true,
        );
      }));

    test('при border=top и form=default не добавляет модификатор border', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', border: 'top' });

        const render = getRender();

        expect(render.classList.contains('ct--Toolbar_border_top')).toBe(false);
        expect(hasClassName(render, cnToolbar({ form: 'default' }))).toBe(true);
      }));

    test('при border=bottom и form=default не добавляет модификатор border', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', border: 'bottom' });

        const render = getRender();

        expect(render.classList.contains('ct--Toolbar_border_bottom')).toBe(
          false,
        );
      }));

    test('при border=top и form=defaultBrick не добавляет модификатор border', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Текст',
          border: 'top',
          form: 'defaultBrick',
        });

        const render = getRender();

        expect(render.classList.contains('ct--Toolbar_border_top')).toBe(false);
        expect(hasClassName(render, cnToolbar({ form: 'defaultBrick' }))).toBe(
          true,
        );
      }));

    test('при border=bottom и form=brickDefault не добавляет модификатор border', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Текст',
          border: 'bottom',
          form: 'brickDefault',
        });

        const render = getRender();

        expect(render.classList.contains('ct--Toolbar_border_bottom')).toBe(
          false,
        );
        expect(hasClassName(render, cnToolbar({ form: 'brickDefault' }))).toBe(
          true,
        );
      }));

    test('при border=top и form=brick добавляет модификатор border_top', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', border: 'top', form: 'brick' });

        expect(hasClassName(getRender(), cnToolbar({ border: 'top' }))).toBe(
          true,
        );
      }));

    test('при border=bottom и form=brick добавляет модификатор border_bottom', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Текст', border: 'bottom', form: 'brick' });

        expect(hasClassName(getRender(), cnToolbar({ border: 'bottom' }))).toBe(
          true,
        );
      }));
  });
});
