// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

const currentDayElem = $("#currentDay");
const blockContainElem = $(".blocks");


let notes = [];

const startOfDay = 9;
const endOfDay = 17;


function loadLocalStorage() {
  const tempNotes = JSON.parse(localStorage.getItem("notes"));
  console.log(tempNotes);
  if (tempNotes !== null) {
    tempNotes.forEach(function (object) {
      notes.push(object);
    });
  } else {
    createNotes();
  }
}


function updateLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}


function createNotes() {
  const isNotes = (!notes);
  console.log(isNotes);

  if (!isNotes) {
    for (var i = startOfDay; i <= endOfDay; i++) {
      const dataObj = {
        id: `hour-${i}`,
        text: ""
      };

      notes.push(dataObj);
    }
  }
  console.log(notes);

}


function displayToday() {
  const today = dayjs().format("dddd, MMMM D");
  console.log(today);
  currentDayElem.text(today);
}


function renderHourBlocks() {
  const currentHour = dayjs().format("H");
  // console.log(currentHour);
  loadLocalStorage();
  // checkNotes();

  for (var i = startOfDay; i <= endOfDay; i++) {
    // console.log(i);
    const textTime = determineTextTime(i);
    const noteIndex = notes.findIndex(item => item.id === `hour-${i}`);
    const noteText = notes[noteIndex].text;
    appendHourBlock(i, currentHour, textTime, noteText);
  }
}


function appendHourBlock(hour, currentHour, textTime, noteText) {
  const timeDiff = hour - currentHour;
  // console.log(timeDiff);

  let timeId;

  if (timeDiff < 0) {
    timeId = "past"
  } else if (timeDiff > 0) {
    timeId = "future"
  } else if (timeDiff == 0) {
    timeId = "present"
  }

  blockContainElem.append(`
    <div id="hour-${hour}" class="row time-block ${timeId}">
      <div class="col-2 col-md-1 hour text-center py-3">${textTime}</div>
      <textarea class="col-8 col-md-10 description" rows="3">${noteText}</textarea>
      <button class="btn saveBtn col-2 col-md-1" aria-label="save">
      <i class="fas fa-save" aria-hidden="true"></i>
      </button>
    </div>
  `);
}


function determineTextTime(hour) {
  let textTime;

  if (hour > 0 && hour < 12) {
    textTime = `${hour}AM`;
  } else if (hour > 12 && hour < 24) {
    textTime = `${hour - 12}PM`;
  } else if (hour == 0) {
    textTime = "12AM";
  } else if (hour == 12) {
    textTime = "12PM";
  }

  return textTime;
}


function handleSave(e) {
  console.log($(e.target)[0].className);

  const verify = $(e.target)[0].className;

  let parentElem;

  if (verify === "fas fa-save") {
    console.log("clicked stupid icon");
    parentElem = $(e.target).parent().parent();
  } else {
    console.log("clicked actual button");
    parentElem = $(e.target).parent();
  }

  const textAreaElem = parentElem.children().eq(1);
  console.log(parentElem);
  console.log(textAreaElem);

  const noteId = parentElem[0].id;
  const noteText = textAreaElem.val();

  const idIndex = notes.findIndex(item => item.id === noteId);

  notes[idIndex].text = noteText;
  console.log(idIndex);
  console.log(notes);

  updateLocalStorage();

}


$(function () {


  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //

  blockContainElem.on("click", ".saveBtn", handleSave)

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  renderHourBlocks();




  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //


  // TODO: Add code to display the current date in the header of the page.

  displayToday();
});
