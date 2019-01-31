// SETTINGS
const MAX_WIDTH = 39;
const URL = 'https://www.randolphbeer.com/beerboards/dumbo';

function setupBoard() {
  $( ".displays" ).remove();
  const div = `<div class="displays"></div>`;
  $(".page").append(div);
}

function firstRow(brewery) {
  return brewery.toUpperCase()
}

function secondRow(beer_name, price_per_oz) {
  return `${beer_name.toUpperCase()}`.padEnd(MAX_WIDTH, ' ').slice(0, (MAX_WIDTH - 10)) +
    `$${price_per_oz || `0.00`} / oz`
}

function thirdRow(beer_type, abv) {
  return `${beer_type} - ${abv}%`.padEnd(MAX_WIDTH, ' ').slice(0, (MAX_WIDTH - 8))
}

function shuffleBoard(json, _toggle) {
  // flip every other page
  let startAtDraftLine = _toggle ? 12 : 0;

  // skip section headers
  const justBeers = json.filter(beer => beer.type !== 'MenuSection')

  justBeers.splice(startAtDraftLine, 12).map(beer => {
    // add extra whitespace
    const row1 = firstRow(beer.brewery);
    const row2 = secondRow(beer.name, beer.price_per_oz );
    const row3 = thirdRow(beer.beer_type, beer.abv);

    const input =
     `<div class="draftline">${beer.draft_line}</div>
      <input class="display XS" value="${row1} " />
      <input class="display XS" value="${row2}" />
      <input class="display XS" value="${row3}" />
      <div class="spacer" />
      `;
    $(".displays").append(input);
  });

  new FlapDemo('input.display')
  return !_toggle; // flip page to alternate

}

// Core function that will be run over and over
const run = (json) => {
  setupBoard();
  this.toggle = shuffleBoard(json, this.toggle);
}

$(document).ready(function(){

  // Kick off the party!
  fetch(URL)
  .then(res => res.json())
  .then(json => {

    let toggle = true;
    run(json); // first run

    setInterval(() => {
      run(json);
    }, 45000)

  });

});
