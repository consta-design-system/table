# Changelog

## v0.8.1 (20/05/2026)
- [fix(Table): table pinned (#41)](https://github.com/consta-design-system/table/commit/265e0c3fe7f26ec0023ec3e79eccb2716c5e9e5e) - [@ShavrinAleksei](https://github.com/ShavrinAleksei)
- [chore(linters): update stylelint, enable linters in github actions (#39)](https://github.com/consta-design-system/table/commit/37c142edcc6373e143d0ae8208faaedcd0f8edc8) - [@baevm](https://github.com/baevm)

--------------------

## v0.8.0 (30/01/2026)
Самое важное:
- Добавили `TextFieldCell` - компонет редактирования текста в ячейках.

---

- [feat(TextFieldCell): add component (#37)](https://github.com/consta-design-system/table/commit/a3c777c6ccab975516eed61219586a86e1a59941) - [@gizeasy](https://github.com/gizeasy)
- [chore(deps): remove unused deps `eslint-plugin-id-match`, `react-test-renderer`, `typescript-eslint-parser` (#38)](https://github.com/consta-design-system/table/commit/90f3f0ecd1adc777c8daa9011a9ca5facd370a7c) - [@baevm](https://github.com/baevm)

--------------------

## v0.7.3 (04/12/2025)
Самое важное:
Исправили некорректный расчет ширины колонок, из-за которого на некоторых системах могла появляться полоса прокрутки шириной 1 пиксель.

---

- [fix(Table): width cell (#35)](https://github.com/consta-design-system/table/commit/ee333f0388c667a0cc8a3217a1af2639be6b7fdc) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.7.2 (06/11/2025)
Самое важное:
- Добавили примеры с фильтрацией таблицы
- Добавили примеры с состоянием загрузки

---

- [docs(Table): filter (#32)](https://github.com/consta-design-system/table/commit/0ba1d50213c65bf623446708d84c634b3c0fdd73) - [@gizeasy](https://github.com/gizeasy)
- [docs(Table): added loading state examples (#31)](https://github.com/consta-design-system/table/commit/402e0414f2ee4fc8e66ab05ddbb8d49e3f01df8b) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.7.1 (20/10/2025)
- [fix(Table): fixed scroll](https://github.com/consta-design-system/table/commit/bd21579a45d51afed625c2ca6ce4b323f949fb29) - [@gizeasy](https://github.com/gizeasy)
- [docs(Table): fixed virtualScroll example](https://github.com/consta-design-system/table/commit/7d65ceaf22d454ab6c04b37f8142bc1d3f41ddf3) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.7.0 (01/08/2025)
Самое главное:

- В `Table` добавили событие `onScrollToBottom`, для отслеживания скрола до конца.
- Добавили компонент `Collapse`, для сворачивания таблицы

---

- [feat(Collapse): add component (#30)](https://github.com/consta-design-system/table/commit/bcc7dcd387b7f13b98e0722cc90d9f92d14e6251) - [@gizeasy](https://github.com/gizeasy)
- [docs: implementation of editorial policy (#26)](https://github.com/consta-design-system/table/commit/4489364a63f0ed13cced67cb5c3684ab589ab662) - [@alyonurchick1](https://github.com/alyonurchick1)
- [feat(Table): add onScrollToBottom (#28)](https://github.com/consta-design-system/table/commit/2ace8d79828b6026c4a00d63b7321bff87bb2e72) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.6.1 (11/06/2025)
- [feat: update react types (#27)](https://github.com/consta-design-system/table/commit/abdbeee8ef6c0c40629999396696f14b2ed20581) - [@gizeasy](https://github.com/gizeasy)
- [docs(Toolbar): fix example (#25)](https://github.com/consta-design-system/table/commit/c3badb9c9c4183aac4ac1c85e8aed6556f392401) - [@gizeasy](https://github.com/gizeasy)

--------------------

## v0.6.0 (28/05/2025)
Самое важное:
- Добавили компонент `Pagination` для реализации постраничной навигации.
- Добавили компонент `Toolbar` для составления панелей управления таблицы.

---

- [feat(Pagination): add component (#23)](https://github.com/consta-design-system/table/commit/379f25690ea14b9021b383ec5c07d45ec6b85724) - [@gizeasy](https://github.com/gizeasy)
- [chore: update builder](https://github.com/consta-design-system/table/commit/6df1941b28086d27d1fc83c1eaa01d38c05048f3) - [@gizeasy](https://github.com/gizeasy)
- [feat(Toolbar): add component (#22)](https://github.com/consta-design-system/table/commit/b801deb5c3bc0ffe87fb6474c6bd89452c561444) - [@gizeasy](https://github.com/gizeasy)
- [chore: update builder](https://github.com/consta-design-system/table/commit/927b5adf02b3fcbd3ade23b275a8f91cafc55856) - [@gizeasy](https://github.com/gizeasy)

--------------------

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