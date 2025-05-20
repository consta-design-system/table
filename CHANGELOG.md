# Changelog

## v0.5.0 (20/05/2025)
Самое важное:
- повысили производительность компонента `Table`,
- добавили возможность виртуального горизонтального скролла.

breaking changes:
- новый тип `virtualScroll` в `Table` может вызвать "прыжки" строк, если использовали значение `true`. Чтобы решить эту проблему, замените на `[false, true]`. Подробнее в документации.
-  у пакета изменен `peerDependencies` . Обновите/установите зависимости.

---

- [feat(Table): add horizontal virtual scroll (#21)](https://github.com/consta-design-system/table/commit/6251cc1818d10ca1e8d293a84ed70c65dbe5fbeb) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.4.0 (18/12/2024)
Самое важное:
- В `Table` добавили выделение строки при наведении и выборе.

---

- [feat(Table): add active row state (#17)](https://github.com/consta-design-system/table/commit/56e2bc0462b934669c90ea45b3de47f2b83092b3) - [@gizeasy](https://github.com/gizeasy)
- [docs(Table): add info about headerZIndex (#16)](https://github.com/consta-design-system/table/commit/4d9c9c4e652ee63abfb254f6fbc83e868fdbadf2) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.3.0 (19/11/2024)
Самое важное:
- Добавили пример использования индикаторов ячеек и всплывающих подсказок.
- Добавили пример адаптивной ширины колонок в зависимости от ширины таблицы.
- Добавили компонент `DataNumberingCell` для вывода нумерации.

---

- [docs(Table): add indicator example (#14)](https://github.com/consta-design-system/table/commit/5874ce5be10e0ad369f1e3623a52347f7b4a6d4f) - [@gizeasy](https://github.com/gizeasy)
- [docs(Table): add adaptive columns example (#12)](https://github.com/consta-design-system/table/commit/bf1f115d6c6258fd1d3d1fd662dff9007f7ca471) - [@gizeasy](https://github.com/gizeasy)
- [fix(Table): fixed calculate columns widths (#13)](https://github.com/consta-design-system/table/commit/fa93073af7d90c2a8db7b42752eaa257d8aa50bc) - [@gizeasy](https://github.com/gizeasy)
- [feat(DataNumberingCell): add component (#9)](https://github.com/consta-design-system/table/commit/1333f98f71c7f471a29baa1d79ad387eb294bee9) - [@gizeasy](https://github.com/gizeasy)
- [fix: remove width on cell (#11)](https://github.com/consta-design-system/table/commit/565540394b8280c12df26ac660c8ff31005c5eef) - [@gizeasy](https://github.com/gizeasy)
- [docs: fixed import path (#10)](https://github.com/consta-design-system/table/commit/35b563d69a1439ec8545fc899a9fd9561cd6cc7c) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.2.0 (02/11/2024)
Самое важное:
- В `Table` добавили возможность объединять ячейки по горизонтали.
 
---

- [fix(Table): resizing on touch devices (#7)](https://github.com/consta-design-system/table/commit/bd3e8ba9404120a6e1073e40873e61337d4cba12) - [@gizeasy](https://github.com/gizeasy)
- [feat(Table): add colSpan (#6)](https://github.com/consta-design-system/table/commit/c06a61df25d7e0e0a7bac8ba8e5e8a7f758e92d8) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.1.0 (23/10/2024)
- [feat(Talbe): add getRowKey (#5)](https://github.com/consta-design-system/table/commit/78e9c07ee18a536f79461dd17bf482998e7b87c3) - [@gizeasy](https://github.com/gizeasy)
- [docs(start.stand.mdx): update (#4)](https://github.com/consta-design-system/table/commit/f5ac07c52d4d41b877544a9a20825728ac5115b1) - [@alyonurchick1](https://github.com/alyonurchick1)

--------------------

## v0.0.1 (31/07/2024)
🚀 Встречайте новую библиотеку **Consta Table** 🚀

Раньше компонент Table был частью библиотеки UI-kit. Теперь Consta Table — это самостоятельная библиотека, которая позволяет работать с таблицами более гибко и эффективно.

**Основные преимущества Consta Table**:

- **Расширенные возможности кастомизации**: настраиваемые компоненты в таблице, ручная настройка необходимых функций.
- **Новые функции**: закрепление и разделение столбцов, гибкая настройка ширины столбцов и другие фичи.
- **Повышенная производительность**: менее ресурсоемкий код и более быстрая работа.
- А ещё мы учли ваши пожелания и оптимизировали работу виртуального скролла, многоуровневой шапки и многих других функций!

Знакомьтесь с новой библиотекой в [GitHub](https://github.com/consta-design-system/table), [Figma](https://www.figma.com/community/file/1400418955050098928/consta-table) и на [Портале Consta](https://consta.design/libs/table).

⚠️ [Старые таблицы](https://consta.design/libs/uikit/components-table-stable) будут помечены как устаревшие (deprecated). Переходите на Consta Table для улучшения производительности и гибкости ваших проектов!

Спасибо, что вы с нами! Желаем приятной и успешной работы с Consta Table 💙