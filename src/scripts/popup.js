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

function changeToPayment() {
  startDate.value = new Date(currentDate.getFullYear(), 0, 2).toISOString().substring(0, 10);
  endDate.value = new Date(currentDate.getFullYear(), 12, 1).toISOString().substring(0, 10);
}

// Returns one date per month falling on dayOfMonth within the range
function getPaymentDays(start, end, dayOfMonth) {
  var arr = [];
  var cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= end) {
    var daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    var day = Math.min(dayOfMonth, daysInMonth);
    var date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    if (date >= start && date <= end) {
      arr.push(date);
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return arr;
}

//method to get dates array
function getDaysArray(start, end) {
  let excludedDays = Array.from(
    document.querySelectorAll(".exclude-day:checked")
  ).map((checkbox) => parseInt(checkbox.value)); // Get excluded days from checkboxes

  let arr = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    if (!excludedDays.includes(dt.getDay())) {
      // Exclude the specified days
      arr.push(new Date(dt));
    }
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

// Copy dates directly via Clipboard API (no DOM selection = no viewport size limit)
async function copyDates(dates) {
  const rows = dates.map(d => `<tr><td>${formatDate(d)}</td></tr>`).join("");
  const html = `<table>${rows}</table>`;
  const plain = dates.map(d => formatDate(d)).join("\n");

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      }),
    ]);
  } catch (e) {
    // Fallback for environments without ClipboardItem support
    await navigator.clipboard.writeText(plain);
  }
  console.log(`Copied ${dates.length} dates to clipboard`);
}

$(document).ready(function () {
  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // Theme toggle
  $("#themeToggle").on("click", function () {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });

  // Toast close button
  $(".toast-close").on("click", function () {
    $("#success-alert").removeClass("show");
  });

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
      case "pay":
        changeToPayment();
        break;
      default:
        changeToMonth();
        break;
    }
    // Show/hide payment day picker and date row
    var isPayMode = btnValue === "pay";
    $("#paymentDaySection").toggle(isPayMode);
    $(".date-row").toggle(!isPayMode);
  });
  
  //function for copy button
  $("#btnSubmit").click(async function () {
    var activeMode = $("#datesBtnGroup button.active").val();
    var dates;
    if (activeMode === "pay") {
      var day = Math.min(Math.max(parseInt($("#paymentDay").val()) || 1, 1), 31);
      dates = getPaymentDays(new Date(startDate.value), new Date(endDate.value), day);
    } else {
      dates = getDaysArray(new Date(startDate.value), new Date(endDate.value));
    }
    await copyDates(dates);

    // Show toast
    var $toast = $("#success-alert");
    $toast.addClass("show");
    setTimeout(function () { $toast.removeClass("show"); }, 2500);

  });

  //function for reset button
  $("#btnReset").click(function () {
    $('#datesBtnGroup button[value="month"]').click();
    $(".exclude-day").prop("checked", false);
    $("#paymentDaySection").hide();
    $(".date-row").show();
  });

  // Set default value
  $("#datesBtnGroup button[value='month']").click();
});