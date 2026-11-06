import {
  createRoot,
  testRootId,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { cnText } from '@consta/uikit/Text';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test, vi } from 'vitest';

import { cn } from '../../../utils/bem';
import { Pagination } from '../Pagination';

createRoot();
clearStack();

const cnPagination = cn('Pagination');

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnPagination();

type AttachmentProps = React.ComponentProps<typeof Pagination>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <Pagination data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLElement;

const getOffsetLabel = () =>
  getRender().querySelector(`.${cnPagination('OffsetLabel')}`) as HTMLElement;

const getSelect = () =>
  getRender().querySelector(`.${cnPagination('Select')}`) as HTMLElement;

/**
 * Рендерит компонент и возвращает refs кнопок «вперёд»/«назад»,
 * чтобы взаимодействовать с ними напрямую (без зависимости от структуры Button).
 */
const renderWithButtons = (props: AttachmentProps) => {
  const buttonPrevRef = React.createRef<HTMLButtonElement>();
  const buttonNextRef = React.createRef<HTMLButtonElement>();

  renderComponent({
    buttonPrevRef,
    buttonNextRef,
    ...props,
  });

  return { buttonPrevRef, buttonNextRef };
};

describe('Компонент Pagination', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() => renderComponent({})).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(render.tagName).toBe('DIV');
        expect(render.className).toContain(cnPagination());
      }));

    test('должен выравнивать содержимое через MixFlex align=center', () =>
      context.start(async () => {
        renderComponent({});

        expect(
          hasClassName(getRender(), cnMixFlex({ align: 'center', gap: 'xl' })),
        ).toBe(true);
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({ className: 'custom-class' });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({ 'aria-label': 'pagination' });

        expect(getRender().getAttribute('aria-label')).toBe('pagination');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ ref });

        expect(ref.current).toBe(getRender());
      }));
  });

  describe('свойство label (текст слева)', () => {
    test('по умолчанию используется текст «Строк на странице»', () =>
      context.start(async () => {
        renderComponent({});

        expect(getRender().textContent).toContain('Строк на странице');
      }));

    test('должен рендерить переданный текст label', () =>
      context.start(async () => {
        renderComponent({ label: 'Показывать по:' });

        expect(getRender().textContent).toContain('Показывать по:');
        expect(getRender().textContent).not.toContain('Строк на странице');
      }));

    test('должен рендерить label через Text с размером s и view secondary', () =>
      context.start(async () => {
        renderComponent({ label: 'Показывать по:' });

        const text = Array.from(getRender().querySelectorAll('*')).find(
          (el) =>
            hasClassName(el, cnText({ size: 's' })) &&
            hasClassName(el, cnText({ view: 'secondary' })) &&
            el.textContent === 'Показывать по:',
        );

        expect(text).toBeTruthy();
      }));

    test('не должен рендерить текст слева при пустом label', () =>
      context.start(async () => {
        renderComponent({ label: '' });

        expect(getRender().textContent).not.toContain('Строк на странице');
      }));
  });

  describe('свойства step и steps (шаги)', () => {
    test('по умолчанию текущий шаг равен 10', () =>
      context.start(async () => {
        renderComponent({});

        expect(getSelect().textContent).toContain('10');
      }));

    test('должен показывать выбранный step в Select', () =>
      context.start(async () => {
        renderComponent({ step: 25 });

        expect(getSelect().textContent).toContain('25');
      }));
  });

  describe('свойство offsetLabel (текст текущей позиции)', () => {
    test('по умолчанию без total выводит формат «from-to»', () =>
      context.start(async () => {
        renderComponent({ offset: 0, step: 10 });

        expect(getOffsetLabel().textContent).toBe('1-10');
      }));

    test('по умолчанию с total выводит формат «from-to из total»', () =>
      context.start(async () => {
        renderComponent({ offset: 0, step: 100, total: 300 });

        expect(getOffsetLabel().textContent).toBe('1-100 из 300');
      }));

    test('не должен превышать total в тексте позиции', () =>
      context.start(async () => {
        renderComponent({ offset: 290, step: 100, total: 300 });

        expect(getOffsetLabel().textContent).toBe('291-300 из 300');
      }));

    test('должен рендерить строку offsetLabel как есть', () =>
      context.start(async () => {
        renderComponent({ offsetLabel: 'Позиция' });

        expect(getOffsetLabel().textContent).toBe('Позиция');
      }));

    test('должен вызывать offsetLabel-функцию с (offset, step, total)', () =>
      context.start(async () => {
        const offsetLabel = vi.fn((offset, step) => `${offset}-${step}`);

        renderComponent({ offset: 10, step: 20, total: 100, offsetLabel });

        expect(offsetLabel).toHaveBeenCalledWith(10, 20, 100);
        expect(getOffsetLabel().textContent).toBe('10-20');
      }));
  });

  describe('обработка отступа (offset/onChange)', () => {
    test('клик по кнопке «вперёд» увеличивает отступ на шаг и вызывает onChange', () =>
      context.start(async () => {
        const onChange = vi.fn();
        const { buttonNextRef } = renderWithButtons({
          offset: 0,
          step: 10,
          onChange,
        });

        buttonNextRef.current?.click();

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe(10);
        expect(onChange.mock.calls[0][1]).toHaveProperty('e');
      }));

    test('клик по кнопке «назад» уменьшает отступ на шаг и вызывает onChange', () =>
      context.start(async () => {
        const onChange = vi.fn();
        const { buttonPrevRef } = renderWithButtons({
          offset: 30,
          step: 10,
          onChange,
        });

        buttonPrevRef.current?.click();

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe(20);
      }));

    test('не позволяет отступу стать отрицательным без total', () =>
      context.start(async () => {
        const onChange = vi.fn();
        const { buttonPrevRef } = renderWithButtons({
          offset: 5,
          step: 10,
          onChange,
        });

        buttonPrevRef.current?.click();

        expect(onChange).toHaveBeenCalledWith(0, expect.anything());
      }));

    test('кнопка «назад» недоступна при offset <= 0', () =>
      context.start(async () => {
        const onChange = vi.fn();
        const { buttonPrevRef } = renderWithButtons({ offset: 0, onChange });

        expect(buttonPrevRef.current?.disabled).toBe(true);
        buttonPrevRef.current?.click();
        expect(onChange).not.toHaveBeenCalled();
      }));

    test('при total не позволяет отступу уйти ниже нуля', () =>
      context.start(async () => {
        const onChange = vi.fn();
        const { buttonPrevRef } = renderWithButtons({
          offset: 5,
          step: 10,
          total: 30,
          onChange,
        });

        buttonPrevRef.current?.click();

        // 5 - 10 = -5, но ограничено нулём снизу
        expect(onChange).toHaveBeenCalledWith(0, expect.anything());
      }));
  });

  describe('свойство total (всего элементов)', () => {
    test('кнопка «вперёд» недоступна на последней странице', () =>
      context.start(async () => {
        const onChange = vi.fn();
        const { buttonNextRef } = renderWithButtons({
          offset: 200,
          step: 100,
          total: 300,
          onChange,
        });

        expect(buttonNextRef.current?.disabled).toBe(true);
        buttonNextRef.current?.click();
        expect(onChange).not.toHaveBeenCalled();
      }));

    test('кнопка «вперёд» доступна, если страница не последняя', () =>
      context.start(async () => {
        const { buttonNextRef } = renderWithButtons({
          offset: 0,
          step: 100,
          total: 300,
        });

        expect(buttonNextRef.current?.disabled).toBe(false);
      }));

    test('кнопка «вперёд» недоступна, когда шаг больше оставшихся элементов', () =>
      context.start(async () => {
        const { buttonNextRef } = renderWithButtons({
          offset: 0,
          step: 100,
          total: 30,
        });

        expect(buttonNextRef.current?.disabled).toBe(true);
      }));
  });
});

/**
 * Проверяет, что в className элемента присутствуют все классы из переданной строки.
 * cn с модификаторами возвращает несколько классов через пробел,
 * поэтому нельзя использовать classList.contains напрямую.
 */
const hasClassName = (el: Element, className: string) =>
  className.split(' ').every((token) => el.classList.contains(token));
