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

  it('keeps pre-1970 adapter bounds selectable', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        from: '1900-01-01',
        to: '2100-01-01',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-day:not(.disabled)').should('have.length.greaterThan', 0);
    cy.get('.pdp-today').should('exist');
    cy.get('.pdp-year').first().click();
    cy.get('.pdp-select-year li').should('have.length.greaterThan', 0);
  });

  it('keeps Buddhist adapter bounds selectable before the Unix epoch', () => {
    cy.changeProps(
      {
        calendar: 'buddhist',
        locale: 'en',
        from: '2500-01-01',
        to: '2600-01-01',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-day:not(.disabled)').should('have.length.greaterThan', 0);
    cy.get('.pdp-today').should('exist');
    cy.get('.pdp-year').first().click();
    cy.get('.pdp-select-year li').should('have.length.greaterThan', 0);
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
        calendar: 'hijri',
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

  it('applies string disable values in the active calendar', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        from: '2025',
        to: '2025',
        disable: '2025-04-05',
        mode: 'single',
        model: '2025-04-04',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-day[value="5"]')
      .should('have.attr', 'class')
      .and('match', /disabled/);
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

  it('updates modelValue when modelCalendar changes from Jalali', () => {
    cy.changeProps(
      {
        calendar: 'jalali',
        locale: 'fa',
        format: 'jYYYY/jMM/jDD',
        modelCalendar: 'gregorian',
        mode: 'single',
        model: '1404/01/15',
      },
      null,
      true,
    );

    cy.get('.show').should('contain.text', '2025/04/04');
  });

  it('updates modelValue when modelCalendar changes to Jalali', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        format: 'YYYY-MM-DD',
        modelCalendar: 'jalali',
        mode: 'single',
        model: '1446/10/06',
      },
      null,
      true,
    );

    cy.get('.show').should('contain.text', '1404-01-15');
  });

  it('does not leak Jalali token prefixes into non-Jalali models', () => {
    cy.changeProps(
      {
        calendar: 'jalali',
        locale: 'fa',
        format: 'jYYYY/jMM/jDD',
        modelCalendar: 'hijri',
        mode: 'single',
        model: '1404/01/15',
      },
      null,
      true,
    );

    cy.get('.show').should('contain.text', '1446/10/05');
    cy.get('.show').should('not.contain.text', 'j');
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

  context('display format', () => {
    before(() => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          from: '2020',
          to: '2030',
          displayFormat: 'YY-MM-DD',
          mode: 'single',
          model: '2025-04-04',
        },
        null,
        true,
      );
    });

    it('renders date tokens in the picker footer', () => {
      cy.get('.pdp-input').focus();
      cy.get('.pdp-footer small').first().should('have.text', '25-04-04');
    });

    it('keeps Jalali format tokens aligned with the Jalali model', () => {
      cy.changeProps(
        {
          calendar: 'jalali',
          locale: 'fa',
          from: '1400',
          to: '1410',
          format: 'jYYYY/jMM/jDD',
          inputFormat: 'jYY/jMM/jDD',
          inputMask: 'jYY/jMM/jDD',
          displayFormat: 'jYY/jMM/jDD',
          mode: 'single',
          model: '1404/01/05',
        },
        null,
        true,
      );

      cy.get('.pdp-input').should('have.value', '04/01/05').focus();
      cy.get('.pdp-footer small').first().should('have.text', '04/01/05');
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
        mode: 'single',
        model: '5785-07-06',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-footer').should('not.contain.text', '?');
  });

  it('normalizes legacy display tokens for non-Jalali calendars', () => {
    const cases = [
      { calendar: 'buddhist', from: '2560', to: '2570', model: '2568-04-04' },
      { calendar: 'chinese', from: '2020', to: '2030', model: '2023-02-01' },
    ] as const;

    cases.forEach(({ calendar, from, to, model }) => {
      cy.changeProps(
        {
          calendar,
          locale: 'en',
          from,
          to,
          displayFormat: '?D ?MMMM',
          mode: 'single',
          model,
        },
        null,
        true,
      );

      cy.get('.pdp-input').focus();
      cy.get('.pdp-footer').should('not.contain.text', '?');
    });
  });

  it('moves the visible calendar to a manually entered adapter date', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        from: '1440',
        to: '1450',
        mode: 'single',
        model: '1446-10-06',
      },
      null,
      true,
    );

    cy.get('.pdp-input').clear().type('1446-10-07').blur().focus();
    cy.get('.pdp-day.start-range').should('have.attr', 'value', '7');
  });

  it('generates default shortcuts through the active calendar adapter', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        from: '2000',
        to: '2100',
        mode: 'single',
        shortcut: true,
        model: '2025-04-04',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-shortcut').contains('Yesterday').click();
    cy.get('.show').should('not.contain.text', '—');
  });

  it('generates time shortcuts through the active calendar adapter', () => {
    cy.changeProps(
      {
        calendar: 'hijri',
        locale: 'en',
        type: 'time',
        mode: 'single',
        shortcut: true,
        model: '12:00',
      },
      null,
      true,
    );

    cy.get('.pdp-input').focus();
    cy.get('.pdp-shortcut').contains('Midnight').click();
    cy.get('.show').should('not.contain.text', '—');
  });

  it('synchronizes manually entered time through an explicit Gregorian adapter', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        type: 'time',
        from: '10:00',
        to: '20:00',
        mode: 'single',
        model: '12:00',
      },
      null,
      true,
    );

    cy.get('.pdp-input').clear().type('15:30').blur();
    cy.get('.show').should('contain.text', '15:30');
  });

  it('opens an adapter time picker with its initial time model', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        type: 'time',
        from: '09:00',
        to: '18:00',
        mode: 'single',
        model: '14:30',
      },
      null,
      true,
    );

    cy.get('.pdp-input').should('have.value', '14:30').click();
    cy.get('.pdp-time').should('be.visible');
  });

  it('uses time bounds when a demo supplies calendar date bounds in time mode', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        type: 'time',
        from: '1900-01-01',
        to: '2100-01-01',
        mode: 'single',
        model: '14:30',
      },
      null,
      true,
    );

    cy.get('.pdp-input').should('have.value', '14:30').click();
    cy.get('.pdp-time').should('be.visible');
  });

  it('parses an explicit Gregorian datetime range through the adapter', () => {
    cy.changeProps(
      {
        calendar: 'gregorian',
        locale: 'en',
        type: 'datetime',
        mode: 'range',
        model: ['2025-04-04 09:15', '2025-04-05 17:45'],
      },
      null,
      true,
    );

    cy.get('.pdp-input').should(
      'have.value',
      '2025-04-04 09:15 - 2025-04-05 17:45',
    );
  });

  it('does not commit an impossible date through an explicit Gregorian adapter', () => {
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

    cy.get('.pdp-input').clear().type('2025-02-31').blur();
    cy.get('.show').should('contain.text', '2025-04-04');
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

    it('inserts mask literals while typing compact digits', () => {
      cy.changeProps(
        {
          calendar: 'jalali',
          locale: 'fa',
          from: '1400',
          to: '1410',
          inputFormat: 'jYY/jMM-jDD',
          inputMask: { pattern: 'jYY/jMM-jDD', autoInsert: true },
          mode: 'single',
          model: '1404/01/05',
        },
        null,
        true,
      );
      cy.get('.pdp-input').clear().type('050415');
      cy.get('.pdp-input').should('have.value', '05/04-15');
    });

    it('rejects out-of-range date block digits while typing', () => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          from: '2020',
          to: '2030',
          inputFormat: 'YYYY/MM/DD',
          inputMask: {
            pattern: 'YYYY/MM/DD',
            autoInsert: true,
            strict: true,
          },
          mode: 'single',
          model: '2025-04-04',
        },
        null,
        true,
      );

      cy.get('.pdp-input').clear().type('2025/04/65');
      cy.get('.pdp-input')
        .should('not.have.value', '2025/04/65')
        .and('not.contain.value', '65');
    });

    it('supports independent custom ranges for mask blocks', () => {
      cy.changeProps(
        {
          calendar: 'gregorian',
          locale: 'en',
          type: 'datetime',
          from: '1970',
          to: '2030',
          inputFormat: 'YYYY/MM/DD HH:mm',
          inputMask: {
            pattern: 'YYYY/MM/DD HH:mm',
            blocks: {
              YYYY: { from: 1970, to: 2030 },
              MM: { from: 1, to: 12 },
              DD: { from: 1, to: 31 },
              HH: { from: 0, to: 23 },
              mm: { from: 0, to: 59 },
            },
          },
          mode: 'single',
          model: '2025-04-04 12:30',
        },
        null,
        true,
      );

      cy.get('.pdp-input').clear().type('2025/13/32 25:60');
      cy.get('.pdp-input')
        .should('not.contain.value', '13')
        .and('not.contain.value', '32')
        .and('not.contain.value', ' 25:')
        .and('not.contain.value', ':60');
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
