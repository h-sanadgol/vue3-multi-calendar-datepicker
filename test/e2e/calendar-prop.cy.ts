describe('calendar prop', () => {
  after(() => {
    cy.changeProps({}, null, true);
  });

  it('allows Gregorian rendering independently of the Persian locale', () => {
    cy.changeProps({
      locale: 'fa',
      calendar: 'gregorian',
      from: '2020',
      to: '2021',
    });

    cy.get('.pdp-input').focus();
    cy.get('.pdp-year').first().should('contain.text', '2021');
    cy.get('.pdp-month').first().should('not.contain.text', 'فروردین');
  });

  it('selects the calendar-native locale when locale is omitted', () => {
    cy.changeProps({ calendar: 'hijri', from: '1446', to: '1447' }, null, true);
    cy.get('.pdp-input').focus();
    cy.get('.pdp-picker').should('have.class', 'rtl');
    cy.get('.pdp-month').first().should('not.contain.text', 'January');
  });

  it('keeps explicit locale translation in control of the picker', () => {
    cy.changeProps(
      { calendar: 'gregorian', locale: 'en', from: '2020', to: '2021' },
      null,
      true,
    );
    cy.get('.pdp-input').focus();
    cy.get('.pdp-picker').should('have.class', 'ltr');
    cy.get('.pdp-month').first().should('contain.text', 'March');
  });

  it('supports calendar-specific week starts and weekly holidays', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        from: '2021',
        to: '2021',
        weekStartsOn: 1,
        weekendDays: [0],
      },
      null,
      true,
    );
    cy.get('.pdp-input').focus();
    cy.get('.pdp-weekday').first().should('contain.text', 'Mo');
    cy.get('.pdp-day.weekend').should('have.length.greaterThan', 0);
  });

  it('serializes modelValue in an explicitly selected calendar', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        modelCalendar: 'gregorian',
        mode: 'single',
        model: '1446/10/06',
      },
      null,
      true,
    );

    cy.get('.show').should('contain.text', '2025-04-04');
  });

  it('keeps the active calendar as the compatibility default for modelValue', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        mode: 'single',
        model: '1446/10/06',
      },
      null,
      true,
    );

    cy.get('.show').should('contain.text', '1446-10-06');
  });

  context('format contract', () => {
    before(() => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          from: '2020',
          to: '2030',
          format: 'YYYY/MM/DD',
          inputFormat: 'DD.MM.YYYY',
          mode: 'single',
          model: '2025-04-04',
        },
        null,
        true,
      );
    });

    it('keeps model and input formats independent', () => {
      cy.get('.pdp-input').should('have.value', '04.04.2025');
      cy.get('.show').should('contain.text', '2025/04/04');
    });
  });

  context('manual input synchronization', () => {
    before(() => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          from: '2020',
          to: '2030',
          mode: 'single',
          model: '2025-04-04',
        },
        null,
        true,
      );
    });

    it('syncs a complete manually entered date on blur', () => {
      cy.get('.pdp-input').clear().type('2025-04-15').blur();
      cy.get('.show').should('contain.text', '2025-04-15');
      cy.get('.pdp-input').focus();
      cy.get('.pdp-day.start-range').should('contain.text', '15');
    });
  });

  it('renders a calendar-native display label without unsupported tokens', () => {
    cy.changeProps(
      {
        calendar: 'hebrew',
        locale: 'en',
        from: '5780',
        to: '5790',
        model: '5785-07-06',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-footer').should('not.contain.text', '?');
  });

  it('moves the visible calendar to a manually entered adapter date', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        from: '1440',
        to: '1450',
        model: '1446-10-06',
      },
      null,
      true,
    );

    cy.get('.pdp-input').clear().type('1446-10-07').blur().focus();
    cy.get('.pdp-day.start-range').should('have.attr', 'value', '7');
  });

  context('input mask', () => {
    before(() => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          from: '2020',
          to: '2030',
          inputMask: 'YYYY/MM/DD',
          mode: 'single',
          model: '2025-04-04',
        },
        null,
        true,
      );
    });

    it('filters characters that are not allowed by the input mask', () => {
      cy.get('.pdp-input').clear().type('2025a/04x/15');
      cy.get('.pdp-input').should('have.value', '2025/04/15');
    });

    it('accepts locale digits when both digit sets are allowed', () => {
      cy.changeProps(
        {
          inputMask: {
            pattern: 'YYYY/MM/DD',
            allowedDigits: 'both',
          },
          model: '2025-04-04',
        },
        null,
      );
      cy.get('.pdp-input').clear().type('۲۰۲۵/۰۴/۱۵').blur();
      cy.get('.show').should('contain.text', '2025-04-15');
    });

    it('rejects impossible dates in strict mode', () => {
      cy.changeProps(
        {
          inputMask: {
            pattern: 'YYYY/MM/DD',
            strict: true,
          },
          model: '2025-04-04',
        },
        null,
      );
      cy.get('.pdp-input').clear().type('2025/02/31').blur();
      cy.get('.show').should('contain.text', '2025-04-04');
    });

    it('uses the configured mask placeholder', () => {
      cy.changeProps(
        {
          inputMask: {
            pattern: 'YYYY/MM/DD',
            placeholder: 'YYYY/MM/DD',
          },
        },
        null,
      );
      cy.get('.pdp-input').should('have.attr', 'placeholder', 'YYYY/MM/DD');
    });
  });

  context('default input mask', () => {
    before(() => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          from: '2020',
          to: '2030',
          mode: 'single',
          model: '2025-04-04',
        },
        null,
        true,
      );
    });

    it('filters invalid characters with the calendar default mask', () => {
      cy.get('.pdp-input').clear().type('2025a-04x-15');
      cy.get('.pdp-input').should('have.value', '2025-04-15');
    });
  });

  it('preserves the Chinese leap-month marker in modelValue', () => {
    cy.changeProps(
      {
        calendar: 'chinese',
        locale: 'en',
        mode: 'single',
        model: '2023-02bis-01',
      },
      null,
      true,
    );

    cy.get('.show').should('contain.text', '2023-02bis-01');
    cy.get('.pdp-input').should('have.value', '2023-02bis-01');
  });

  it('parses and displays a Hijri range model', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        mode: 'range',
        type: 'date',
        model: ['1446/10/06', '1446/10/07'],
      },
      null,
      true,
    );

    cy.get('.pdp-input').should('have.value', '1446-10-06 - 1446-10-07');
  });

  it('parses and displays a Hijri datetime range model', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        mode: 'range',
        type: 'datetime',
        model: ['1446/10/06 10:20', '1446/10/07 11:30'],
      },
      null,
      true,
    );

    cy.get('.pdp-input').should(
      'have.value',
      '1446-10-06 10:20 - 1446-10-07 11:30',
    );
  });
});
