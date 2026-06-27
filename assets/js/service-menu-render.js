(function () {
  'use strict';

  function createElement(tagName, className, textContent) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (textContent !== undefined && textContent !== null) {
      element.textContent = textContent;
    }

    return element;
  }

  function appendValue(target, value) {
    if (value && typeof value === 'object') {
      var span = createElement('span', value.review ? 'needs-review' : '', value.text || '');
      target.appendChild(span);
      return;
    }

    target.appendChild(document.createTextNode(value || ''));
  }

  function createTableRow(cells, isHeader) {
    var row = createElement(
      'div',
      'service-menu__table-row service-menu__table-row--' +
        cells.length +
        (isHeader ? ' service-menu__table-row--head' : '')
    );

    cells.forEach(function (cell, index) {
      var cellClass = 'service-menu__cell';

      if (index === 0) {
        cellClass += ' service-menu__cell--label';
      } else {
        cellClass += ' service-menu__cell--value';
      }

      var cellElement = createElement(isHeader ? 'div' : 'div', cellClass);
      appendValue(cellElement, cell);
      row.appendChild(cellElement);
    });

    return row;
  }

  function createTable(headers, rows) {
    var table = createElement('div', 'service-menu__table');

    if (Array.isArray(headers) && headers.length) {
      table.appendChild(createTableRow(headers, true));
    }

    rows.forEach(function (row) {
      table.appendChild(createTableRow(row, false));
    });

    return table;
  }

  function renderGroups(groups) {
    var fragment = document.createDocumentFragment();

    if (!Array.isArray(groups)) {
      return fragment;
    }

    groups.forEach(function (group) {
      var groupWrap = createElement('div', 'service-menu__group');

      if (group.title) {
        groupWrap.appendChild(createElement('div', 'service-menu__group-title', group.title));
      }

      if (group.text) {
        groupWrap.appendChild(createElement('p', 'service-menu__group-text', group.text));
      }

      if (Array.isArray(group.rows) && group.rows.length) {
        groupWrap.appendChild(createTable(group.headers || [], group.rows));
      }

      fragment.appendChild(groupWrap);
    });

    return fragment;
  }

  function renderTableCard(cardData) {
    var card = createElement('article', 'service-menu__card');
    var header = createElement('div', 'service-menu__card-header');

    header.appendChild(createElement('h3', 'service-menu__card-title', cardData.title));
    card.appendChild(header);

    if (Array.isArray(cardData.rows) && cardData.rows.length) {
      card.appendChild(createTable(cardData.headers || [], cardData.rows));
    }

    card.appendChild(renderGroups(cardData.groups));
    return card;
  }

  function renderListCard(cardData) {
    var card = createElement('article', 'service-menu__card service-menu__card--soft');
    var header = createElement('div', 'service-menu__card-header');

    header.appendChild(createElement('h3', 'service-menu__card-title', cardData.title));

    if (cardData.price) {
      header.appendChild(createElement('div', 'service-menu__price', cardData.price));
    }

    card.appendChild(header);

    if (cardData.subtitle) {
      card.appendChild(createElement('p', 'service-menu__subtitle', cardData.subtitle));
    }

    var list = createElement('ul', 'service-menu__list');
    cardData.items.forEach(function (item) {
      var listItem = createElement('li', 'service-menu__list-item');
      appendValue(listItem, item);
      list.appendChild(listItem);
    });
    card.appendChild(list);
    card.appendChild(renderGroups(cardData.groups));

    return card;
  }

  function renderShapesCard(cardData) {
    var card = createElement('article', 'service-menu__card');
    var header = createElement('div', 'service-menu__card-header');

    header.appendChild(createElement('h3', 'service-menu__card-title', cardData.title));
    card.appendChild(header);

    var shapes = createElement('div', 'service-menu__shapes');
    cardData.shapes.forEach(function (shape) {
      shapes.appendChild(createElement('div', 'service-menu__shape', shape));
    });

    card.appendChild(shapes);
    card.appendChild(renderGroups(cardData.groups));
    return card;
  }

  function renderCard(cardData) {
    if (cardData.type === 'list') {
      return renderListCard(cardData);
    }

    if (cardData.type === 'shapes') {
      return renderShapesCard(cardData);
    }

    return renderTableCard(cardData);
  }

  function renderSection(sectionData) {
    var section = createElement('section', 'service-menu__section');
    section.id = sectionData.id;

    var header = createElement('div', 'service-menu__section-header');
    header.appendChild(createElement('h2', 'service-menu__section-title', sectionData.title));

    if (sectionData.note) {
      header.appendChild(createElement('div', 'service-menu__section-note', sectionData.note));
    }

    section.appendChild(header);

    var grid = createElement(
      'div',
      'service-menu__grid service-menu__grid--' + (sectionData.columns || 2)
    );

    sectionData.cards.forEach(function (cardData) {
      grid.appendChild(renderCard(cardData));
    });

    section.appendChild(grid);
    return section;
  }

  function renderSectionNav(sections) {
    var nav = createElement('nav', 'service-menu__nav');
    nav.setAttribute('aria-label', 'Service menu sections');

    sections.forEach(function (section) {
      var link = createElement('a', 'service-menu__nav-link', section.title);
      link.href = '#' + section.id;
      nav.appendChild(link);
    });

    return nav;
  }

  function renderIntro(data) {
    var intro = createElement('div', 'service-menu__intro');
    intro.appendChild(createElement('p', 'service-menu__eyebrow', data.business.name));
    intro.appendChild(createElement('p', 'service-menu__lead', data.business.description));
    intro.appendChild(renderSectionNav(data.sections));
    return intro;
  }

  function renderServiceMenu() {
    var menuData = window.SERVICE_MENU_DATA;
    var root = document.getElementById('service-menu-root');

    if (!root || !menuData || !Array.isArray(menuData.sections)) {
      return;
    }

    root.innerHTML = '';

    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderIntro(menuData));

    menuData.sections.forEach(function (sectionData) {
      fragment.appendChild(renderSection(sectionData));
    });

    root.appendChild(fragment);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderServiceMenu);
  } else {
    renderServiceMenu();
  }
})();
