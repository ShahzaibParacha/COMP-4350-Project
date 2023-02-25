/* eslint-disable */
function animationEnd(e) {
  hideMessage(e.target);
}

// trigger the message animation
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

function hideMessage(element) {
  element.innerHTML = "";
  element.style.opacity = "0";
  element.classList = "";
}
/* eslint-enable */

const success = "#006600";
const failure = "#660000";

export { showMessage, hideMessage, success, failure };
