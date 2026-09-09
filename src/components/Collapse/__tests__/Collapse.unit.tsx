import {
  createRoot,
  testRootId,
  tick,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { animateTimeout } from '@consta/uikit/MixPopoverAnimate';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, sleep, top, wrap } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test, vi } from 'vitest';

import { cn } from '../../../utils/bem';
import { Collapse } from '../Collapse';

createRoot();
clearStack();

const cnCollapse = cn('Collapse');
const cnCollapseFullscreen = cn('CollapseFullscreen');

const testId = cnCollapse();

type AttachmentProps = React.ComponentProps<typeof Collapse>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );
  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <Collapse data-testid={testId} {...props} />
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
 */
const hasClassName = (el: Element, className: string) =>
  className.split(' ').every((token) => el.classList.contains(token));

const getExpandButton = () =>
  getRender().querySelector(
    `.${cnCollapse('ExpandButton')}`,
  ) as HTMLButtonElement;

const getFullscreenButton = () =>
  getRender().querySelector(
    `.${cnCollapse('FullscreenButton')}`,
  ) as HTMLButtonElement;

const getFullscreenContainer = () =>
  document.body.querySelector(`.${cnCollapseFullscreen()}`);

/**
 * Возвращает кнопку (Button) внутри тулбара по переданному data-атрибуту.
 */

// const getExpandButton = ()
/**
 * Возвращает children-wrapper (контейнер контента) внутри корневого div.
 */
const getChildrenWrapper = () =>
  getRender().querySelector(
    `.${cnCollapse('ChildrenWrapper')}`,
  ) as HTMLElement | null;

describe('Компонент Collapse', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок', () =>
      context.start(async () => {
        expect(() => renderComponent({ leftSide: 'Заголовок' })).not.toThrow();

        expect(getRender()).toBeTruthy();
        expect(getRender().tagName).toBe('DIV');
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          className: 'custom-class',
        });

        expect(getRender()).toHaveClass('custom-class');
      }));

    test('должен пробрасывать style через ...otherProps', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          style: { color: 'red' },
        });

        expect(getRender().style.color).toBe('red');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({
          'leftSide': 'Заголовок',
          'aria-label': 'collapse',
        });

        expect(getRender().getAttribute('aria-label')).toBe('collapse');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ leftSide: 'Заголовок', ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('свойство leftSide', () => {
    test('строка рендерится как Text с классом Title', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок' });

        const title = getRender().querySelector(`.${cnCollapse('Title')}`);

        expect(title).toBeTruthy();
        expect(title?.textContent).toBe('Заголовок');
      }));

    test('React-узел рендерится напрямую без обёртки Text', () =>
      context.start(async () => {
        renderComponent({ leftSide: <span data-left>Слева</span> });

        const render = getRender();

        expect(render.querySelector('[data-left]')).toBeTruthy();
        expect(render.querySelector(`.${cnCollapse('Title')}`)).toBeNull();
      }));

    test('массив из строки и узла рендерится без обёртки Title', () =>
      context.start(async () => {
        renderComponent({
          leftSide: ['Один', <span key="t" data-title />],
        });

        const render = getRender();

        expect(render.querySelector('[data-title]')).toBeTruthy();
        expect(render.querySelector(`.${cnCollapse('Title')}`)).toBeNull();
      }));
  });

  describe('свойство rightSide', () => {
    test('должен рендерить одиночный правый узел', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          rightSide: <span data-right>Справа</span>,
        });

        expect(getRender().querySelector('[data-right]')).toBeTruthy();
      }));

    test('должен рендерить массив правых узлов', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          rightSide: [
            <span key="1" data-right-one />,
            <span key="2" data-right-two />,
          ],
        });

        const render = getRender();

        expect(render.querySelector('[data-right-one]')).toBeTruthy();
        expect(render.querySelector('[data-right-two]')).toBeTruthy();
      }));

    test('не должен рендерить правую сторону, если rightSide не задан', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок' });

        // Кнопок раскрытия/полного экрана тоже нет — контента справа быть не должно
        expect(getRender().querySelector('[data-right]')).toBeNull();
      }));
  });

  describe('свойство children', () => {
    test('по умолчанию (expanded=false) контент не смонтирован', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок', children: 'Контент' });

        expect(getChildrenWrapper()).toBeNull();
        expect(
          getRender().querySelector(`.${cnCollapse('Content')}`),
        ).toBeTruthy();
      }));

    test('при expanded=true контент смонтирован внутри Content', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          children: 'Контент',
        });

        const wrapper = getChildrenWrapper();

        expect(wrapper).toBeTruthy();
        expect(wrapper?.textContent).toContain('Контент');
        expect(
          hasClassName(
            getRender().querySelector(`.${cnCollapse('Content')}`)!,
            cnCollapse('Content', { expanded: true }),
          ),
        ).toBe(true);
      }));

    test('не рендерит блок Content при отсутствии children', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок', expanded: true });

        expect(
          getRender().querySelector(`.${cnCollapse('Content')}`),
        ).toBeNull();
      }));

    test('не рендерит фуллскрин-портал при отсутствии children', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок', fullscreen: true });

        expect(
          document.body.querySelector(`.${cnCollapseFullscreen()}`),
        ).toBeNull();
      }));
  });

  describe('свойство expandButton', () => {
    test('кнопка раскрытия не рендерится по умолчанию', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок' });

        expect(getExpandButton()).toBeNull();
      }));

    test('кнопка раскрытия рендерится при expandButton', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок', expandButton: true });

        expect(getExpandButton()).toBeTruthy();
      }));

    test('клик по кнопке вызывает onExpand и раскрывает контент', () =>
      context.start(async () => {
        const onExpand = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          onExpand,
          children: 'Контент',
        });

        await wrap(tick());

        const btn = getExpandButton()!;

        btn?.click();

        expect(onExpand).toHaveBeenCalledTimes(1);
        expect(onExpand.mock.calls[0][0]).toBe(true);

        await wrap(tick());

        expect(
          hasClassName(
            getRender().querySelector(`.${cnCollapse('Content')}`)!,
            cnCollapse('Content', { expanded: true }),
          ),
        ).toBe(true);

        expect(getChildrenWrapper()).toBeTruthy();
      }));

    test('повторный клик сворачивает и вызывает onExpand со значением false', () =>
      context.start(async () => {
        const onExpand = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          onExpand,
          children: 'Контент',
        });

        const btn = getExpandButton()!;

        btn.click();
        await wrap(tick());
        btn.click();
        await wrap(tick());

        expect(
          hasClassName(
            getRender().querySelector(`.${cnCollapse('Content')}`)!,
            cnCollapse('Content', { expanded: true }),
          ),
        ).toBe(false);

        expect(onExpand).toHaveBeenCalledTimes(2);
        expect(onExpand.mock.calls[1][0]).toBe(false);
      }));
  });

  describe('подконтрольное состояние раскрытия', () => {
    test('раскрывается при expanded=true', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          children: 'Контент',
        });

        expect(getChildrenWrapper()).toBeTruthy();
      }));

    test('сворачивается при переходе expanded в false', () =>
      context.start(async () => {
        const root = ReactDOM.createRoot(
          document.querySelector(`*[data-test-block=${testRootId()}]`)!,
        );

        const doRender = (expanded: boolean) =>
          act(() => {
            root.render(
              <reatomContext.Provider value={top()}>
                <Theme preset={presetGpnDefault}>
                  <Collapse
                    data-testid={testId}
                    leftSide="Заголовок"
                    expanded={expanded}
                  >
                    Контент
                  </Collapse>
                </Theme>
              </reatomContext.Provider>,
            );
          });

        doRender(true);
        await wrap(tick());
        expect(getChildrenWrapper()).toBeTruthy();

        doRender(false);

        await wrap(tick());
        expect(getChildrenWrapper()).toBeNull();
      }));
  });

  describe('свойство expandedMaxHeight', () => {
    test('по умолчанию maxHeight = auto', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          children: 'Контент',
        });

        await wrap(tick());

        expect(getChildrenWrapper()?.style.maxHeight).toBe('');
      }));

    test('применяет числовое значение maxHeight в пикселях', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          expandedMaxHeight: 300,
          children: 'Контент',
        });

        expect(getChildrenWrapper()?.style.maxHeight).toBe('300px');
      }));

    test('принимает строковое значение auto', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          expandedMaxHeight: 'auto',
          children: 'Контент',
        });

        expect(getChildrenWrapper()?.style.maxHeight).toBe('');
      }));
  });

  describe('свойство fullscreenButton', () => {
    test('кнопка полноэкранного режима не рендерится по умолчанию', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок' });

        expect(getFullscreenButton()).toBeNull();
      }));

    test('кнопка полноэкранного режима рендерится при fullscreenButton', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок', fullscreenButton: true });

        expect(getFullscreenButton()).toBeTruthy();
      }));
  });

  describe('полноэкранный режим', () => {
    test('при fullscreen=true рендерит фуллскрин-портал с контентом', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });

        const fullscreen = document.body.querySelector(
          `.${cnCollapseFullscreen()}`,
        );

        expect(fullscreen).toBeTruthy();
        expect(fullscreen?.textContent).toContain('Контент');
      }));

    test('при fullscreen=false не рендерит фуллскрин-портал', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: false,
          children: 'Контент',
        });

        expect(getFullscreenContainer()).toBeNull();
      }));

    test('клик по кнопке вызывает onFullscreen и открывает портал', () =>
      context.start(async () => {
        const onFullscreen = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          onFullscreen,
          children: 'Контент',
        });

        getFullscreenButton().click();

        expect(onFullscreen).toHaveBeenCalledTimes(1);
        expect(onFullscreen.mock.calls[0][0]).toBe(true);
      }));

    test('повторный клик вызывает onFullscreen со значением false', () =>
      context.start(async () => {
        const onFullscreen = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          onFullscreen,
          children: 'Контент',
        });

        getFullscreenButton().click();
        getFullscreenButton().click();

        expect(onFullscreen).toHaveBeenCalledTimes(2);
        expect(onFullscreen.mock.calls[1][0]).toBe(false);
      }));
  });

  describe('свойство fullscreenZIndex', () => {
    test('по умолчанию zIndex = 1000', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });

        const fullscreen = document.body.querySelector(
          `.${cnCollapseFullscreen()}`,
        ) as HTMLElement;

        expect(fullscreen.style.zIndex).toBe('1000');
      }));

    test('применяет переданный zIndex', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          fullscreenZIndex: 5,
          children: 'Контент',
        });

        const fullscreen = document.body.querySelector(
          `.${cnCollapseFullscreen()}`,
        ) as HTMLElement;

        expect(fullscreen.style.zIndex).toBe('5');
      }));
  });

  describe('свойство fullscreenContainer', () => {
    test('рендерит портал в переданный контейнер', () =>
      context.start(async () => {
        const container = document.createElement('div');
        container.setAttribute('data-container', 'custom');
        document.body.appendChild(container);

        const containerRef = { current: container };

        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          fullscreenContainer: containerRef,
          children: 'Контент',
        });

        expect(
          container.querySelector(`.${cnCollapseFullscreen()}`),
        ).toBeTruthy();

        container.remove();
      }));

    test('рендерит портал в body по умолчанию', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });

        expect(
          document.body.querySelector(`.${cnCollapseFullscreen()}`),
        ).toBeTruthy();
      }));
  });
});
