describe('advanced calendar picker', () => {
  it('renders and selects a Hijri date using Umm al-Qura', () => {
    cy.changeProps({
      locale: 'en',
      calendar: 'hijri',
      hijriProvider: 'ummalqura',
      mode: 'single',
      from: '1442/08/01',
      to: '1442/09/15',
    });

    cy.get('.pdp-input').focus();
    cy.get('.pdp-year').first().should('contain.text', '1442');
    cy.get('.pdp-month').first().should('contain.text', 'Sha');
    cy.get('.pdp-day:not(.empty):not(.disabled)').first().click();
    cy.get('.pdp-input')
      .invoke('val')
      .then((value) => expect(String(value)).to.match(/^1442-/));
  });

  it('renders a Hijri date using the tabular provider', () => {
    cy.changeProps({
      locale: 'en',
      calendar: 'hijri',
      hijriProvider: 'tabular',
      mode: 'single',
      from: '1446/10/01',
      to: '1446/11/01',
      model: '1446/10/06',
    });

    cy.get('.pdp-input').should('have.value', '1446-10-06').focus();
    cy.get('.pdp-year').first().should('contain.text', '1446');
  });
});
