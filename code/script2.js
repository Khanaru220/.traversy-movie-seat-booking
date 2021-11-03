'use strict';

const showCaseEl = document.querySelector('.show-case');
const screenEl = document.querySelector('.screen');
const seatEl = document.querySelectorAll(
  '.show-case .icon:not(.icon--occupied)'
);
const selectEl = document.querySelector('.film-select');

// ----------------------------
// ------------ Event handler
// ----------------------------

// (1) calculate price * seat + update data (seatSelected)
const calcTotal = function () {
  // update seatSelected
  const seatSelectedEl = document.querySelectorAll(
    '.show-case .icon--selected'
  );

  // store in localStorage
  const seatIndex = [];

  for (const element of seatSelectedEl) {
    // [...] transform Nodelist --> Array to use indexOf()
    if ([...seatEl].indexOf(element) > -1) {
      seatIndex.unshift([...seatEl].indexOf(element));
    }
  }

  localStorage.setItem('seatSelected', JSON.stringify(seatIndex));

  // update price + calculate price
  let ticketSelected = +selectEl.value;
  const price = seatSelectedEl.length * ticketSelected;
  return [seatSelectedEl.length, price];
};

// (2) Display seat + price at bottom text line
const displayInfo = function (seatCount, price) {
  document.querySelector('.info-number--seat').innerText = seatCount;
  document.querySelector('.info-number--price').innerText = price;
};

// (3) Recall from localStorage when F5
const populateUI = function () {
  // recall for seatSelected
  const seatSelected = JSON.parse(localStorage.getItem('seatSelected'));
  if (seatSelected && seatSelected.length > 0)
    for (const i of seatSelected) {
      seatEl[i].classList.add('icon--selected');
    }

  // recall for filmSelected
  selectEl.selectedIndex = localStorage.getItem('filmSelected');
};

// (4) Swtich screen when change <option>
const switchScreen = function () {
  // add animation_name to trigger
  screenEl.style.animationName = 'rollScreen, switchScreen';
  // wait 1 iteration, then switch image
  setTimeout(function () {
    if (selectEl.selectedIndex > 0) {
      screenEl.style.backgroundImage = `url(img/movie-${selectEl.selectedIndex}.jpg)`;
      screenEl.style.backgroundSize = 'cover';
    } else {
      screenEl.style.backgroundImage = 'none';
    }
  }, 400);
  // wait 2 iteration, remove animation_anme to re-trigger next time
  setTimeout(function () {
    screenEl.style.animationName = 'rollScreen';
  }, 800);
};
// ----------------------------
// ----- RUN INITAL FUNCTION when F5
// ----------------------------

populateUI();
displayInfo(...calcTotal());
setTimeout(switchScreen, 12500);

// ----------------------------
//  ------ addEventListener
// ----------------------------

showCaseEl.addEventListener('click', function (e) {
  // Select seat
  if (
    e.target.classList.contains('icon') &&
    !e.target.classList.contains('icon--occupied')
  ) {
    e.target.classList.toggle('icon--selected');
  }
  displayInfo(...calcTotal());
});

selectEl.addEventListener('change', function () {
  localStorage.setItem('filmSelected', selectEl.selectedIndex);
  switchScreen();
  displayInfo(...calcTotal());
});
