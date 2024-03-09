const clientSessions = require("client-sessions");

const sessionMiddleware = {
  session: clientSessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }),
  themeSession: clientSessions({
    cookieName: "theme_session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 60 * 1000,
    activeDuration: 60 * 60 * 1000,
  }),
  imageEditorSession: clientSessions({
    cookieName: "imageEditor",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }),
};

module.exports = sessionMiddleware;
