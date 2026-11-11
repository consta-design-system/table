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

import { cnDataNumberingCell, DataNumberingCell } from '../DataNumberingCell';

createRoot();
// В reatom v1001 стек контекстов очищается явно: без context.start любой top()
// бросает ReatomError «missing async stack».
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnDataNumberingCell();

type DataNumberingCellTestProps = React.ComponentProps<
  typeof DataNumberingCell
>;

/**
 * Root используется повторно, пока контейнер не сменился (createRoot() из uikit
 * создаёт новый блок на каждый тест): повторный ReactDOM.createRoot() на том
 * же узле роняет React-предупреждение и теряет обновления при rerender.
 */
let root: ReactDOM.Root | null = null;
let rootContainer: Element | null = null;

const renderComponent = (props: DataNumberingCellTestProps) => {
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
          <DataNumberingCell data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLElement;

const getClasses = () => Array.from(getRender().classList);

describe('Компонент DataNumberingCell', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({ children: '1' })).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render).toHaveClass(...cnDataNumberingCell().split(' '));
        expect(render.tagName).toBe('DIV');
      }));

    test('должен рендериться на основе Text с параметрами size, view и lineHeight', () =>
      context.start(async () => {
        renderComponent({ children: '1' });

        const render = getRender();

        expect(render).toHaveClass(...cnText({ size: 'xs' }).split(' '));
        expect(render).toHaveClass(...cnText({ view: 'secondary' }).split(' '));
        expect(render).toHaveClass(...cnText({ lineHeight: 'l' }).split(' '));
      }));

    test('должен применять вертикальный отступ MixSpace pV=3xs', () =>
      context.start(async () => {
        renderComponent({ children: '1' });

        expect(getRender()).toHaveClass(
          ...cnMixSpace({ pV: '3xs' }).split(' '),
        );
      }));

    test('должен центрировать содержимое через MixFlex', () =>
      context.start(async () => {
        renderComponent({ children: '1' });

        const render = getRender();

        expect(render).toHaveClass(
          ...cnMixFlex({
            flex: 'flex',
            align: 'center',
            justify: 'center',
          }).split(' '),
        );
      }));

    test('должен рендериться единственным узлом без дополнительного wrapper', () =>
      context.start(async () => {
        renderComponent({ children: '1' });

        const render = getRender();

        expect(render.firstElementChild).toBeNull();
        expect(
          document.querySelectorAll(`*[data-testid=${testId}]`).length,
        ).toBe(1);
      }));

    test('не должен переопределять size, view и lineHeight значениями из props', () =>
      context.start(async () => {
        // Инвариант проверяется свойствами, которых нет в типе div: компонент
        // ставит значения Text после spread, поэтому они не перебиваются.
        const overrides = {
          size: 'm',
          view: 'primary',
          lineHeight: 's',
        } as unknown as DataNumberingCellTestProps;

        renderComponent({ ...overrides, children: '1' });

        const classes = getClasses();

        expect(classes).toContain('Text_size_xs');
        expect(classes).not.toContain('Text_size_m');
        expect(classes).not.toContain('Text_view_primary');
        expect(classes).not.toContain('Text_lineHeight_s');
      }));

    test('должен пробрасывать className, сохраняя базовый и служебные классы', () =>
      context.start(async () => {
        renderComponent({ children: '1', className: 'custom-class other' });

        const classes = getClasses();

        expect(classes).toContain('custom-class');
        expect(classes).toContain('other');
        expect(classes).toContain(cnDataNumberingCell());
        expect(classes).toContain('Text');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'children': '1', 'aria-label': 'cell' });

        expect(getRender().getAttribute('aria-label')).toBe('cell');
      }));

    test('должен пробрасывать data-* атрибуты строчной нумерации', () =>
      context.start(async () => {
        // Примеры Table помечают строку через data-row-hover/data-row-active.
        renderComponent({
          'children': '1',
          'data-row-hover': 'true',
          'data-row-active': 'true',
        } as DataNumberingCellTestProps);

        const render = getRender();

        expect(render.getAttribute('data-row-hover')).toBe('true');
        expect(render.getAttribute('data-row-active')).toBe('true');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ children: '1', ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('свойство children', () => {
    test('должен рендерить строку как текст внутри корневого элемента', () =>
      context.start(async () => {
        renderComponent({ children: 'Номер' });

        expect(getRender().textContent).toContain('Номер');
      }));

    test('должен рендерить число как текст', () =>
      context.start(async () => {
        renderComponent({ children: 100 });

        expect(getRender().textContent).toContain('100');
      }));

    test('должен рендерить ноль как текст', () =>
      context.start(async () => {
        renderComponent({ children: 0 });

        expect(getRender().textContent).toBe('0');
      }));

    test('должен рендерить произвольный React-узел', () =>
      context.start(async () => {
        renderComponent({ children: <span data-child>Ребенок</span> });

        expect(getRender().querySelector('[data-child]')).toBeTruthy();
      }));

    test('должен рендериться без children', () =>
      context.start(async () => {
        expect(() => renderComponent({ children: undefined })).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.textContent).toBe('');
      }));

    test('должен рендериться с children = null', () =>
      context.start(async () => {
        expect(() => renderComponent({ children: null })).not.toThrow();

        expect(getRender().textContent).toBe('');
      }));

    test('должен обновлять children при повторном render в том же узле', () =>
      context.start(async () => {
        renderComponent({ children: 1 });
        renderComponent({ children: 2 });

        const render = getRender();

        expect(render.textContent).toBe('2');
        expect(
          document.querySelectorAll(`*[data-testid=${testId}]`).length,
        ).toBe(1);
      }));
  });

  describe('взаимодействие (events)', () => {
    test('должен вызывать onClick переданный в прочие свойства', () =>
      context.start(async () => {
        const onClick = vi.fn();

        renderComponent({ children: '1', onClick });

        fireEvent.click(getRender());

        expect(onClick).toHaveBeenCalledTimes(1);
      }));

    test('должен вызывать onClick при клике по дочернему узлу', () =>
      context.start(async () => {
        const onClick = vi.fn();

        renderComponent({ children: <span data-child>Внук</span>, onClick });

        fireEvent.click(getRender().querySelector('[data-child]')!);

        expect(onClick).toHaveBeenCalledTimes(1);
      }));
  });
});
