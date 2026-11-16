import { describe, expect, it } from 'vitest';

import {
  addResult,
  getCalculatedSizes,
  getContainerWidth,
  getResizeResult,
  isSizesCalculate,
  minMax,
  sizesEq,
} from '../TableBody/model/helpers';
import { ResizableColumnsBlock } from '../TableBody/model/types';

const createBlock = (
  accessor: string | undefined,
  minWidth?: number,
  maxWidth?: number,
): ResizableColumnsBlock => ({
  element: null,
  accessor,
  minWidth,
  maxWidth,
});

const createContainer = (width = 300) => {
  const el = document.createElement('div');

  el.style.position = 'fixed';
  el.style.left = '100px';
  el.style.width = `${width}px`;
  el.style.height = '10px';

  document.body.appendChild(el);

  return el;
};

const mouseEventAt = (clientX: number) =>
  new MouseEvent('mousemove', { clientX, clientY: 0 });

describe('helpers TableBody/model', () => {
  describe('minMax', () => {
    it('возвращает значение без изменений, если оно в диапазоне', () => {
      expect(minMax(10, 100, 50)).toBe(50);
    });

    it('клампит значение по min, если оно меньше min', () => {
      expect(minMax(10, 100, 5)).toBe(10);
    });

    it('клампит значение по max, если оно больше max', () => {
      expect(minMax(10, 100, 150)).toBe(100);
    });

    it('клампит по min, если задан только min', () => {
      expect(minMax(10, undefined, 5)).toBe(10);
      expect(minMax(10, undefined, 50)).toBe(50);
    });

    it('клампит по max, если задан только max', () => {
      expect(minMax(undefined, 100, 150)).toBe(100);
      expect(minMax(undefined, 100, 50)).toBe(50);
    });

    it('возвращает значение без изменений, если min и max не заданы', () => {
      expect(minMax(undefined, undefined, 42)).toBe(42);
    });

    it('возвращает max, если значение не число и max === min', () => {
      expect(minMax(100, 100, undefined)).toBe(100);
    });

    it('возвращает значение, если оно не число и max !== min', () => {
      expect(minMax(10, 100, undefined)).toBe(undefined);
      expect(minMax(undefined, 100, undefined)).toBe(undefined);
    });
  });

  describe('sizesEq', () => {
    it('возвращает true для одинаковых размеров', () => {
      expect(sizesEq([100, 200], [100, 200])).toBe(true);
      expect(sizesEq([100, '200px'], [100, '200px'])).toBe(true);
      expect(sizesEq([100, undefined], [100, undefined])).toBe(true);
    });

    it('возвращает false для разных размеров', () => {
      expect(sizesEq([100, 200], [200, 100])).toBe(false);
      expect(sizesEq([100, 200], [100, 300])).toBe(false);
    });

    it('возвращает false для разной длины', () => {
      expect(sizesEq([100, 200], [100])).toBe(false);
    });
  });

  describe('getContainerWidth', () => {
    it('возвращает ширину элемента без дробной части', () => {
      const container = createContainer(300);

      expect(getContainerWidth(container)).toBe(300);

      container.remove();
    });

    it('возвращает undefined для отсутствующего элемента', () => {
      expect(getContainerWidth(null)).toBe(undefined);
      expect(getContainerWidth(undefined)).toBe(undefined);
    });
  });

  describe('isSizesCalculate', () => {
    it('возвращает true, если все размеры числа', () => {
      expect(isSizesCalculate([100, 200])).toBe(true);
      expect(isSizesCalculate([])).toBe(true);
    });

    it('возвращает false, если есть строка', () => {
      expect(isSizesCalculate([100, '200px'])).toBe(false);
    });

    it('возвращает false, если есть undefined', () => {
      expect(isSizesCalculate([100, undefined])).toBe(false);
    });
  });

  describe('addResult', () => {
    it('подставляет значения по индексам, сохраняя остальные', () => {
      expect(
        addResult<number>(
          [
            [0, 300],
            [2, 100],
          ],
          [10, 20, 30, 40],
        ),
      ).toEqual([300, 20, 100, 40]);
    });

    it('возвращает те же размеры, если результатов нет', () => {
      expect(addResult<number>([], [10, 20])).toEqual([10, 20]);
    });

    it('не мутирует исходный массив', () => {
      const sizes = [10, 20, 30];

      addResult<number>([[1, 50]], sizes);

      expect(sizes).toEqual([10, 20, 30]);
    });
  });

  describe('getResizeResult', () => {
    it('возвращает ширину только для колонок с accessor', () => {
      const blocks = [
        createBlock('first'),
        createBlock(undefined),
        createBlock('third'),
      ];

      expect(getResizeResult(blocks, [100, 200, 300])).toEqual([
        { accessor: 'first', width: 100 },
        { accessor: 'third', width: 300 },
      ]);
    });

    it('исключает колонки с нечисловым размером', () => {
      const blocks = [createBlock('first'), createBlock('second')];

      expect(getResizeResult(blocks, [100, '200px'])).toEqual([
        { accessor: 'first', width: 100 },
      ]);
      expect(getResizeResult(blocks, [100, undefined])).toEqual([
        { accessor: 'first', width: 100 },
      ]);
    });

    it('возвращает пустой массив без колонок с accessor', () => {
      expect(getResizeResult([createBlock(undefined)], [100])).toEqual([]);
    });
  });

  describe('getCalculatedSizes', () => {
    let container: HTMLDivElement;

    const setup = (width = 300) => {
      container = createContainer(width);
    };

    const teardown = () => {
      container.remove();
    };

    it('возвращает [], если позиция события не определена', () => {
      setup();

      // clientX = 0 — falsy-позиция, расчёт не выполняется
      const result = getCalculatedSizes(
        mouseEventAt(0),
        0,
        [createBlock('first', 100, 200)],
        container,
        [100],
        'inside',
      );

      expect(result).toEqual([]);

      teardown();
    });

    it('режим outside: ширина колонки доводится до ширины контейнера', () => {
      setup();

      // value = clientX(220) - containerLeft(100) - предыдущие размеры(0) = 120
      const result = getCalculatedSizes(
        mouseEventAt(220),
        0,
        [createBlock('first', 100, 200), createBlock('second', 50, 100)],
        container,
        [100, 100],
        'outside',
      );

      // сумма 120 + 100 меньше 300, поэтому колонка растягивается до 300 - 100
      expect(result).toEqual([[0, 200]]);

      teardown();
    });

    it('режим outside: значение клампится по max колонки', () => {
      setup();

      const result = getCalculatedSizes(
        mouseEventAt(400),
        0,
        [createBlock('first', 100, 200), createBlock('second', 50, 100)],
        container,
        [150, 150],
        'outside',
      );

      // сумма 350 больше 300, колонка не меняется, кроме клампинга по max
      expect(result).toEqual([[0, 200]]);

      teardown();
    });

    it('учитывает scrollLeft контейнера', () => {
      setup();

      Object.defineProperty(container, 'scrollLeft', {
        configurable: true,
        value: 50,
      });

      // value = clientX(350) + scrollLeft(50) - containerLeft(100) - предыдущие размеры(150) = 150
      const result = getCalculatedSizes(
        mouseEventAt(350),
        1,
        [createBlock('first', 100, 200), createBlock('second', 50, 100)],
        container,
        [150, 100],
        'outside',
      );

      // guard = 100 (клампинг по max), сумма 250 < 300 → 300 - 150
      expect(result).toEqual([[1, 150]]);

      teardown();
    });

    it('режим inside: соседняя колонка компенсирует изменение так, что сумма равна ширине контейнера', () => {
      setup();

      // value = clientX(300) - containerLeft(100) = 200
      const result = getCalculatedSizes(
        mouseEventAt(300),
        0,
        [createBlock('first', 100, 200), createBlock('second', 50, 100)],
        container,
        [150, 150],
        'inside',
      );

      expect(result).toEqual([
        [0, 200],
        [1, 100],
      ]);

      teardown();
    });

    it('режим inside: возвращает [], если скомпенсировать сумму невозможно', () => {
      setup();

      // value = clientX(250) - containerLeft(100) = 150
      const result = getCalculatedSizes(
        mouseEventAt(250),
        0,
        [createBlock('first', 100, 200), createBlock('second', 50, 100)],
        container,
        [100, 100],
        'inside',
      );

      // соседняя колонка ограничена max = 100, сумму 150 + 100 не довести до 300
      expect(result).toEqual([]);

      teardown();
    });

    it('режим inside: нечисловые размеры считаются как 0', () => {
      setup();

      // value = clientX(300) - containerLeft(100) = 200
      const result = getCalculatedSizes(
        mouseEventAt(300),
        0,
        [
          createBlock('first', 100, 200),
          createBlock(undefined),
          createBlock('third', 50, 100),
        ],
        container,
        [150, undefined, 50],
        'inside',
      );

      // нечисловой размер → 0, третья колонка забирает 300 - 200 - 0
      expect(result).toEqual([
        [0, 200],
        [2, 100],
      ]);

      teardown();
    });

    it('режим inside: возвращает текущее значение, если оно совпадает со значением соседней колонки', () => {
      setup();

      // value = clientX(250) - containerLeft(100) = 150
      const result = getCalculatedSizes(
        mouseEventAt(250),
        0,
        [createBlock('first', 50, 200), createBlock('second', 100, 200)],
        container,
        [150, 150],
        'inside',
      );

      // следующее значение (150) равно текущему (150), компенсация невозможна
      expect(result).toEqual([[0, 150]]);

      teardown();
    });
  });
});
