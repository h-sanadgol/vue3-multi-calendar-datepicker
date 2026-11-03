describe('calendar prop', () => {
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
    cy.changeProps({ calendar: 'gregorian', locale: 'en', from: '2020', to: '2021' }, null, true);
    cy.get('.pdp-input').focus();
    cy.get('.pdp-picker').should('have.class', 'ltr');
    cy.get('.pdp-month').first().should('contain.text', 'January');
  });

  it('supports calendar-specific week starts and weekly holidays', () => {
    cy.changeProps({ calendar: 'gregorian', locale: 'en', from: '2021', to: '2021', weekStartsOn: 1, weekendDays: [0] }, null, true);
    cy.get('.pdp-input').focus();
    cy.get('.pdp-weekday').first().should('contain.text', 'Mo');
    cy.get('.pdp-day.weekend').should('have.length.greaterThan', 0);
  });

  it('serializes modelValue in an explicitly selected calendar', () => {
    cy.changeProps({
      calendar: 'hijri',
      locale: 'en',
      modelCalendar: 'gregorian',
      mode: 'single',
      model: '1446/10/06',
    }, null, true);

    cy.get('.show').should('contain.text', '2025-04-04');
  });

  it('keeps the active calendar as the compatibility default for modelValue', () => {
    cy.changeProps({
      calendar: 'hijri',
      locale: 'en',
      mode: 'single',
      model: '1446/10/06',
    }, null, true);

    cy.get('.show').should('contain.text', '1446-10-06');
  });
});
