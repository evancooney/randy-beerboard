// SETTINGS
const MAX_WIDTH = 39;
const URL = 'https://staging.randolphbeer.com/beerboards/dumbo';

var FlapBuffer = function(wrap, num_lines) {
    this.wrap = wrap;
    this.num_lines = num_lines;
    this.line_buffer = '';
    this.buffers = [[]];
    this.cursor = 0;
};

FlapBuffer.prototype = {

    pushLine: function(line) {

        if (this.buffers[this.cursor].length < this.num_lines) {
           this.buffers[this.cursor].push(line);
        } else {
            this.buffers.push([]);
            this.cursor++;
            this.pushLine(line);
        }
    },

    pushWord: function(word) {
        if (this.line_buffer.length == 0) {
            this.line_buffer = word;
        } else if ((word.length + this.line_buffer.length + 1) <= this.wrap) {
            this.line_buffer += ' ' + word;
        } else {
            this.pushLine(this.line_buffer);
            this.line_buffer = word;
        }
    },

    flush: function() {
        if (this.line_buffer.length) {
            this.pushLine(this.line_buffer);
            this.line_buffer = '';
        }
    },

};

var FlapDemo = function(display_selector, click_selector) {
    var _this = this;

    var onAnimStart = function(e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').addClass('active');
    };

    var onAnimEnd = function(e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').removeClass('active');
    };

    this.opts = {
        chars_preset: 'alpha',
        align: 'left',
        width: MAX_WIDTH,
        on_anim_start: onAnimStart,
        on_anim_end: onAnimEnd,
        timing: 100,
        transform: false,
    };

    this.timers = [];

    this.$displays = $(display_selector);
    this.num_lines = this.$displays.length;

    this.line_delay = 300;
    this.screen_delay = 7000;

    this.$displays.flapper(this.opts);
};

FlapDemo.prototype = {

    cleanInput: function(text) {
        return text.trim().toUpperCase();
    },

    parseInput: function(text) {
        var buffer = new FlapBuffer(this.opts.width, this.num_lines);
        var lines = text.split(/\n/);

        for (i in lines) {
            var words = lines[i].split(/\s/);
            for (j in words) {
                buffer.pushWord(words[j]);
            }
            buffer.flush();
        }

        buffer.flush();
        return buffer.buffers;
    },

    stopDisplay: function() {
        for (i in this.timers) {
            clearTimeout(this.timers[i]);
        }

        this.timers = [];
    },

    updateDisplay: function(buffers) {
        var _this = this;
        var timeout = 25;

        for (i in buffers) {

            _this.$displays.each(function(j) {

                var $display = $(_this.$displays[j]);

                (function(i,j) {
                    _this.timers.push(setTimeout(function(){
                        if (buffers[i][j]) {
                            $display.val(buffers[i][j]).change();
                        } else {
                            $display.val('').change();
                        }
                    }, timeout));
                } (i, j));

                timeout += _this.line_delay;
            });

            timeout += _this.screen_delay;
        }
    }

};

$(document).ready(function(){

  // pepare set 1
  // prepare set 2
  //

  function setupBoard() {
    $( ".displays" ).remove();
    const div = `<div class="displays"></div>`;
    $(".page").append(div);
  }

  function shuffleBoard(json, _toggle) {
    // flip every other page
    let startAtDraftLine;
    if (_toggle) {
      startAtDraftLine = 11;
    } else {
      startAtDraftLine = 0;

    }

    // skip section headers
    const justBeers = json.filter(beer => beer.type !== 'MenuSection')

    justBeers.splice(startAtDraftLine, 12).map(beer => {
      const {
        name,
        price,
        id,
        brewery,
        region,
        description,
        beer_type,
        draft_line,
        abv
      } = beer;

      console.log(beer, 'xl');
      // add extra whitespace
      const row1 = name.padEnd(MAX_WIDTH, ' ').slice(0, (MAX_WIDTH - 3))
        + `$${price}`
      const row2 =
        `${brewery.trim().toUpperCase()}-${beer_type.trim()}-${abv}%`
      const input =
       `<div class="draftline">${draft_line}</div>
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

  fetch(URL)
  .then(res => res.json())
  .then(json => {

    let toggle = true;
    run(json); // first run

    setInterval(() => {
      run(json);
      // window.location.href=window.location.href
    }, 45000)

  });

});
