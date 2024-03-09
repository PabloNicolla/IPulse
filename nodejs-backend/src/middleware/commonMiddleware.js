const express = require("express");
const cookieParser = require("cookie-parser");
const {
  session,
  themeSession,
  imageEditorSession,
} = require("../config/sessionConfig");

const commonMiddleware = (app) => {
  app.use(express.static("public"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(session);
  app.use(themeSession);
  app.use(imageEditorSession);
};

module.exports = commonMiddleware;
