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
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnDataNumberingCell();

type AttachmentProps = React.ComponentProps<typeof DataNumberingCell>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
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

describe('Компонент DataNumberingCell', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({ children: '1' })).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.className).toContain(cnDataNumberingCell());
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

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ children: '1', className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'children': '1', 'aria-label': 'cell' });

        expect(getRender().getAttribute('aria-label')).toBe('cell');
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

    test('должен рендерить произвольный React-узел', () =>
      context.start(async () => {
        renderComponent({ children: <span data-child>Ребенок</span> });

        expect(getRender().querySelector('[data-child]')).toBeTruthy();
      }));

    test('должен рендериться без children', () =>
      context.start(async () => {
        expect(() => renderComponent({} as AttachmentProps)).not.toThrow();

        expect(getRender()).toBeTruthy();
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
  });
});
