'use strict';

const iconSeatEl = document.querySelectorAll(
  '.seat-board .icon:not(.icon--occupied)'
);

const selectEl = document.querySelector('select');

const infoSeatEl = document.querySelector('.info-number--seat');
const infoPriceEl = document.querySelector('.info-number--price');
const screenEl = document.querySelector('.screen');

let setSeat = new Set([]);
let setSeatArr = [];

//  INITIAL FUNCTION --------

const populateUI = function () {
  // recall from localstorage
  const seatSelected = JSON.parse(localStorage.getItem('seatSelected'));
  // check in whole seat to add selected class
  if (seatSelected && seatSelected.length > 0) {
    for (const i of seatSelected) {
      iconSeatEl[i].classList.add('icon--selected');
    }
  }
  // update to the set, to use in our code
  setSeat = new Set(seatSelected);
};

const updateCount = function () {
  const filmSelected = localStorage.getItem('filmSelected');
  const priceSelected = localStorage.getItem('priceSelected');

  selectEl.selectedIndex = +filmSelected;
};

const calcTotal = function () {
  let total = setSeat.size * selectEl.value;
  return [setSeat.size, total];
};

const displayInfo = function (seatTotal, priceTotal) {
  infoSeatEl.innerText = `${seatTotal}`;
  infoPriceEl.innerText = `${priceTotal}`;
};

const switchScreen = function () {
  // take value from currentFilmPosition --> add background-image
  if (selectEl.selectedIndex > 0) {
    // add 3 properties
    // add animationName --> trigger 2nd animation
    screenEl.style.animationName = 'rollScreen, switchScreen';

    // wait after 1 iteration (opacity old film) --> img
    setTimeout(() => {
      screenEl.style.backgroundImage = `url(img/movie-${selectEl.selectedIndex}.jpg)`;
      // screenEl.style.backgroundPosition = 'center';
      screenEl.style.backgroundSize = 'cover';
    }, 400);

    setTimeout(() => {
      // wait 2 iteration (old -> new film -> off) delete to recall next time
      screenEl.style.animationName = 'rollScreen';
    }, 800);
  } else {
    screenEl.style.backgroundImage = 'none';
  }
};
setTimeout(() => {
  populateUI();
  updateCount();
  calcTotal();
  displayInfo(...calcTotal());
  switchScreen();
}, 12500);

// ----------- EVENT HANDLER ----------

const bookSeat = function (input) {
  input.classList.toggle('icon--selected');
};

// +++ ADD event to .seat
for (const [i, input] of iconSeatEl.entries()) {
  // 1. Run toggle class
  input.addEventListener('click', function () {
    bookSeat(input);
    // 2. Check if has class -> add to Set
    if (input.classList.contains('icon--selected')) {
      setSeat.add(i);
    } else {
      setSeat.delete(i);
    }
    // update + store in localStorage
    setSeatArr = [...setSeat];
    localStorage.setItem('seatSelected', JSON.stringify(setSeatArr));
    console.log(setSeatArr);

    // 3+4. Calculate total -->  Display info
    displayInfo(...calcTotal());
  });
}

//  +++ ADD event to .select

selectEl.addEventListener('change', function () {
  // update film whenever change
  displayInfo(...calcTotal());
  switchScreen();
  localStorage.setItem('filmSelected', selectEl.selectedIndex);
  localStorage.setItem('priceSelected', selectEl.value);
});
