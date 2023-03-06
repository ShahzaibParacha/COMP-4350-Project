// both these functions must be called inside a useEffect hook

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

// the second parameter of the hook this is in must be [contextId]
function fromContextToSession(contextId, contextToken) {
  window.addEventListener("beforeunload", () => {
    if (contextId && contextToken) {
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          userId: contextId,
          token: contextToken,
        })
      );
    }
  });
}

export { fromContextToSession, fromSessionToContext };
