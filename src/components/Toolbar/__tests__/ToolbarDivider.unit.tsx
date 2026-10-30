import {
  createRoot,
  testRootId,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test } from 'vitest';

import { cn } from '../../../utils/bem';
import { ToolbarDivider } from '../ToolbarDivider';

createRoot();
clearStack();

const cnToolbarDivider = cn('ToolbarDivider');

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnToolbarDivider();

type AttachmentProps = React.ComponentProps<typeof ToolbarDivider>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <ToolbarDivider data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLDivElement;

const getDividerHeight = () =>
  getRender().style.getPropertyValue('--toolbar-divider-height');

describe('Компонент ToolbarDivider', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({})).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.tagName).toBe('DIV');
        expect(render.classList.contains(cnToolbarDivider())).toBe(true);
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'aria-label': 'divider' });

        expect(getRender().getAttribute('aria-label')).toBe('divider');
      }));
  });

  describe('свойство size', () => {
    test('по умолчанию используется размер s', () =>
      context.start(async () => {
        renderComponent({});

        expect(getDividerHeight()).toBe('var(--control-height-s)');
      }));

    test('применяет размер xs', () =>
      context.start(async () => {
        renderComponent({ size: 'xs' });

        expect(getDividerHeight()).toBe('var(--control-height-xs)');
      }));

    test('применяет размер m', () =>
      context.start(async () => {
        renderComponent({ size: 'm' });

        expect(getDividerHeight()).toBe('var(--control-height-m)');
      }));

    test('применяет размер l', () =>
      context.start(async () => {
        renderComponent({ size: 'l' });

        expect(getDividerHeight()).toBe('var(--control-height-l)');
      }));
  });

  describe('свойство style', () => {
    test('должен пробрасывать style и сохранять CSS-переменную высоты', () =>
      context.start(async () => {
        renderComponent({ style: { backgroundColor: 'red' } });

        const render = getRender();

        expect(render.style.backgroundColor).toBe('red');
        expect(getDividerHeight()).toBe('var(--control-height-s)');
      }));
  });
});
