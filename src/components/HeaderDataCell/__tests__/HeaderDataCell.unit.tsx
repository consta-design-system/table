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

import { cnHeaderDataCell, HeaderDataCell } from '../HeaderDataCell';

createRoot();
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnHeaderDataCell();

type AttachmentProps = React.ComponentProps<typeof HeaderDataCell>;

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

const getContentSlots = () =>
  getRender().querySelectorAll(`.${cnHeaderDataCell('ContentSlot')}`);

const getControlSlots = () =>
  getRender().querySelectorAll(`.${cnHeaderDataCell('ControlSlot')}`);

/** Левая группа ячейки: всегда рендерится и содержит контролы + контент. */
const getLeftGroup = () => getRender().firstElementChild as HTMLElement;

/** Правая группа ячейки: рендерится только при наличии controlRight. */
const getRightGroup = () => getRender().lastElementChild as HTMLElement;

/** Обёртка слотов внутри группы — BEM-класса не имеет, отличаемся по позиции. */
const getGroupWrappers = (group: HTMLElement) =>
  Array.from(group.children) as HTMLElement[];

describe('Компонент HeaderDataCell', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({ children: 'Текст' })).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render).toHaveClass(...cnHeaderDataCell().split(' '));
        expect(render.tagName).toBe('DIV');
      }));

    test('должен центрировать содержимое через MixFlex и задавать отступ MixSpace', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        const render = getRender();

        expect(render).toHaveClass(
          ...cnMixFlex({
            flex: 'flex',
            gap: 'xs',
            justify: 'space-between',
          }).split(' '),
        );
        expect(render).toHaveClass(...cnMixSpace({ pH: 's' }).split(' '));
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать style через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', style: { color: 'red' } });

        expect(getRender().style.color).toBe('red');
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

    test('служебные свойства не попадают в DOM-атрибуты div', () =>
      context.start(async () => {
        renderComponent({
          size: 's',
          controlLeft: <span data-left />,
          controlRight: <span data-right />,
          children: 'Текст',
        });

        const attributeNames = Array.from(getRender().attributes).map(
          (attribute) => attribute.name,
        );

        expect(attributeNames).toContain('class');
        // Служебные пропсы деструктурируются: до DOM дошли бы их имена в
        // нижнем регистре, которые React проставляет для неизвестных атрибутов.
        for (const prop of ['size', 'controlLeft', 'controlRight']) {
          expect(attributeNames).not.toContain(prop.toLowerCase());
        }
      }));
  });

  describe('структура слотов', () => {
    test('пустая ячейка рендерит только левую группу без вложенных слотов', () =>
      context.start(async () => {
        renderComponent({});

        const render = getRender();

        expect(render.children.length).toBe(1);
        expect(getLeftGroup()).toHaveClass(
          ...cnMixFlex({ flex: 'flex', gap: 'xs' }).split(' '),
        );
        expect(getLeftGroup().firstElementChild).toBeNull();
      }));

    test('controlRight рендерится отдельной группой после левой', () =>
      context.start(async () => {
        renderComponent({
          children: 'Текст',
          controlRight: <span data-right />,
        });

        const render = getRender();

        expect(render.children.length).toBe(2);
        expect(getRightGroup()).not.toBe(getLeftGroup());
        expect(getRightGroup()).toHaveClass(
          ...cnMixFlex({
            flex: 'flex',
            align: 'center',
            gap: '2xs',
          }).split(' '),
        );
        expect(getRightGroup().querySelector('[data-right]')).toBeTruthy();
        expect(getLeftGroup().querySelector('[data-right]')).toBeNull();
      }));

    test('controlLeft идёт перед контентом внутри левой группы', () =>
      context.start(async () => {
        renderComponent({
          controlLeft: <span data-left />,
          children: 'Текст',
        });

        const wrappers = getGroupWrappers(getLeftGroup());

        expect(wrappers.length).toBe(2);
        expect(
          wrappers[0].querySelector(`.${cnHeaderDataCell('ControlSlot')}`),
        ).toBeTruthy();
        expect(wrappers[0].querySelector('[data-left]')).toBeTruthy();
        expect(wrappers[1].querySelector('[data-left]')).toBeNull();
        expect(
          wrappers[1].querySelector(`.${cnHeaderDataCell('ContentSlot')}`),
        ).toBeTruthy();
      }));

    test('контент идёт в левой группе, когда controlLeft отсутствует', () =>
      context.start(async () => {
        renderComponent({
          children: 'Текст',
          controlRight: <span data-right />,
        });

        const wrappers = getGroupWrappers(getLeftGroup());

        expect(wrappers.length).toBe(1);
        expect(
          wrappers[0].querySelector(`.${cnHeaderDataCell('ContentSlot')}`),
        ).toBeTruthy();
      }));

    test('левый и правый контролы разделяются по группам', () =>
      context.start(async () => {
        renderComponent({
          controlLeft: <span data-left />,
          controlRight: <span data-right />,
          children: 'Текст',
        });

        const render = getRender();

        expect(getControlSlots().length).toBe(2);
        expect(getLeftGroup().querySelectorAll('[data-left]').length).toBe(1);
        expect(getRightGroup().querySelectorAll('[data-right]').length).toBe(1);
        expect(render.children.length).toBe(2);
      }));

    test('ContentSlot рендерится flex-контейнером с центрированием', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст' });

        expect(getContentSlots()[0]).toHaveClass(
          ...cnMixFlex({ flex: 'flex', align: 'center' }).split(' '),
        );
      }));

    test('ControlSlot рендерится центрированным flex-контейнером', () =>
      context.start(async () => {
        renderComponent({ controlLeft: <span data-left /> });

        expect(getControlSlots()[0]).toHaveClass(
          ...cnMixFlex({
            flex: 'flex',
            align: 'center',
            justify: 'center',
          }).split(' '),
        );
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
        expect(textEl).toHaveClass(...cnText({ size: 'm' }).split(' '));
        expect(textEl).toHaveClass(...cnMixSpace({ pV: 's' }).split(' '));
      }));

    test('должен учитывать size при оборачивании текста в Text', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', size: 's' });

        const textEl = getContentSlots()[0]?.querySelector(`.${cnText()}`);

        expect(textEl).toHaveClass(...cnText({ size: 's' }).split(' '));
        expect(textEl).toHaveClass(...cnMixSpace({ pV: 'xs' }).split(' '));
      }));

    test('вертикальный отступ Text берётся из cellVerticalSpaceMap', () =>
      context.start(async () => {
        for (const size of ['m', 's'] as const) {
          renderComponent({ children: 'Текст', size });

          const textEl = getContentSlots()[0].querySelector(`.${cnText()}`)!;

          expect(textEl).toBeTruthy();
          expect(textEl).toHaveClass(...cnText({ size }).split(' '));
          expect(textEl).toHaveClass(
            ...cnMixSpace({ pV: cellVerticalSpaceMap[size] }).split(' '),
          );
        }
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

        const contentSlots = getContentSlots();

        expect(contentSlots.length).toBe(2);
        expect(contentSlots[0].textContent).toBe('Первая');
        expect(contentSlots[1].textContent).toBe('Вторая');
      }));

    test('каждый строковый ребёнок массива получает Text своего размера', () =>
      context.start(async () => {
        renderComponent({ children: ['Первая', 'Вторая'], size: 's' });

        const textElements = Array.from(
          getLeftGroup().querySelectorAll(`.${cnText()}`),
        );

        expect(textElements.length).toBe(2);
        for (const textEl of textElements) {
          expect(textEl).toHaveClass(...cnText({ size: 's' }).split(' '));
          expect(textEl).toHaveClass(
            ...cnMixSpace({ pV: cellVerticalSpaceMap.s }).split(' '),
          );
        }
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
        expect(contentSlots[0].querySelector(`.${cnText()}`)).toBeTruthy();
        expect(contentSlots[1].querySelector('[data-child]')).toBeTruthy();
        expect(contentSlots[1].querySelector(`.${cnText()}`)).toBeNull();
      }));

    test('falsy элемент массива детей рендерится пустым слотом', () =>
      context.start(async () => {
        renderComponent({ children: ['Текст', false] });

        const contentSlots = getContentSlots();

        expect(contentSlots.length).toBe(2);
        expect(contentSlots[1].textContent).toBe('');
      }));

    test('children = 0 или пустая строка не создают слот содержимого', () =>
      context.start(async () => {
        // Проверка фиксирует текущее поведение: ячейка проверяет `children`
        // на truthiness до ветки isNumber/isString, поэтому `0` и `''`
        // отбрасываются. DataCell разводит это через isNotNil, здесь — нет.
        for (const children of [0, '']) {
          renderComponent({ children });

          const render = getRender();

          expect(getContentSlots().length).toBe(0);
          expect(render.textContent).toBe('');
          expect(render.querySelector(`.${cnText()}`)).toBeNull();
        }
      }));

    test('boolean false и null как children не создают слот содержимого', () =>
      context.start(async () => {
        for (const children of [false, null]) {
          renderComponent({ children });

          expect(getContentSlots().length).toBe(0);
          expect(getRender().textContent).toBe('');
        }
      }));

    test('children = true рендерит пустой контентный слот', () =>
      context.start(async () => {
        // `true` проходит truthiness-проверку и доходит до renderContentSlot,
        // где React его отбрасывает как ребёнка — слот остаётся пустым.
        renderComponent({ children: true });

        const contentSlots = getContentSlots();

        expect(contentSlots.length).toBe(1);
        expect(contentSlots[0].textContent).toBe('');
      }));

    test('пустой массив детей не рендерит контентный слот', () =>
      context.start(async () => {
        renderComponent({ children: [] });

        expect(getContentSlots().length).toBe(0);
        expect(getLeftGroup().firstElementChild).toBeNull();
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

        const controlSlots = getControlSlots();

        expect(controlSlots.length).toBe(2);
        expect(controlSlots[0].textContent).toBe('Один');
        expect(controlSlots[1].textContent).toBe('Два');
      }));

    test('пустой массив контролов не рендерит группу', () =>
      context.start(async () => {
        renderComponent({ controlLeft: [], children: 'Текст' });

        expect(getControlSlots().length).toBe(0);
        expect(getGroupWrappers(getLeftGroup()).length).toBe(1);
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

        const controlSlots = getControlSlots();

        expect(controlSlots.length).toBe(2);
        expect(controlSlots[0].textContent).toBe('Один');
        expect(controlSlots[1].textContent).toBe('Два');
      }));

    test('пустой массив контролов не рендерит правую группу', () =>
      context.start(async () => {
        renderComponent({ controlRight: [], children: 'Текст' });

        const render = getRender();

        expect(getControlSlots().length).toBe(0);
        expect(render.children.length).toBe(1);
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

        expect(getRender()).toHaveClass(
          ...cnHeaderDataCell({ size: 'm' }).split(' '),
        );
      }));

    test('применяет модификатор размера s', () =>
      context.start(async () => {
        renderComponent({ children: 'Текст', size: 's' });

        const render = getRender();

        expect(render).toHaveClass(
          ...cnHeaderDataCell({ size: 's' }).split(' '),
        );
        expect(render).not.toHaveClass(
          ...cnHeaderDataCell({ size: 'm' }).split(' '),
        );
      }));

    test('размер не влияет на не-текстовых детей', () =>
      context.start(async () => {
        renderComponent({ size: 's', children: <span data-child>Т</span> });

        const render = getRender();

        expect(render.querySelector(`.${cnText()}`)).toBeNull();
        expect(render.querySelector('[data-child]')).toBeTruthy();
      }));
  });

  describe('обновление свойств', () => {
    test('ререндер обновляет содержимое и модификатор размера', () =>
      context.start(async () => {
        renderComponent({ children: 'Было', size: 'm' });
        renderComponent({ children: 'Стало', size: 's' });

        const render = getRender();

        expect(render.textContent).toBe('Стало');
        expect(render).toHaveClass(
          ...cnHeaderDataCell({ size: 's' }).split(' '),
        );
        expect(render).not.toHaveClass(
          ...cnHeaderDataCell({ size: 'm' }).split(' '),
        );
        expect(getContentSlots().length).toBe(1);
      }));

    test('ререндер меняет число слотов при изменении массива детей', () =>
      context.start(async () => {
        renderComponent({ children: ['Один'] });
        expect(getContentSlots().length).toBe(1);

        renderComponent({ children: ['Один', 'Два', 'Три'] });
        expect(getContentSlots().length).toBe(3);
      }));

    test('ререндер без controlLeft и controlRight убирает слоты контролов', () =>
      context.start(async () => {
        renderComponent({
          children: 'Текст',
          controlLeft: <span data-left />,
          controlRight: <span data-right />,
        });

        expect(getControlSlots().length).toBe(2);

        renderComponent({ children: 'Текст' });

        const render = getRender();

        expect(getControlSlots().length).toBe(0);
        expect(render.children.length).toBe(1);
        expect(getRender()).toBe(render);
      }));

    test('ререндер сохраняет единственный корневой узел', () =>
      context.start(async () => {
        renderComponent({ children: 1 });
        renderComponent({ children: 2 });

        expect(getRender().textContent).toBe('2');
        expect(
          document.querySelectorAll(`*[data-testid=${testId}]`).length,
        ).toBe(1);
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

    test('должен вызывать onClick при клике по дочернему узлу', () =>
      context.start(async () => {
        const onClick = vi.fn();

        renderComponent({
          children: 'Текст',
          controlRight: <span data-right>Кнопка</span>,
          onClick,
        });

        fireEvent.click(getRender().querySelector('[data-right]')!);

        expect(onClick).toHaveBeenCalledTimes(1);
      }));
  });
});
