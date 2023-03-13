// the second parameter of the hook this is in must be []
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
function fromContextToSession(contextId, contextToken) {
  id = contextId;
  token = contextToken;

  window.addEventListener("beforeunload", moveToSession);
}

// this function needs to be called by every free route upon first render
function clearListener() {
  window.removeEventListener("beforeunload", moveToSession);
}

export { fromContextToSession, fromSessionToContext, clearListener };
