const currentDayElem = $("#currentDay");
const blockContainElem = $(".blocks");

let notes = [];

//Sets the start and end of the hour blocks in the note taker based on 24-hour clock
const startOfDay = 9;
const endOfDay = 17;

// Loads local storage and calls createNotes if no local storage exists
function loadLocalStorage() {
  const tempNotes = JSON.parse(localStorage.getItem("notes"));

  if (tempNotes !== null) {
    tempNotes.forEach(function (object) {
      notes.push(object);
    });
  } else {
    createNotes();
  }
}

// Updates local storage
function updateLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Creates a framework for local storage
function createNotes() {
  const isNotes = (!notes);

  if (!isNotes) {
    for (var i = startOfDay; i <= endOfDay; i++) {
      const dataObj = {
        id: `hour-${i}`,
        text: ""
      };

      notes.push(dataObj);
    }
  }
}

// Displays the current date on the webpage
function displayToday() {
  const today = dayjs().format("dddd, MMMM D");
  currentDayElem.text(today);
}

// Renders the block for each hour of the day
function renderHourBlocks() {
  const currentHour = dayjs().format("H");

  loadLocalStorage();

  for (var i = startOfDay; i <= endOfDay; i++) {
    const textTime = determineTextTime(i);
    const noteIndex = notes.findIndex(item => item.id === `hour-${i}`);
    const noteText = notes[noteIndex].text;
    appendHourBlock(i, currentHour, textTime, noteText);
  }
}

// Creates the necessary HTML for a single hour block
function appendHourBlock(hour, currentHour, textTime, noteText) {
  const timeDiff = hour - currentHour;

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

// Determines what to display for AM vs PM
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

// Handles saving text when the save button is clicked and updates local storage
function handleSave(e) {
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

  const noteId = parentElem[0].id;
  const noteText = textAreaElem.val();

  const idIndex = notes.findIndex(item => item.id === noteId);

  notes[idIndex].text = noteText;

  updateLocalStorage();
}


$(function () {
  displayToday();
  renderHourBlocks();
  blockContainElem.on("click", ".saveBtn", handleSave);
});
