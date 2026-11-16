import {
  createRoot,
  testRootId,
  tick,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top, wrap } from '@reatom/core';
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
const cnToolbar = cn('Toolbar');

const testId = cnCollapse();

type AttachmentProps = React.ComponentProps<typeof Collapse>;

const getHost = () =>
  document.querySelector(`*[data-test-block=${testRootId()}]`)!;

const renderComponent = (props: AttachmentProps, root?: ReactDOM.Root) => {
  const target = root ?? ReactDOM.createRoot(getHost());

  act(() => {
    target.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <Collapse data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });

  return target;
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLDivElement;

const getToolbar = () =>
  getRender().querySelector(`.${cnToolbar()}`) as HTMLElement | null;

const getContent = () =>
  getRender().querySelector(`.${cnCollapse('Content')}`) as HTMLElement | null;

const getExpandButton = () =>
  getRender().querySelector(
    `.${cnCollapse('ExpandButton')}`,
  ) as HTMLButtonElement | null;

const getFullscreenButton = () =>
  getRender().querySelector(
    `.${cnCollapse('FullscreenButton')}`,
  ) as HTMLButtonElement | null;

const getFullscreenContainer = () =>
  document.body.querySelector(
    `.${cnCollapseFullscreen()}`,
  ) as HTMLElement | null;

const getFullscreenToolbar = () =>
  getFullscreenContainer()?.querySelector(
    `.${cnCollapseFullscreen('Toolbar')}`,
  ) as HTMLElement | null;

const getFullscreenChildrenWrapper = () =>
  getFullscreenContainer()?.querySelector(
    `.${cnCollapseFullscreen('ChildrenWrapper')}`,
  ) as HTMLElement | null;

const getFullscreenExitButton = () =>
  getFullscreenToolbar()?.querySelector('button') as HTMLButtonElement | null;

/**
 * У иконок кнопок нет data-атрибутов, поэтому активное состояние
 * проверяется по обёртке переключателя и классу самой иконки.
 */
const getExpandIconSwitcher = () =>
  getExpandButton()?.querySelector(
    '.icons--AnimateIconBase',
  ) as HTMLElement | null;

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

        // Кнопок раскрытия/полного экрана тоже нет: в тулбаре только слот с Title
        expect(getRender().querySelector('[data-right]')).toBeNull();
        expect(
          getRender().querySelectorAll(`.${cnToolbar('Slot')}`),
        ).toHaveLength(1);
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
          getRender().querySelector(`.${cnCollapse('Content')}`),
        ).toHaveClass(...cnCollapse('Content', { expanded: true }).split(' '));
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
          getRender().querySelector(`.${cnCollapse('Content')}`),
        ).toHaveClass(...cnCollapse('Content', { expanded: true }).split(' '));

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
          getRender().querySelector(`.${cnCollapse('Content')}`),
        ).not.toHaveClass(
          ...cnCollapse('Content', { expanded: true }).split(' '),
        );

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
        const root = renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          children: 'Контент',
        });

        await wrap(tick());
        expect(getChildrenWrapper()).toBeTruthy();

        renderComponent(
          {
            leftSide: 'Заголовок',
            expanded: false,
            children: 'Контент',
          },
          root,
        );

        await wrap(tick());
        expect(getChildrenWrapper()).toBeNull();
      }));

    test('состояние, выставленное кликом, переживает ре-рендер с теми же props', () =>
      context.start(async () => {
        const props: AttachmentProps = {
          leftSide: 'Заголовок',
          expandButton: true,
          children: 'Контент',
        };

        const root = renderComponent(props);
        await wrap(tick());

        getExpandButton()!.click();
        await wrap(tick());
        expect(getChildrenWrapper()).toBeTruthy();

        renderComponent(props, root);
        await wrap(tick());

        expect(getChildrenWrapper()).toBeTruthy();
      }));

    test('изменённый expanded перезаписывает состояние, выставленное кликом', () =>
      context.start(async () => {
        const root = renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          expanded: true,
          children: 'Контент',
        });
        await wrap(tick());

        getExpandButton()!.click();
        await wrap(tick());
        expect(getChildrenWrapper()).toBeNull();

        renderComponent(
          {
            leftSide: 'Заголовок',
            expandButton: true,
            expanded: true,
            children: 'Контент',
          },
          root,
        );
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

        getFullscreenButton()!.click();

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

        getFullscreenButton()!.click();
        getFullscreenButton()!.click();

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

  describe('модификатор container полноэкранного портала', () => {
    const containerModifier = cnCollapseFullscreen({ container: true }).split(
      ' ',
    );

    const createContainer = () => {
      const container = document.createElement('div');
      container.setAttribute('data-container', 'custom');
      document.body.appendChild(container);

      return container;
    };

    test('рендерит мод container для Element-контейнера', () =>
      context.start(async () => {
        const container = createContainer();

        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          fullscreenContainer: container,
          children: 'Контент',
        });
        await wrap(tick());

        expect(getFullscreenContainer()).toHaveClass(...containerModifier);

        container.remove();
      }));

    test('рендерит мод container для ref на элемент вне body', () =>
      context.start(async () => {
        const container = createContainer();

        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          fullscreenContainer: { current: container },
          children: 'Контент',
        });
        await wrap(tick());

        expect(getFullscreenContainer()).toHaveClass(...containerModifier);

        container.remove();
      }));

    test('не рендерит мод container для ref на body', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          fullscreenContainer: { current: document.body },
          children: 'Контент',
        });
        await wrap(tick());

        expect(getFullscreenContainer()).not.toHaveClass(...containerModifier);
      }));
  });

  describe('рамка тулбара при раскрытии контента', () => {
    const borderBottom = cnToolbar({ border: 'bottom' }).split(' ');

    test('рамки нет, пока контент не раскрыт', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(getToolbar()).not.toHaveClass(...borderBottom);
      }));

    test('рамка появляется после раскрытия', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        getExpandButton()!.click();
        await wrap(tick());

        expect(getToolbar()).toHaveClass(...borderBottom);
      }));

    test('рамка пропадает после сворачивания', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        getExpandButton()!.click();
        await wrap(tick());
        expect(getToolbar()).toHaveClass(...borderBottom);

        getExpandButton()!.click();
        await wrap(tick());

        expect(getToolbar()).not.toHaveClass(...borderBottom);
        expect(getChildrenWrapper()).toBeNull();
      }));
  });

  describe('высота контента при переходе в полноэкранный режим', () => {
    /**
     * clientHeight зависит от реального лейаута, поэтому его фиксируют
     * заглушкой: иначе проверка зависела бы от браузера и шрифта.
     */
    const stubContentHeight = (element: HTMLElement, height: number) =>
      Object.defineProperty(element, 'clientHeight', {
        value: height,
        configurable: true,
      });

    test('без смонтированного контента height не проставляется', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        getFullscreenButton()!.click();
        await wrap(tick());

        expect(getContent()?.style.height).toBe('');
      }));

    test('Content получает высоту контента, измеренную до включения полноэкранного режима', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          fullscreenButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        stubContentHeight(getChildrenWrapper()!, 240);

        getFullscreenButton()!.click();
        await wrap(tick());

        expect(getContent()?.style.height).toBe('240px');
      }));

    test('height сбрасывается при выходе из полноэкранного режима', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expanded: true,
          fullscreenButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        stubContentHeight(getChildrenWrapper()!, 240);

        getFullscreenButton()!.click();
        await wrap(tick());
        expect(getContent()?.style.height).toBe('240px');

        getFullscreenButton()!.click();
        await wrap(tick());

        expect(getContent()?.style.height).toBe('');
      }));
  });

  describe('содержимое полноэкранного портала', () => {
    test('тулбар портала содержит Title и контент rightSide', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          rightSide: <span data-right>Справа</span>,
          fullscreen: true,
          children: 'Контент',
        });
        await wrap(tick());

        const toolbar = getFullscreenToolbar();

        expect(toolbar).toBeTruthy();
        expect(
          toolbar?.querySelector(`.${cnCollapse('Title')}`)?.textContent,
        ).toBe('Заголовок');
        expect(toolbar?.querySelector('[data-right]')).toBeTruthy();
      }));

    test('тулбар портала имеет нижнюю рамку', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(getFullscreenToolbar()).toHaveClass(
          ...cnToolbar({ border: 'bottom' }).split(' '),
        );
      }));

    test('контент рендерится в ChildrenWrapper портала', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });
        await wrap(tick());

        const portal = getFullscreenContainer();

        expect(
          portal?.querySelector(`.${cnCollapseFullscreen('ToolbarWrapper')}`),
        ).toBeTruthy();
        expect(getFullscreenChildrenWrapper()?.textContent).toContain(
          'Контент',
        );
      }));

    test('кнопка выхода в портале сворачивает фуллскрин', () =>
      context.start(async () => {
        const onFullscreen = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          fullscreen: true,
          onFullscreen,
          children: 'Контент',
        });
        await wrap(tick());

        expect(getFullscreenExitButton()).toBeTruthy();

        getFullscreenExitButton()!.click();
        await wrap(tick());

        expect(onFullscreen).toHaveBeenCalledTimes(1);
        expect(onFullscreen.mock.calls[0][0]).toBe(false);
        expect(getFullscreenContainer()).toBeNull();
      }));

    test('портал проставляет переменную высоты тулбара', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(
          getFullscreenContainer()?.style.getPropertyValue(
            '--collapse-toolbar-height',
          ),
        ).toMatch(/^\d+(\.\d+)?px$/);
      }));
  });

  describe('влияние полноэкранного режима на документ', () => {
    const bodyClass = cnCollapseFullscreen('Body');
    const scrollbarWidthVariable =
      '--ct-collapse-fullscreen-body-scrollbar-width';

    test('активный фуллскрин добавляет класс Body и переменную скроллбара', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreen: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(document.documentElement).toHaveClass(bodyClass);
        expect(
          document.documentElement.style.getPropertyValue(
            scrollbarWidthVariable,
          ),
        ).toMatch(/^\d+(\.\d+)?px$/);
      }));

    test('выход из полноэкранного режима снимает класс Body и переменную', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          fullscreen: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(document.documentElement).toHaveClass(bodyClass);

        getFullscreenButton()!.click();
        await wrap(tick());

        expect(document.documentElement).not.toHaveClass(bodyClass);
        expect(
          document.documentElement.style.getPropertyValue(
            scrollbarWidthVariable,
          ),
        ).toBe('');
      }));

    test('неактивный фуллскрин не меняет документ', () =>
      context.start(async () => {
        renderComponent({ leftSide: 'Заголовок', children: 'Контент' });
        await wrap(tick());

        expect(document.documentElement).not.toHaveClass(bodyClass);
        expect(
          document.documentElement.style.getPropertyValue(
            scrollbarWidthVariable,
          ),
        ).toBe('');
      }));
  });

  describe('событие клика в аргументах колбэка', () => {
    test('onExpand получает событие клика по кнопке', () =>
      context.start(async () => {
        const onExpand = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          onExpand,
          children: 'Контент',
        });
        await wrap(tick());

        const button = getExpandButton()!;
        button.click();

        const event = onExpand.mock.calls[0][1];

        expect(event.type).toBe('click');
        expect(event.target).toBe(button);
        expect(event.nativeEvent).toBeInstanceOf(MouseEvent);
      }));

    test('onFullscreen получает событие клика по кнопке', () =>
      context.start(async () => {
        const onFullscreen = vi.fn();

        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          onFullscreen,
          children: 'Контент',
        });
        await wrap(tick());

        const button = getFullscreenButton()!;
        button.click();

        const event = onFullscreen.mock.calls[0][1];

        expect(event.type).toBe('click');
        expect(event.target).toBe(button);
        expect(event.nativeEvent).toBeInstanceOf(MouseEvent);
      }));
  });

  describe('активное состояние кнопок тулбара', () => {
    test('иконка раскрытия повёрнута при раскрытом контенте', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          expandButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(
          getExpandIconSwitcher()?.style.getPropertyValue(
            '--animate-icon-direction',
          ),
        ).toBe('rotate(0deg)');

        getExpandButton()!.click();
        await wrap(tick());

        expect(
          getExpandIconSwitcher()?.style.getPropertyValue(
            '--animate-icon-direction',
          ),
        ).toBe('rotate(180deg)');
      }));

    test('иконка кнопки полноэкранного режима меняется на сворачивание при активном режиме', () =>
      context.start(async () => {
        renderComponent({
          leftSide: 'Заголовок',
          fullscreenButton: true,
          children: 'Контент',
        });
        await wrap(tick());

        expect(
          getFullscreenButton()?.querySelector('.IconExpand'),
        ).toBeTruthy();
        expect(
          getFullscreenButton()?.querySelector('.IconCollapse'),
        ).toBeNull();

        getFullscreenButton()!.click();
        await wrap(tick());

        expect(
          getFullscreenButton()?.querySelector('.IconCollapse'),
        ).toBeTruthy();
      }));
  });
});
