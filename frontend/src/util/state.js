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
  sessionStorage.setItem(
    "session",
    JSON.stringify({
      userId: id,
      token,
    })
  );
}

// the second parameter of the hook this is in must be [contextId]
// needs to be called when first rendering free routes (pass null to both parameters); the second parameter of useEffect can just be []
function fromContextToSession(contextId, contextToken) {
  id = contextId;
  token = contextToken;

  if (id && token) {
    window.addEventListener("beforeunload", moveToSession);
  } else {
    window.removeEventListener("beforeunload", moveToSession);
  }
}

export { fromContextToSession, fromSessionToContext };
