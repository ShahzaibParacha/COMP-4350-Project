/* eslint-disable */
function animationEnd(e) {
  hideMessage(e.target);
}

// trigger the message animation
//
// element - the element you want to make appear and disappear
// color - color of the form '#RRGGBB'
// persists - if true, the message will disappear after some time; if false, it will stay there until hideMessage is called
function showMessage(element, message, color, persists) {
  element.innerHTML = message;
  element.style.color = color;
  element.style.opacity = "1";
  element.classList = "";

  if (!persists) {
    element.addEventListener("animationend", animationEnd);
    element.classList = "vanishing";
  }
}

// hide the message
//
// element - the element you want to hide
function hideMessage(element) {
  element.innerHTML = "";
  element.style.opacity = "0";
  element.classList = "";
}
/* eslint-enable */

const success = "#006600";
const failure = "#660000";

export { showMessage, hideMessage, success, failure };
