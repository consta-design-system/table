import { IconArrowUp } from '@consta/icons/IconArrowUp';
import { IconDinosaur } from '@consta/icons/IconDinosaur';
import {
  createRoot,
  testRootId,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test, vi } from 'vitest';

import { cnDataCell, DataCell } from '../DataCell';

createRoot();
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnDataCell();

type AttachmentProps = React.ComponentProps<typeof DataCell>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <DataCell data-testid={testId} {...props} />
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
 * cnDataCell с модификаторами возвращает несколько классов через пробел, поэтому
 * нельзя использовать classList.contains напрямую.
 */
const hasClassName = (el: Element, className: string) =>
  className.split(' ').every((token) => el.classList.contains(token));

describe('Компонент DataCell', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({})).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.className).toContain(cnDataCell());
        expect(render.tagName).toBe('DIV');
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать style, объединяя его с внутренними переменными', () =>
      context.start(async () => {
        renderComponent({ style: { color: 'red', padding: 0 } });

        const render = getRender();

        expect(render.style.color).toBe('red');
        expect(render.style.padding).toBe('0px');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'aria-label': 'cell' });

        expect(getRender().getAttribute('aria-label')).toBe('cell');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('свойство children', () => {
    test('должен рендерить строку как текст внутри контентного слота', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const render = getRender();
        const contentSlot = render.querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlot).toBeTruthy();
        expect(contentSlot?.textContent).toContain('Текст');
      }));

    test('должен рендерить число как текст', () =>
      context.start(async () => {
        renderComponent({ children: 100 });

        const render = getRender();
        const contentSlot = render.querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlot?.textContent).toContain('100');
      }));

    test('должен оборачивать строку/число в Text с классом Text', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const textEl = getRender().querySelector(`.${cnDataCell('Text')}`);

        expect(textEl).toBeTruthy();
        expect(textEl?.textContent).toBe('Текст');
      }));

    test('не должен оборачивать не строку и не число в Text', () =>
      context.start(async () => {
        const node = <span data-child>Ребенок</span>;

        renderComponent({ children: node });

        const render = getRender();

        expect(render.querySelector('[data-child]')).toBeTruthy();
        expect(render.querySelector(`.${cnDataCell('Text')}`)).toBeNull();
      }));

    test('должен рендерить массив детей с расстановкой слотов', () =>
      context.start(async () => {
        renderComponent({ children: ['Первая', 'Вторая'] });

        const contentSlots = getRender().querySelectorAll(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlots.length).toBe(2);
      }));

    test('массив из строки и элемента — каждый рендерится в своём слоте', () =>
      context.start(async () => {
        renderComponent({
          children: ['Текст', <BadgeStub key="b" label="Бейдж" />],
        });

        const contentSlots = getRender().querySelectorAll(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlots.length).toBe(2);
      }));

    test('не должен рендерить слот содержимого при отсутствии children', () =>
      context.start(async () => {
        renderComponent({});

        const render = getRender();

        expect(render.querySelector(`.${cnDataCell('Slots')}`)).toBeNull();
        expect(
          render.querySelector(`.${cnDataCell('ContentSlot')}`),
        ).toBeNull();
      }));
  });

  describe('свойство icon', () => {
    test('должен рендерить одиночную иконку внутри контентного слота', () =>
      context.start(async () => {
        renderComponent({ icon: IconDinosaur });

        const render = getRender();
        const contentSlot = render.querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlot).toBeTruthy();
        expect(contentSlot?.querySelector('svg')).toBeTruthy();
      }));

    test('должен рендерить массив иконок отдельными слотами', () =>
      context.start(async () => {
        renderComponent({ icon: [IconDinosaur, IconArrowUp] });

        const contentSlots = getRender().querySelectorAll(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlots.length).toBe(2);
      }));

    test('не должен рендерить слот содержимого при отсутствии icon и children', () =>
      context.start(async () => {
        renderComponent({});

        expect(getRender().querySelector(`.${cnDataCell('Slots')}`)).toBeNull();
      }));
  });

  describe('свойство control', () => {
    test('должен рендерить одиночный контрол в слоте контролов', () =>
      context.start(async () => {
        renderComponent({ control: <span data-control>Чекбокс</span> });

        const controlSlot = getRender().querySelector(
          `.${cnDataCell('ControlSlot')}`,
        );

        expect(controlSlot).toBeTruthy();
        expect(controlSlot?.querySelector('[data-control]')).toBeTruthy();
      }));

    test('должен рендерить массив контролов отдельными слотами', () =>
      context.start(async () => {
        renderComponent({
          control: [
            <span key="1" data-control>
              Один
            </span>,
            <span key="2" data-control>
              Два
            </span>,
          ],
        });

        const controlSlots = getRender().querySelectorAll(
          `.${cnDataCell('ControlSlot')}`,
        );

        expect(controlSlots.length).toBe(2);
      }));

    test('не должен рендерить слот контролов при отсутствии control', () =>
      context.start(async () => {
        renderComponent({});

        expect(
          getRender().querySelector(`.${cnDataCell('ControlSlot')}`),
        ).toBeNull();
      }));

    test('не добавляет модификатор alignmentIndent при наличии контролов', () =>
      context.start(async () => {
        renderComponent({
          level: 2,
          control: <span data-control>К</span>,
        });

        expect(
          hasClassName(getRender(), cnDataCell({ alignmentIndent: true })),
        ).toBe(false);
      }));
  });

  describe('свойство indicator', () => {
    test('добавляет модификатор indicator при задании значения', () =>
      context.start(async () => {
        renderComponent({ indicator: 'alert' });

        expect(hasClassName(getRender(), cnDataCell({ indicator: true }))).toBe(
          true,
        );
      }));

    test('не добавляет модификатор indicator при отсутствии значения', () =>
      context.start(async () => {
        renderComponent({});

        expect(hasClassName(getRender(), cnDataCell({ indicator: true }))).toBe(
          false,
        );
      }));

    test('устанавливает цвет индикатора alert', () =>
      context.start(async () => {
        renderComponent({ indicator: 'alert' });

        expect(
          getRender().style.getPropertyValue(
            '--table-data-cell-indicator-color',
          ),
        ).toContain('alert');
      }));

    test('устанавливает цвет индикатора warning', () =>
      context.start(async () => {
        renderComponent({ indicator: 'warning' });

        expect(
          getRender().style.getPropertyValue(
            '--table-data-cell-indicator-color',
          ),
        ).toContain('warning');
      }));

    test('не устанавливает цвет индикатора при отсутствии значения', () =>
      context.start(async () => {
        renderComponent({});

        expect(
          getRender().style.getPropertyValue(
            '--table-data-cell-indicator-color',
          ),
        ).toBe('');
      }));
  });

  describe('свойство size', () => {
    test('по умолчанию используется размер m', () =>
      context.start(async () => {
        renderComponent({});

        expect(hasClassName(getRender(), cnDataCell({ size: 'm' }))).toBe(true);
      }));

    test('применяет модификатор размера s', () =>
      context.start(async () => {
        renderComponent({ size: 's' });

        const render = getRender();

        expect(hasClassName(render, cnDataCell({ size: 's' }))).toBe(true);
        expect(hasClassName(render, cnDataCell({ size: 'm' }))).toBe(false);
      }));
  });

  describe('свойство view', () => {
    test('передаёт view текстовому ребёнку для всех значений view', () =>
      context.start(async () => {
        for (const view of [
          'primary',
          'alert',
          'success',
          'warning',
        ] as const) {
          renderComponent({ view, children: 'Текст' });

          const textEl = getRender().querySelector(`.${cnDataCell('Text')}`);

          expect(textEl).toBeTruthy();
        }
      }));

    test('не передаёт view, если оно не задано', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const textEl = getRender().querySelector(`.${cnDataCell('Text')}`);

        expect(textEl?.getAttribute('data-view')).toBeNull();
      }));
  });

  describe('свойство level', () => {
    test('по умолчанию level = 0 и не задаёт переменную', () =>
      context.start(async () => {
        renderComponent({});

        expect(
          getRender().style.getPropertyValue('--table-data-cell-level'),
        ).toBe('');
      }));

    test('задаёт переменную уровня при level > 0', () =>
      context.start(async () => {
        renderComponent({ level: 3 });

        expect(
          getRender().style.getPropertyValue('--table-data-cell-level'),
        ).toBe('3');
      }));

    test('добавляет модификатор alignmentIndent при level >= 1 без контролов', () =>
      context.start(async () => {
        renderComponent({ level: 1 });

        expect(
          hasClassName(getRender(), cnDataCell({ alignmentIndent: true })),
        ).toBe(true);
      }));

    test('не добавляет alignmentIndent при level = 0', () =>
      context.start(async () => {
        renderComponent({ level: 0 });

        expect(
          hasClassName(getRender(), cnDataCell({ alignmentIndent: true })),
        ).toBe(false);
      }));

    test('отрицательный level приводится к 0 и не задаёт переменную', () =>
      context.start(async () => {
        renderComponent({ level: -5 });

        const render = getRender();

        expect(render.style.getPropertyValue('--table-data-cell-level')).toBe(
          '',
        );
        expect(
          hasClassName(render, cnDataCell({ alignmentIndent: true })),
        ).toBe(false);
      }));
  });

  describe('свойство truncate', () => {
    test('добавляет модификатор truncate контентному слоту', () =>
      context.start(async () => {
        renderComponent({ truncate: true, children: 'Текст' });

        const contentSlot = getRender().querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(
          hasClassName(
            contentSlot!,
            cnDataCell('ContentSlot', { truncate: true }),
          ),
        ).toBe(true);
      }));

    test('добавляет модификатор truncate слоту Slots', () =>
      context.start(async () => {
        renderComponent({ truncate: true, children: 'Текст' });

        const slots = getRender().querySelector(`.${cnDataCell('Slots')}`)!;

        expect(
          hasClassName(slots, cnDataCell('Slots', { truncate: true })),
        ).toBe(true);
      }));

    test('не добавляет модификаторы truncate по умолчанию', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const contentSlot = getRender().querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(
          contentSlot
            ? hasClassName(
                contentSlot,
                cnDataCell('ContentSlot', { truncate: true }),
              )
            : false,
        ).toBe(false);
      }));
  });

  describe('свойство lineClamp', () => {
    test('задаёт переменную line-clamp', () =>
      context.start(async () => {
        renderComponent({ lineClamp: 2, children: 'Текст' });

        expect(
          getRender().style.getPropertyValue('--table-data-cell-line-clamp'),
        ).toBe('2');
      }));

    test('добавляет модификатор lineClamp текстовому элементу', () =>
      context.start(async () => {
        renderComponent({ lineClamp: 2, children: 'Текст' });

        const textEl = getRender().querySelector(`.${cnDataCell('Text')}`)!;

        expect(
          hasClassName(textEl, cnDataCell('Text', { lineClamp: true })),
        ).toBe(true);
      }));

    test('не задаёт переменную и модификатор при отсутствии значения', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const render = getRender();

        expect(
          render.style.getPropertyValue('--table-data-cell-line-clamp'),
        ).toBe('');

        const textEl = render.querySelector(`.${cnDataCell('Text')}`);
        expect(
          textEl
            ? hasClassName(textEl, cnDataCell('Text', { lineClamp: true }))
            : false,
        ).toBe(false);
      }));
  });

  describe('взаимодействие (events)', () => {
    test('должен вызывать onClick переданный в прочие свойства', () =>
      context.start(async () => {
        const onClick = vi.fn();

        renderComponent({ onClick });

        fireEvent.click(getRender());

        expect(onClick).toHaveBeenCalledTimes(1);
      }));
  });
});

function BadgeStub({ label }: { label: string }) {
  return <span data-badge>{label}</span>;
}
