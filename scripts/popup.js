const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const resetBtn = document.getElementById("btnReset");
var currentDate = new Date();

function changeToWeek() {
  currentDate = new Date();
  startDate.value = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)).toISOString().substring(0, 10);
  endDate.value = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)).toISOString().substring(0, 10);
}

function changeToMonth() {
  startDate.value = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2).toISOString().substring(0, 10);
  endDate.value = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString().substring(0, 10);
}

function changeToYear() {
  startDate.value = new Date(currentDate.getFullYear(), 0, 2).toISOString().substring(0, 10);
  endDate.value = new Date(currentDate.getFullYear(), 12, 1).toISOString().substring(0, 10);
}
//method to get dates array
function getDaysArray(start, end) {
  for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
}
//method to format the date string
function formatDate(date) {
  date = new Date(date);
  var day = String(date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
  var month = String(date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
  var year = String(date.getFullYear());
  return month + "/" + day + "/" + year;
}
//function to copy the element 
function copyElData(elToBeCopied) {
  let range, sel;
  // Ensure that range and selection are supported by the browsers
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    // unselect any element in the page
    sel.removeAllRanges();
    try {
      range.selectNodeContents(elToBeCopied);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(elToBeCopied);
      sel.addRange(range);
    }
    document.execCommand("copy");
  }
  sel.removeAllRanges();
  console.log("Element Copied! Paste it in a file");
};
$(document).ready(function () {
  $("#success-alert").hide();
  // Get click event, assign button to var, and get values from that var
  $("#datesBtnGroup button").on("click", function () {
    var thisBtn = $(this);
    thisBtn.addClass("active").siblings().removeClass("active");
    var btnValue = thisBtn.val();
    switch (btnValue) {
      case "week":
        changeToWeek();
        break;
      case "month":
        changeToMonth();
        break;
      case "year":
        changeToYear();
        break;
      default:
        changeToMonth();
        break;
    }
  });
  //function for copy button
  $("#btnSubmit").click(function () {
    var datesTobeInserted = [];
    datesTobeInserted = getDaysArray(new Date(startDate.value), new Date(endDate.value));
    var table = document.createElement("table");
    table.setAttribute("id", "datesTable");
    var arrHead = new Array();
    arrHead = ["Dates"];
    var arrValue = new Array();
    for (var i = 0; i < datesTobeInserted.length; i++) {
      arrValue.push([formatDate(datesTobeInserted[i])]);
    }
    for (var c = 0; c <= arrValue.length - 1; c++) {
      tr = table.insertRow(-1);
      for (var j = 0; j < arrHead.length; j++) {
        var td = document.createElement("td"); // TABLE DEFINITION.
        td = tr.insertCell(-1);
        td.innerHTML = arrValue[c][j]; // ADD VALUES TO EACH CELL.
      }
    }
    document.body.appendChild(table);
    const elTable = document.querySelector("table");
    copyElData(elTable);
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
      $("#success-alert").slideUp(500);
    });
    elTable.parentNode.removeChild(elTable);
    // elTable.style.display = "none";
  });
  //function for reset button
  $("#btnReset").click(function () {
    $('#datesBtnGroup button[value="month"]').click();
  });

  // I am using this to set default value
  // It will fire above click event which will do the updates.
  $('#datesBtnGroup button[value="month"]').click();
});
