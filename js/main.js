var deck  = new Deck(),
    timer = new Timer();

var card     = document.getElementById('card'),
    time     = document.getElementById('timer'),
    progress = document.getElementById('progress');

var cardHammer  = Hammer(card, { prevent_default: true }),
    timerHammer = Hammer(time, { prevent_default: true });

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function reset(ask) {
  if(!ask || confirm('Are you sure you want a new deck?')) {
    timer.reset();
    time.className = '';
    time.innerHTML = '00.00';

    deck.shuffle();
    draw(deck.currentCard());

    updateProgress();
  }
}

function init() {
  reset();

  setInterval(function() {
    if (timer.running()) {
      time.innerHTML = timer.duration();
    }
  }, 55);
}

function toggleTimer() {
  if (timer.running()) {
    time.className = 'stopped';
    timer.reset();
  } else {
    time.className = '';
    timer.start();
  }
}

function draw(newCard) {
  card.src = 'cards/' + newCard + '.png';
}

function updateProgress() {
  progress.style.width = deck.progress() + '%';

  if (deck.progress() >= 98) {
    progress.className = 'complete';
  } else {
    progress.className = '';
  }
}

cardHammer.on('tap swipeleft', function() {
  draw(deck.nextCard());
  updateProgress();
});

cardHammer.on('swiperight', function() {
  draw(deck.previousCard());
  updateProgress();
});

cardHammer.on('hold', function() { reset(true); });

timerHammer.on('tap', function() {
  toggleTimer();
});

document.onkeypress = function (e) {
  if (e.keyCode == 106) {        // j
    draw(deck.nextCard());
    updateProgress();
  } else if (e.keyCode == 107) { // k
    draw(deck.previousCard());
    updateProgress();
  } else if (e.keyCode == 110) { // n
    reset(true);
  } else if (e.keyCode == 32) {  // space
    toggleTimer();
  }
};


timer.metronome = 0;

document.getElementById('metronome').onchange = function () {
    timer.metronome = document.getElementById("metronome").value;
};

timer.onTickCallback = debounce(function() {
  draw(deck.nextCard());
  updateProgress();
}, 250, true);

init();
