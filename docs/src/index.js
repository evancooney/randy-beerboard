// SETTINGS
const MAX_WIDTH = 39;
const URL = 'https://staging.randolphbeer.com/beerboards/dumbo';

function setupBoard() {
  $( ".displays" ).remove();
  const div = `<div class="displays"></div>`;
  $(".page").append(div);
}

function firstRow(name, price) {
  return name.padEnd(MAX_WIDTH, ' ').slice(0, (MAX_WIDTH - 3)) + `$${price}`
}

function secondRow(brewery, beer_type, abv) {
  return `${brewery.trim().toUpperCase()}-${beer_type.trim()}-${abv}%`
}

function shuffleBoard(json, _toggle) {
  // flip every other page
  let startAtDraftLine = _toggle ? 11 : 0;

  // skip section headers
  const justBeers = json.filter(beer => beer.type !== 'MenuSection')

  justBeers.splice(startAtDraftLine, 12).map(beer => {
    // add extra whitespace
    const row1 = firstRow(beer.name, beer.price);
    const row2 = secondRow(beer.brewery, beer.beer_type, beer.abv);

    const input =
     `<div class="draftline">${beer.draft_line}</div>
      <input class="display XS" value="${row1.toUpperCase()} " />
      <input class="display XS" value="${row2}" />
      <br />
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
