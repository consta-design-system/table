import {
  createRoot,
  testOutsideId,
  testRootId,
  testSuiteId,
  tick,
} from '@consta/uikit/__internal__/src/utils/vitest';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';
import { clearStack, context, top, wrap } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, expect, test, vi } from 'vitest';

import { cnDataCell } from '##/components/DataCell';

import { cnTextFieldCell, TextFieldCell } from '../TextFieldCell';

createRoot();
clearStack();

/**
 * testId - идентификатор data-testid, используемый для поиска компонента в тестах.
 */
const testId = cnTextFieldCell();

type AttachmentProps = React.ComponentProps<typeof TextFieldCell>;

const renderComponent = (props: AttachmentProps) => {
  const root = ReactDOM.createRoot(
    document.querySelector(`*[data-test-block=${testRootId()}]`)!,
  );

  act(() => {
    root.render(
      <reatomContext.Provider value={top()}>
        <Theme preset={presetGpnDefault}>
          <TextFieldCell data-testid={testId} {...props} />
        </Theme>
      </reatomContext.Provider>,
    );
  });
};

/**
 * Для типов number/textarea/textarray ComponentProps разворачивает generic
 * в тип с дефолтным значением 'string', поэтому типовые пропсы (min, rows,
 * value-массив и т.п.) недоступны. Хелпер обходит это ограничение.
 */
const renderComponentRaw = (props: Record<string, unknown>) => {
  renderComponent(props as unknown as AttachmentProps);
};

const getRender = () =>
  document.querySelector(
    `*[data-test-block=${testRootId()}] *[data-testid=${testId}]`,
  ) as HTMLDivElement;

/**
 * Проверяет, что в className элемента присутствуют все классы из переданной строки.
 * cn с модификаторами возвращает несколько классов через пробел,
 * поэтому нельзя использовать classList.contains напрямую.
 */
const hasClassName = (el: Element | null, className: string) =>
  !!el && className.split(' ').every((token) => el.classList.contains(token));

/** Обёртка TextField внутри ячейки (класс Field). */
const getField = () =>
  getRender().querySelector(`.${cnTextFieldCell('Field')}`);

/** Поле ввода в режиме редактирования. */
const getInput = () => getRender().querySelector('input') as HTMLInputElement;

/** Текстовая область в режиме редактирования (type=textarea). */
const getTextArea = () =>
  getRender().querySelector('textarea') as HTMLTextAreaElement;

const getOutside = () =>
  document.querySelector(
    `*[data-test-block=${testOutsideId()}]`,
  ) as HTMLDivElement;

const getSuite = () =>
  document.querySelector(
    `*[data-test-block=${testSuiteId()}]`,
  ) as HTMLDivElement;

/** Переключает ячейку в режим редактирования двойным кликом. */
const enterEditMode = async () => {
  fireEvent.doubleClick(getRender());
  await wrap(tick());
};

describe('Компонент TextFieldCell', () => {
  describe('рендер корневого элемента', () => {
    test('должен рендериться без ошибок и с базовым классом', () =>
      context.start(async () => {
        expect(() =>
          renderComponent({ type: 'text', value: 'Текст' }),
        ).not.toThrow();

        const render = getRender();

        expect(render).toBeTruthy();
        expect(hasClassName(render, cnTextFieldCell())).toBe(true);
        expect(render.tagName).toBe('DIV');
      }));

    test('должен пробрасывать className', () =>
      context.start(async () => {
        renderComponent({
          type: 'text',
          value: 'Текст',
          className: 'custom-class',
        });

        expect(getRender().className).toContain('custom-class');
      }));

    test('должен пробрасывать прочие атрибуты div через ...otherProps', () =>
      context.start(async () => {
        renderComponent({
          'type': 'text',
          'value': 'Текст',
          'aria-label': 'cell',
        });

        expect(getRender().getAttribute('aria-label')).toBe('cell');
      }));

    test('должен пробрасывать ref на корневой элемент', () =>
      context.start(async () => {
        const ref = React.createRef<HTMLDivElement>();

        renderComponent({ type: 'text', value: 'Текст', ref });

        expect(ref.current).toBe(getRender());
      }));

    test('по умолчанию используется размер m', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });

        expect(hasClassName(getRender(), cnTextFieldCell({ size: 'm' }))).toBe(
          true,
        );
      }));

    test('применяет модификатор размера s', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', size: 's' });

        const render = getRender();

        expect(hasClassName(render, cnTextFieldCell({ size: 's' }))).toBe(true);
        expect(hasClassName(render, cnTextFieldCell({ size: 'm' }))).toBe(
          false,
        );
      }));

    test('по умолчанию data-cell-edit-mode=false', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });

        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('false');
      }));

    test('не задаёт data-cell-status в режиме чтения', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', status: 'alert' });

        expect(getRender().getAttribute('data-cell-status')).toBeNull();
      }));
  });

  describe('режим чтения (read mode)', () => {
    test('должен рендерить значение как текст по умолчанию', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });

        expect(getRender().textContent).toContain('Текст');
      }));

    test('должен вызывать readModeRender со значением', () =>
      context.start(async () => {
        const readModeRender = vi.fn();

        renderComponent({ type: 'text', value: 'Текст', readModeRender });

        expect(readModeRender).toHaveBeenCalledWith('Текст');
      }));

    test('должен рендерить результат readModeRender', () =>
      context.start(async () => {
        renderComponent({
          type: 'text',
          value: 'Текст',
          readModeRender: (value) => <span data-read-mode>{value}</span>,
        });

        expect(getRender().querySelector('[data-read-mode]')).toBeTruthy();
      }));

    test('не должен рендерить TextField в режиме чтения', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });

        expect(getField()).toBeNull();
        expect(getInput()).toBeNull();
      }));

    test('не должен рендерить контент при отсутствии значения', () =>
      context.start(async () => {
        renderComponent({ type: 'text' });

        expect(
          getRender().querySelector(`.${cnDataCell('ContentSlot')}`),
        ).toBeNull();
      }));
  });

  describe('режим редактирования (edit mode)', () => {
    test('двойной клик переключает в режим редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('false');
        await wrap(enterEditMode());
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('true');
        expect(getField()).toBeTruthy();
        expect(getInput()).toBeTruthy();
      }));
    test('должен передавать значение в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });
        await wrap(enterEditMode());
        expect(getInput()?.value).toBe('Текст');
      }));
    test('должен фокусировать input при входе в режим редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });
        await wrap(enterEditMode());
        expect(document.activeElement).toBe(getInput());
      }));
    test('должен передавать placeholder в input', () =>
      context.start(async () => {
        renderComponent({
          type: 'text',
          value: 'Текст',
          placeholder: 'Введите значение',
        });
        await wrap(enterEditMode());
        expect(getInput()?.getAttribute('placeholder')).toBe(
          'Введите значение',
        );
      }));
    test('должен передавать disabled в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', disabled: true });
        await wrap(enterEditMode());
        expect(getInput()?.disabled).toBe(true);
      }));
    test('должен передавать maxLength в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', maxLength: 10 });
        await wrap(enterEditMode());
        expect(getInput()?.getAttribute('maxlength')).toBe('10');
      }));
    test('должен вызывать onChange при вводе', () =>
      context.start(async () => {
        const onChange = vi.fn();
        renderComponent({ type: 'text', value: 'Текст', onChange });
        await wrap(enterEditMode());
        fireEvent.change(getInput()!, { target: { value: 'Новое значение' } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe('Новое значение');
      }));
    test('клавиша Escape выходит из режима редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });
        await wrap(enterEditMode());
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('true');
        fireEvent.keyDown(getRender(), { key: 'Escape' });
        await wrap(tick());
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('false');
        expect(getInput()).toBeNull();
      }));
    test('клик вне ячейки выходит из режима редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });
        await wrap(enterEditMode());
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('true');
        // clickOutsideEffect слушает событие mousedown на document,
        // поэтому в тесте нужно диспатчить mouseDown, а не click
        fireEvent.mouseDown(getOutside());
        await wrap(tick());
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('false');
      }));
    test('readonly не позволяет войти в режим редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', readonly: true });
        await wrap(enterEditMode());
        expect(getRender().getAttribute('data-cell-edit-mode')).toBe('false');
        expect(getInput()).toBeNull();
      }));
    test('должен задавать data-cell-status в режиме редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', status: 'alert' });
        await wrap(enterEditMode());
        expect(getRender().getAttribute('data-cell-status')).toBe('alert');
      }));
    test('не должен передавать indicator в DataCell в режиме редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', indicator: 'alert' });
        expect(hasClassName(getRender(), cnDataCell({ indicator: true }))).toBe(
          true,
        );
        await wrap(enterEditMode());
        expect(hasClassName(getRender(), cnDataCell({ indicator: true }))).toBe(
          false,
        );
      }));
    test('должен рендерить textarea для type=textarea', () =>
      context.start(async () => {
        renderComponent({ type: 'textarea', value: 'Текст' });
        await wrap(enterEditMode());
        expect(getTextArea()).toBeTruthy();
      }));
    test('должен рендерить input с типом password для type=password', () =>
      context.start(async () => {
        renderComponent({ type: 'password', value: 'secret' });
        await wrap(enterEditMode());
        expect(getInput()?.getAttribute('type')).toBe('password');
      }));
  });

  describe('свойство inputRef', () => {
    test('должен вызывать inputRef с элементом input', () =>
      context.start(async () => {
        const inputRef = vi.fn();

        renderComponent({ type: 'text', value: 'Текст', inputRef });

        await wrap(enterEditMode());
        await wrap(tick());

        expect(inputRef).toHaveBeenCalled();
        expect(inputRef.mock.calls[0][0]).toBe(getInput());
      }));
  });

  describe('проброс свойств в DataCell', () => {
    test('должен передавать level в DataCell', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', level: 2 });

        expect(
          getRender().style.getPropertyValue('--table-data-cell-level'),
        ).toBe('2');
      }));

    test('должен передавать lineClamp в DataCell', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', lineClamp: 2 });

        expect(
          getRender().style.getPropertyValue('--table-data-cell-line-clamp'),
        ).toBe('2');
      }));

    test('должен передавать truncate в DataCell', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', truncate: true });

        const contentSlot = getRender().querySelector(
          `.${cnDataCell('ContentSlot')}`,
        );

        expect(
          hasClassName(
            contentSlot,
            cnDataCell('ContentSlot', { truncate: true }),
          ),
        ).toBe(true);
      }));

    test('должен передавать indicator в DataCell в режиме чтения', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', indicator: 'warning' });

        expect(hasClassName(getRender(), cnDataCell({ indicator: true }))).toBe(
          true,
        );
        expect(
          getRender().style.getPropertyValue(
            '--table-data-cell-indicator-color',
          ),
        ).toContain('warning');
      }));
  });

  describe('проброс атрибутов в input', () => {
    test('должен передавать id в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', id: 'cell-id' });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('id')).toBe('cell-id');
      }));

    test('должен передавать name в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', name: 'cell-name' });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('name')).toBe('cell-name');
      }));

    test('должен передавать minLength в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', minLength: 3 });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('minlength')).toBe('3');
      }));

    test('должен использовать defaultValue в input', () =>
      context.start(async () => {
        renderComponent({
          type: 'text',
          defaultValue: 'Значение по умолчанию',
        });

        await wrap(enterEditMode());

        expect(getInput()?.value).toBe('Значение по умолчанию');
      }));

    test('должен передавать autoComplete в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', autoComplete: 'off' });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('autocomplete')).toBe('off');
      }));

    test('должен передавать readOnly в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', readOnly: true });

        await wrap(enterEditMode());

        expect(getInput()?.readOnly).toBe(true);
      }));

    test('должен передавать tabIndex в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', tabIndex: 5 });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('tabindex')).toBe('5');
      }));

    test('должен передавать ariaLabel в input', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', ariaLabel: 'Ячейка' });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('aria-label')).toBe('Ячейка');
      }));
  });

  describe('события input', () => {
    test('должен вызывать onFocus при получении фокуса', () =>
      context.start(async () => {
        const onFocus = vi.fn();

        renderComponent({ type: 'text', value: 'Текст', onFocus });

        await wrap(enterEditMode());
        fireEvent.focus(getInput()!);

        expect(onFocus).toHaveBeenCalled();
      }));

    test('должен вызывать onBlur при потере фокуса', () =>
      context.start(async () => {
        const onBlur = vi.fn();

        renderComponent({ type: 'text', value: 'Текст', onBlur });

        await wrap(enterEditMode());
        fireEvent.blur(getInput()!);

        expect(onBlur).toHaveBeenCalled();
      }));

    test('должен вызывать onKeyDown при нажатии клавиши', () =>
      context.start(async () => {
        const onKeyDown = vi.fn();

        renderComponent({ type: 'text', value: 'Текст', onKeyDown });

        await wrap(enterEditMode());
        fireEvent.keyDown(getInput()!, { key: 'Enter' });

        expect(onKeyDown).toHaveBeenCalledTimes(1);
      }));

    test('должен вызывать onChange при вводе в textarea', () =>
      context.start(async () => {
        const onChange = vi.fn();

        renderComponent({ type: 'textarea', value: 'Текст', onChange });

        await wrap(enterEditMode());
        fireEvent.change(getTextArea()!, {
          target: { value: 'Новый текст' },
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe('Новый текст');
      }));
  });

  describe('элементы leftSide и rightSide', () => {
    test('должен рендерить leftSide внутри поля в режиме редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', leftSide: 'от' });

        await wrap(enterEditMode());

        expect(getField()?.textContent).toContain('от');
      }));

    test('должен рендерить rightSide внутри поля в режиме редактирования', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', rightSide: 'м²' });

        await wrap(enterEditMode());

        expect(getField()?.textContent).toContain('м²');
      }));

    test('не должен рендерить leftSide в режиме чтения', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', leftSide: 'от' });

        expect(getRender().textContent).not.toContain('от');
      }));
  });

  describe('тип number', () => {
    test('должен рендерить input с типом number', () =>
      context.start(async () => {
        renderComponent({ type: 'number', value: '42' });

        await wrap(enterEditMode());

        expect(getInput()?.getAttribute('type')).toBe('number');
      }));

    test('должен передавать min, max в input', () =>
      context.start(async () => {
        renderComponentRaw({
          type: 'number',
          value: '42',
          min: 0,
          max: 100,
          step: 5,
        });

        await wrap(enterEditMode());

        expect(getInput().getAttribute('min')).toBe('0');
        expect(getInput().getAttribute('max')).toBe('100');
      }));

    test('должен рендерить кнопки инкремента при incrementButtons', () =>
      context.start(async () => {
        renderComponentRaw({
          type: 'number',
          value: '42',
          incrementButtons: true,
        });

        await wrap(enterEditMode());

        expect(getField()?.querySelectorAll('button').length).toBeGreaterThan(
          0,
        );
      }));

    test('не должен рендерить кнопки инкремента без incrementButtons', () =>
      context.start(async () => {
        renderComponentRaw({ type: 'number', value: '42' });

        await wrap(enterEditMode());

        expect(getField()?.querySelectorAll('button').length).toBe(0);
      }));
  });

  describe('тип textarea', () => {
    test('должен передавать значение в textarea', () =>
      context.start(async () => {
        renderComponent({ type: 'textarea', value: 'Текст' });

        await wrap(enterEditMode());

        expect(getTextArea()?.value).toBe('Текст');
      }));

    test('должен передавать rows в textarea', () =>
      context.start(async () => {
        renderComponentRaw({ type: 'textarea', value: 'Текст', rows: 3 });

        await wrap(enterEditMode());

        expect(getTextArea()?.getAttribute('rows')).toBe('3');
      }));

    test('должен применять resize к textarea', () =>
      context.start(async () => {
        renderComponentRaw({ type: 'textarea', value: 'Текст', resize: true });

        await wrap(enterEditMode());

        expect(getField()).toHaveClass('TextFieldTypeTextArea_resize');
      }));
  });

  describe('тип textarray', () => {
    test('должен вызывать readModeRender с массивом значений', () =>
      context.start(async () => {
        const readModeRender = vi.fn();

        renderComponentRaw({
          type: 'textarray',
          value: ['один', 'два'],
          readModeRender,
        });

        expect(readModeRender).toHaveBeenCalledWith(['один', 'два']);
      }));

    test('должен рендерить значения массива в режиме чтения', () =>
      context.start(async () => {
        renderComponentRaw({
          type: 'textarray',
          value: ['один', 'два'],
          readModeRender: (value?: string[] | null) => value?.join(', '),
        });

        expect(getRender().textContent).toContain('один, два');
      }));

    test('должен рендерить элементы массива в поле в режиме редактирования', () =>
      context.start(async () => {
        renderComponentRaw({ type: 'textarray', value: ['один', 'два'] });

        await wrap(enterEditMode());

        expect(getField()?.textContent).toContain('один');
        expect(getField()?.textContent).toContain('два');
      }));

    test('должен передавать inputValue в input', () =>
      context.start(async () => {
        renderComponentRaw({
          type: 'textarray',
          value: ['один'],
          inputValue: 'новый',
        });

        await wrap(enterEditMode());

        expect(getInput()?.value).toBe('новый');
      }));

    test('должен вызывать onInputChange при вводе', () =>
      context.start(async () => {
        const onInputChange = vi.fn();

        renderComponentRaw({
          type: 'textarray',
          value: ['один'],
          onInputChange,
        });

        await wrap(enterEditMode());
        fireEvent.change(getInput()!, { target: { value: 'новый' } });

        expect(onInputChange).toHaveBeenCalledTimes(1);
        expect(onInputChange.mock.calls[0][0]).toBe('новый');
      }));
  });

  describe('кнопка очистки (clearButton)', () => {
    test('не должен рендерить кнопку очистки без clearButton', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст' });

        await wrap(enterEditMode());

        expect(getField()?.querySelector('button')).toBeNull();
      }));

    test('должен рендерить кнопку очистки при clearButton и значении', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', clearButton: true });

        await wrap(enterEditMode());

        expect(getField()?.querySelector('button')).toBeTruthy();
      }));

    test('клик по кнопке очистки вызывает onClear', () =>
      context.start(async () => {
        const onClear = vi.fn();

        renderComponent({
          type: 'text',
          value: 'Текст',
          clearButton: true,
          onClear,
        });

        await wrap(enterEditMode());

        const clearButton = getField()?.querySelector('button');

        expect(clearButton).toBeTruthy();

        fireEvent.click(clearButton!);

        expect(onClear).toHaveBeenCalledTimes(1);
      }));

    test('клик по кнопке очистки вызывает onChange со значением null', () =>
      context.start(async () => {
        const onChange = vi.fn();

        renderComponent({
          type: 'text',
          value: 'Текст',
          clearButton: true,
          onChange,
        });

        await wrap(enterEditMode());

        const clearButton = getField()?.querySelector('button');

        fireEvent.click(clearButton!);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBeNull();
      }));
  });

  describe('статус в режиме редактирования', () => {
    test('должен задавать data-cell-status=warning при status=warning', () =>
      context.start(async () => {
        renderComponent({ type: 'text', value: 'Текст', status: 'warning' });

        await wrap(enterEditMode());

        expect(getRender().getAttribute('data-cell-status')).toBe('warning');
      }));
  });
});
