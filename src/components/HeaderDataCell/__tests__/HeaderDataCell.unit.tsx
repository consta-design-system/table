import {
  createRoot,
  testRootId,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { cnText } from '@consta/uikit/Text';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test, vi } from 'vitest';

import { cnHeaderDataCell, HeaderDataCell } from '../HeaderDataCell';

createRoot();
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnHeaderDataCell();

type AttachmentProps = React.ComponentProps<typeof HeaderDataCell>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <HeaderDataCell data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLElement;

/**
 * Проверяет, что в className элемента присутствуют все классы из переданной строки.
 * cnHeaderDataCell с модификаторами возвращает несколько классов через пробел,
 * поэтому нельзя использовать classList.contains напрямую.
 */
const hasClassName = (el: Element | null, className: string) =>
  !!el && className.split(' ').every((token) => el.classList.contains(token));

const getContentSlots = () =>
  getRender().querySelectorAll(`.${cnHeaderDataCell('ContentSlot')}`);

const getControlSlots = () =>
  getRender().querySelectorAll(`.${cnHeaderDataCell('ControlSlot')}`);

describe('Компонент HeaderDataCell', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({ children: 'Текст' })).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(hasClassName(render, cnHeaderDataCell())).toBe(true);
        expect(render.tagName).toBe('DIV');
      }));

    test('должен центрировать содержимое через MixFlex и задавать отступ MixSpace', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const render = getRender();

        expect(
          hasClassName(
            render,
            cnMixFlex({ flex: 'flex', gap: 'xs', justify: 'space-between' }),
          ),
        ).toBe(true);
        expect(hasClassName(render, cnMixSpace({ pH: 's' }))).toBe(true);
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'children': 'Текст', 'aria-label': 'cell' });

        expect(getRender().getAttribute('aria-label')).toBe('cell');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ children: 'Текст', ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('свойство children', () => {
    test('должен рендерить строку как текст внутри контентного слота', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const contentSlots = getContentSlots();

        expect(contentSlots.length).toBe(1);
        expect(contentSlots[0].textContent).toContain('Текст');
      }));

    test('должен рендерить число как текст', () =>
      context.start(async () => {
        renderComponent({ children: 100 });

        expect(getRender().textContent).toContain('100');
      }));

    test('должен оборачивать строку/число в Text с размером по умолчанию m', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const textEl = getContentSlots()[0]?.querySelector(`.${cnText()}`);

        expect(textEl).toBeTruthy();
        expect(hasClassName(textEl, cnText({ size: 'm' }))).toBe(true);
        expect(hasClassName(textEl, cnMixSpace({ pV: 's' }))).toBe(true);
      }));

    test('должен учитывать size при оборачивании текста в Text', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', size: 's' });

        const textEl = getContentSlots()[0]?.querySelector(`.${cnText()}`);

        expect(hasClassName(textEl, cnText({ size: 's' }))).toBe(true);
        expect(hasClassName(textEl, cnMixSpace({ pV: 'xs' }))).toBe(true);
      }));

    test('не должен оборачивать произвольный React-узел в Text', () =>
      context.start(async () => {
        renderComponent({ children: <span data-child>Ребенок</span> });

        const render = getRender();

        expect(render.querySelector('[data-child]')).toBeTruthy();
        expect(render.querySelector(`.${cnText()}`)).toBeNull();
      }));

    test('должен рендерить массив детей отдельными контентными слотами', () =>
      context.start(async () => {
        renderComponent({ children: ['Первая', 'Вторая'] });

        expect(getContentSlots().length).toBe(2);
      }));

    test('массив из строки и элемента — каждый рендерится в своём слоте', () =>
      context.start(async () => {
        renderComponent({
          children: [
            'Текст',
            <span key="b" data-child>
              Бейдж
            </span>,
          ],
        });

        const contentSlots = getContentSlots();

        expect(contentSlots.length).toBe(2);
      }));

    test('не должен рендерить контентный слот при отсутствии children', () =>
      context.start(async () => {
        renderComponent({});

        expect(getContentSlots().length).toBe(0);
      }));
  });

  describe('свойство controlLeft', () => {
    test('должен рендерить одиночный контрол в слоте контролов слева', () =>
      context.start(async () => {
        renderComponent({
          controlLeft: <span data-control>Контрол</span>,
        });

        expect(getControlSlots().length).toBe(1);
        expect(getRender().querySelector('[data-control]')).toBeTruthy();
      }));

    test('должен рендерить массив контролов отдельными слотами', () =>
      context.start(async () => {
        renderComponent({
          controlLeft: [
            <span key="1" data-control>
              Один
            </span>,
            <span key="2" data-control>
              Два
            </span>,
          ],
        });

        expect(getControlSlots().length).toBe(2);
      }));

    test('не должен рендерить слот контролов при отсутствии controlLeft', () =>
      context.start(async () => {
        renderComponent({});

        expect(getControlSlots().length).toBe(0);
      }));
  });

  describe('свойство controlRight', () => {
    test('должен рендерить одиночный контрол в слоте контролов справа', () =>
      context.start(async () => {
        renderComponent({
          controlRight: <span data-control>Контрол</span>,
        });

        expect(getControlSlots().length).toBe(1);
        expect(getRender().querySelector('[data-control]')).toBeTruthy();
      }));

    test('должен рендерить массив контролов отдельными слотами', () =>
      context.start(async () => {
        renderComponent({
          controlRight: [
            <span key="1" data-control>
              Один
            </span>,
            <span key="2" data-control>
              Два
            </span>,
          ],
        });

        expect(getControlSlots().length).toBe(2);
      }));

    test('не должен рендерить слот контролов при отсутствии controlRight', () =>
      context.start(async () => {
        renderComponent({});

        expect(getControlSlots().length).toBe(0);
      }));
  });

  describe('свойство size', () => {
    test('по умолчанию используется размер m', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        expect(hasClassName(getRender(), cnHeaderDataCell({ size: 'm' }))).toBe(
          true,
        );
      }));

    test('применяет модификатор размера s', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', size: 's' });

        const render = getRender();

        expect(hasClassName(render, cnHeaderDataCell({ size: 's' }))).toBe(
          true,
        );
        expect(hasClassName(render, cnHeaderDataCell({ size: 'm' }))).toBe(
          false,
        );
      }));
  });

  describe('взаимодействие (events)', () => {
    test('должен вызывать onClick переданный в прочие свойства', () =>
      context.start(async () => {
        const onClick = vi.fn();

        renderComponent({ children: 'Текст', onClick });

        fireEvent.click(getRender());

        expect(onClick).toHaveBeenCalledTimes(1);
      }));
  });
});
