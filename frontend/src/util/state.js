// the second parameter of the hook this is in must be []
// stores whatever is in session storage in the context
function fromSessionToContext(sessionId, sessionToken, dispatch) {
  if (sessionId && sessionToken) {
    dispatch({
      type: "SET_USER_ID",
      payload: sessionId,
    });
    dispatch({
      type: "SET_TOKEN",
      payload: sessionToken,
    });
  }
}

let id;
let token;

function moveToSession() {
  if (id && token) {
    sessionStorage.setItem(
      "session",
      JSON.stringify({
        userId: id,
        token,
      })
    );
  }
}

// the second parameter of the hook this is in must be [contextId]
// stores whatever is in the context in the session storage
function fromContextToSession(contextId, contextToken) {
  id = contextId;
  token = contextToken;

  window.addEventListener("beforeunload", moveToSession);
}

export { fromContextToSession, fromSessionToContext };
