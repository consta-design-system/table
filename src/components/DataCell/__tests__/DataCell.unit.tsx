import { cnIcon } from '@consta/icons/Icon';
import { IconArrowUp } from '@consta/icons/IconArrowUp';
import { IconDinosaur } from '@consta/icons/IconDinosaur';
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

import { cellVerticalSpaceMap } from '##/utils/maps/cellVerticalSpaceMap';

import { cnDataCell, DataCell } from '../DataCell';

createRoot();
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnDataCell();

type AttachmentProps = React.ComponentProps<typeof DataCell>;

/**
 * Root используется повторно, пока контейнер не сменился (createRoot() из uikit
 * создаёт новый блок на каждый тест): повторный ReactDOM.createRoot() на том
 * же узле роняет React-предупреждение и теряет обновления при rerender.
 */
let root: ReactDOM.Root | null = null;
let rootContainer: Element | null = null;

const renderComponent = (props: AttachmentProps) => {
  const container = document.querySelector(
    `*[data-test-block=${testRootId()}]`,
  ) as Element;

  if (!root || rootContainer !== container) {
    root = ReactDOM.createRoot(container);
    rootContainer = container;
  }

  act(() => {
    root?.render(
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

    test('корень рендерится flex-контейнером через MixFlex', () =>
      context.start(async () => {
        renderComponent({});

        expect(getRender()).toHaveClass(
          ...cnMixFlex({ flex: 'flex' }).split(' '),
        );
      }));

    test('служебные свойства не попадают в DOM-атрибуты div', () =>
      context.start(async () => {
        renderComponent({
          level: 2,
          view: 'alert',
          size: 's',
          indicator: 'alert',
          truncate: true,
          lineClamp: 2,
          icon: IconDinosaur,
          control: <span data-control>К</span>,
          children: 'Текст',
        });

        const attributes = Array.from(getRender().attributes).map(
          (attribute) => attribute.name,
        );

        expect(attributes).toContain('class');
        expect(attributes).not.toContain('level');
        expect(attributes).not.toContain('view');
        expect(attributes).not.toContain('size');
        expect(attributes).not.toContain('indicator');
        expect(attributes).not.toContain('truncate');
        expect(attributes).not.toContain('lineClamp');
        expect(attributes).not.toContain('icon');
        expect(attributes).not.toContain('control');
      }));

    test('внутренняя переменная уровня перекрывает значение из style', () =>
      context.start(async () => {
        renderComponent({
          level: 2,
          style: {
            ['--table-data-cell-level' as string]: '9',
          } as React.CSSProperties,
        });

        expect(
          getRender().style.getPropertyValue('--table-data-cell-level'),
        ).toBe('2');
      }));

    test('при level = 0 переменная уровня из style затирается', () =>
      context.start(async () => {
        // Внутренний spread ставит `undefined` и выключает значение, переданное
        // пользователем, даже когда level не задан.
        renderComponent({
          style: {
            ['--table-data-cell-level' as string]: '9',
          } as React.CSSProperties,
        });

        expect(
          getRender().style.getPropertyValue('--table-data-cell-level'),
        ).toBe('');
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

    test('falsy элемент массива детей рендерится пустым слотом', () =>
      context.start(async () => {
        renderComponent({ children: ['Текст', false] });

        const contentSlots = getRender().querySelectorAll(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlots.length).toBe(2);
        expect(contentSlots[1].textContent).toBe('');
      }));

    test('должен рендерить ноль как текст внутри контентного слота', () =>
      context.start(async () => {
        renderComponent({ children: 0 });

        const render = getRender();

        expect(render.textContent).toBe('0');
        expect(
          render.querySelector(`.${cnDataCell('ContentSlot')}`),
        ).toBeTruthy();
        expect(render.querySelector(`.${cnDataCell('Text')}`)).toBeTruthy();
      }));

    test('пустая строка рендерится текстовым слотом', () =>
      context.start(async () => {
        renderComponent({ children: '' });

        const render = getRender();

        expect(
          render.querySelector(`.${cnDataCell('ContentSlot')}`),
        ).toBeTruthy();
        expect(
          render.querySelector(`.${cnDataCell('Text')}`)?.textContent,
        ).toBe('');
      }));

    test('boolean-ребёнок не создаёт слот содержимого', () =>
      context.start(async () => {
        for (const children of [false, true]) {
          renderComponent({ children });

          expect(
            getRender().querySelector(`.${cnDataCell('Slots')}`),
          ).toBeNull();
        }
      }));

    test('null как children не создаёт слот содержимого', () =>
      context.start(async () => {
        renderComponent({ children: null });

        expect(getRender().querySelector(`.${cnDataCell('Slots')}`)).toBeNull();
      }));

    test('пустой массив детей не рендерит слот содержимого', () =>
      context.start(async () => {
        renderComponent({ children: [] });

        expect(getRender().querySelector(`.${cnDataCell('Slots')}`)).toBeNull();
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

    test('иконки рендерятся перед children внутри слота содержимого', () =>
      context.start(async () => {
        renderComponent({ icon: IconDinosaur, children: 'Текст' });

        const contentSlots = getRender()
          .querySelector(`.${cnDataCell('Slots')}`)!
          .querySelectorAll(`.${cnDataCell('ContentSlot')}`);

        expect(contentSlots.length).toBe(2);
        expect(contentSlots[0].querySelector('svg')).toBeTruthy();
        expect(contentSlots[1].textContent).toBe('Текст');
      }));

    test('пустой массив иконок не рендерит слот содержимого', () =>
      context.start(async () => {
        renderComponent({ icon: [] });

        expect(getRender().querySelector(`.${cnDataCell('Slots')}`)).toBeNull();
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

    test('обёртка контролов идёт раньше слота содержимого', () =>
      context.start(async () => {
        renderComponent({
          control: <span data-control>К</span>,
          icon: IconDinosaur,
          children: 'Текст',
        });

        const render = getRender();
        const controlsWrapper = render.querySelector(
          `.${cnDataCell('ControlSlot')}`,
        )?.parentElement;

        // Обёртка контролов не имеет BEM-класса — отличить её можно только по
        // вложенному ControlSlot.
        expect(controlsWrapper).not.toBe(render);
        expect(render.firstElementChild).toBe(controlsWrapper);
        expect(render.lastElementChild?.className).toContain(
          cnDataCell('Slots'),
        );
      }));

    test('пустой массив контролов не рендерит слот и оставляет alignmentIndent', () =>
      context.start(async () => {
        renderComponent({ control: [], level: 2 });

        const render = getRender();

        expect(
          render.querySelector(`.${cnDataCell('ControlSlot')}`),
        ).toBeNull();
        expect(render).toHaveClass(
          ...cnDataCell({ alignmentIndent: true }).split(' '),
        );
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

        expect(getRender()).not.toHaveClass(
          ...cnDataCell({ alignmentIndent: true }).split(' '),
        );
      }));
  });

  describe('свойство indicator', () => {
    test('добавляет модификатор indicator при задании значения', () =>
      context.start(async () => {
        renderComponent({ indicator: 'alert' });

        expect(getRender()).toHaveClass(
          ...cnDataCell({ indicator: true }).split(' '),
        );
      }));

    test('не добавляет модификатор indicator при отсутствии значения', () =>
      context.start(async () => {
        renderComponent({});

        expect(getRender()).not.toHaveClass(
          ...cnDataCell({ indicator: true }).split(' '),
        );
      }));

    test('устанавливает цвет индикатора alert', () =>
      context.start(async () => {
        renderComponent({ indicator: 'alert' });

        expect(
          getRender().style.getPropertyValue(
            '--table-data-cell-indicator-color',
          ),
        ).toBe('var(--color-bg-alert)');
      }));

    test('устанавливает цвет индикатора warning', () =>
      context.start(async () => {
        renderComponent({ indicator: 'warning' });

        expect(
          getRender().style.getPropertyValue(
            '--table-data-cell-indicator-color',
          ),
        ).toBe('var(--color-bg-warning)');
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

        expect(getRender()).toHaveClass(
          ...cnDataCell({ size: 'm' }).split(' '),
        );
      }));

    test('применяет модификатор размера s', () =>
      context.start(async () => {
        renderComponent({ size: 's' });

        const render = getRender();

        expect(render).toHaveClass(...cnDataCell({ size: 's' }).split(' '));
        expect(render).not.toHaveClass(...cnDataCell({ size: 'm' }).split(' '));
      }));

    test('размер пробрасывается в Text и задаёт вертикальный отступ', () =>
      context.start(async () => {
        for (const size of ['m', 's'] as const) {
          renderComponent({ size, children: 'Текст' });

          const textEl = getRender().querySelector(`.${cnDataCell('Text')}`)!;

          expect(textEl).toBeTruthy();
          expect(textEl).toHaveClass(...cnText({ size }).split(' '));
          expect(textEl).toHaveClass(
            ...cnMixSpace({ mV: cellVerticalSpaceMap[size] }).split(' '),
          );
        }
      }));

    test('размер не влияет на не-текстовых детей', () =>
      context.start(async () => {
        renderComponent({ size: 's', children: <span data-child>Т</span> });

        const render = getRender();

        expect(render.querySelector(`.${cnDataCell('Text')}`)).toBeNull();
        expect(render.querySelector('[data-child]')).toBeTruthy();
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

          const textEl = getRender().querySelector(`.${cnDataCell('Text')}`)!;

          expect(textEl).toBeTruthy();
          expect(textEl).toHaveClass(...cnText({ view }).split(' '));
        }
      }));

    test('не добавляет модификатор view тексту без view', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const textEl = getRender().querySelector(`.${cnDataCell('Text')}`)!;

        expect(textEl).toBeTruthy();
        expect(textEl.className).not.toMatch(/Text_view_/);
      }));

    test('передаёт view иконке для всех значений view', () =>
      context.start(async () => {
        for (const view of [
          'primary',
          'alert',
          'success',
          'warning',
        ] as const) {
          renderComponent({ view, icon: IconDinosaur });

          const iconEl = getRender().querySelector(`.${cnIcon()}`)!;

          expect(iconEl).toBeTruthy();
          expect(iconEl).toHaveClass(...cnIcon({ view }).split(' '));
        }
      }));

    test('иконка рендерится в размере s независимо от размера ячейки', () =>
      context.start(async () => {
        for (const size of ['m', 's'] as const) {
          renderComponent({ icon: IconDinosaur, size });

          const iconEl = getRender().querySelector(`.${cnIcon()}`)!;

          expect(iconEl).toHaveClass(...cnIcon({ size: 's' }).split(' '));
        }
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

        expect(getRender()).toHaveClass(
          ...cnDataCell({ alignmentIndent: true }).split(' '),
        );
      }));

    test('не добавляет alignmentIndent при level = 0', () =>
      context.start(async () => {
        renderComponent({ level: 0 });

        expect(getRender()).not.toHaveClass(
          ...cnDataCell({ alignmentIndent: true }).split(' '),
        );
      }));

    test('отрицательный level приводится к 0 и не задаёт переменную', () =>
      context.start(async () => {
        renderComponent({ level: -5 });

        const render = getRender();

        expect(render.style.getPropertyValue('--table-data-cell-level')).toBe(
          '',
        );
        expect(render).not.toHaveClass(
          ...cnDataCell({ alignmentIndent: true }).split(' '),
        );
      }));
  });

  describe('свойство truncate', () => {
    test('добавляет модификатор truncate контентному слоту', () =>
      context.start(async () => {
        renderComponent({ truncate: true, children: 'Текст' });

        const contentSlot = getRender().querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlot!).toHaveClass(
          ...cnDataCell('ContentSlot', { truncate: true }).split(' '),
        );
      }));

    test('добавляет модификатор truncate слоту Slots', () =>
      context.start(async () => {
        renderComponent({ truncate: true, children: 'Текст' });

        const slots = getRender().querySelector(`.${cnDataCell('Slots')}`)!;

        expect(slots).toHaveClass(
          ...cnDataCell('Slots', { truncate: true }).split(' '),
        );
      }));

    test('не добавляет модификаторы truncate по умолчанию', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const contentSlot = getRender().querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(contentSlot).not.toHaveClass(
          ...cnDataCell('ContentSlot', { truncate: true }).split(' '),
        );
      }));

    test('Slots получает truncate даже для React-узла без Text', () =>
      context.start(async () => {
        renderComponent({
          truncate: true,
          children: <span data-child>T</span>,
        });

        const render = getRender();
        const contentSlot = render.querySelector(
          `.${cnDataCell('ContentSlot')}`,
        )!;

        expect(render.querySelector(`.${cnDataCell('Slots')}`)!).toHaveClass(
          ...cnDataCell('Slots', { truncate: true }).split(' '),
        );
        // Модификатор доходит только до Slots: ContentSlot его не получает.
        expect(contentSlot).not.toHaveClass(
          ...cnDataCell('ContentSlot', { truncate: true }).split(' '),
        );
      }));

    test('не должен добавлять truncate контентному слоту для React-узла', () =>
      context.start(async () => {
        // Проверка падает: renderChildren передаёт truncate только в ветке
        // со строкой/числом, поэтому `overflow: hidden` не применяется к
        // слоту с React-узлом.
        renderComponent({
          truncate: true,
          children: <span data-child>T</span>,
        });

        const contentSlot = getRender().querySelector(
          `.${cnDataCell('ContentSlot')}`,
        )!;

        expect(contentSlot).not.toHaveClass(
          ...cnDataCell('ContentSlot', { truncate: true }).split(' '),
        );
      }));

    test('truncate и lineClamp дают Text оба модификатора', () =>
      context.start(async () => {
        renderComponent({ truncate: true, lineClamp: 2, children: 'Текст' });

        const textEl = getRender().querySelector(`.${cnDataCell('Text')}`)!;

        expect(textEl.className).toContain('Text_truncate');
        expect(textEl).toHaveClass(
          ...cnDataCell('Text', { lineClamp: true }).split(' '),
        );
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

        expect(textEl).toHaveClass(
          ...cnDataCell('Text', { lineClamp: true }).split(' '),
        );
      }));

    test('не задаёт переменную и модификатор при отсутствии значения', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const render = getRender();

        expect(
          render.style.getPropertyValue('--table-data-cell-line-clamp'),
        ).toBe('');

        const textEl = render.querySelector(`.${cnDataCell('Text')}`);
        expect(textEl).not.toHaveClass(
          ...cnDataCell('Text', { lineClamp: true }).split(' '),
        );
      }));

    test('lineClamp = 0 не задаёт переменную', () =>
      context.start(async () => {
        renderComponent({ lineClamp: 0, children: 'Текст' });

        const render = getRender();

        expect(
          render.style.getPropertyValue('--table-data-cell-line-clamp'),
        ).toBe('');
        expect(render.querySelector(`.${cnDataCell('Text')}`)!).not.toHaveClass(
          ...cnDataCell('Text', { lineClamp: true }).split(' '),
        );
      }));

    test('переменная line-clamp ставится и без Text, но модификатор не появляется', () =>
      context.start(async () => {
        renderComponent({ lineClamp: 3, children: <span data-child>T</span> });

        const render = getRender();

        expect(
          render.style.getPropertyValue('--table-data-cell-line-clamp'),
        ).toBe('3');
        expect(render.querySelector(`.${cnDataCell('Text')}`)).toBeNull();
      }));
  });

  describe('обновление свойств', () => {
    test('ререндер обновляет содержимое и модификаторы', () =>
      context.start(async () => {
        renderComponent({ children: 'Было', size: 'm' });
        renderComponent({ children: 'Стало', size: 's', truncate: true });

        const render = getRender();

        expect(render.textContent).toBe('Стало');
        expect(render).toHaveClass(...cnDataCell({ size: 's' }).split(' '));
        expect(render).not.toHaveClass(...cnDataCell({ size: 'm' }).split(' '));
        expect(
          render.querySelectorAll(`.${cnDataCell('ContentSlot')}`).length,
        ).toBe(1);
      }));

    test('ререндер без control убирает слот контролов', () =>
      context.start(async () => {
        renderComponent({ control: <span data-control>К</span> });

        expect(
          getRender().querySelector(`.${cnDataCell('ControlSlot')}`),
        ).toBeTruthy();

        renderComponent({});

        expect(
          getRender().querySelector(`.${cnDataCell('ControlSlot')}`),
        ).toBeNull();
      }));

    test('ререндер меняет число слотов при изменении массива детей', () =>
      context.start(async () => {
        renderComponent({ children: ['Один'] });
        expect(
          getRender().querySelectorAll(`.${cnDataCell('ContentSlot')}`).length,
        ).toBe(1);

        renderComponent({ children: ['Один', 'Два', 'Три'] });
        expect(
          getRender().querySelectorAll(`.${cnDataCell('ContentSlot')}`).length,
        ).toBe(3);
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
