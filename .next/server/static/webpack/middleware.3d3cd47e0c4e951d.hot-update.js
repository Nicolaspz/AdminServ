"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(middleware)/./node_modules/next/dist/esm/server/web/exports/next-response.js\");\n\nconst publicRoutes = [];\nconst REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = \"sign-in\";\nfunction middleware(request) {\n    console.log(\"funcionou\");\n    return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].next();\n}\nconst config = {\n    matcher: [\n        /*\r\n     * Match all request paths except for the ones starting with:\r\n     * - api (API routes)\r\n     * - _next/static (static files)\r\n     * - _next/image (image optimization files)\r\n     * - favicon.ico, sitemap.xml, robots.txt (metadata files)\r\n     */ \"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBaUY7QUFHakYsTUFBTUMsZUFBZSxFQUFFO0FBQ3ZCLE1BQU1DLHdDQUFzQztBQUVyQyxTQUFTQyxXQUFXQyxPQUFvQjtJQUM3Q0MsUUFBUUMsR0FBRyxDQUFDO0lBQ1osT0FBT04sdUZBQWlCO0FBQzFCO0FBR08sTUFBTVEsU0FBUztJQUNwQkMsU0FBUztRQUNQOzs7Ozs7S0FNQyxHQUNEO0tBQ0Q7QUFDSCxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL21pZGRsZXdhcmUudHM/NDIyZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UsIHR5cGUgTmV4dFJlcXVlc3QsIHR5cGUgTmV4dE1pZGRsZXdhcmUgfSBmcm9tICduZXh0L3NlcnZlcidcclxuaW1wb3J0IHR5cGUgeyAgfSBmcm9tICduZXh0L3NlcnZlcidcclxuXHJcbmNvbnN0IHB1YmxpY1JvdXRlcyA9IFtdXHJcbmNvbnN0IFJFRElSRUNUX1dIRU5fTk9UX0FVVEhFTlRJQ0FURURfUk9VVEU9J3NpZ24taW4nXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWlkZGxld2FyZShyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIGNvbnNvbGUubG9nKFwiZnVuY2lvbm91XCIpO1xyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UubmV4dCgpXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xyXG4gIG1hdGNoZXI6IFtcclxuICAgIC8qXHJcbiAgICAgKiBNYXRjaCBhbGwgcmVxdWVzdCBwYXRocyBleGNlcHQgZm9yIHRoZSBvbmVzIHN0YXJ0aW5nIHdpdGg6XHJcbiAgICAgKiAtIGFwaSAoQVBJIHJvdXRlcylcclxuICAgICAqIC0gX25leHQvc3RhdGljIChzdGF0aWMgZmlsZXMpXHJcbiAgICAgKiAtIF9uZXh0L2ltYWdlIChpbWFnZSBvcHRpbWl6YXRpb24gZmlsZXMpXHJcbiAgICAgKiAtIGZhdmljb24uaWNvLCBzaXRlbWFwLnhtbCwgcm9ib3RzLnR4dCAobWV0YWRhdGEgZmlsZXMpXHJcbiAgICAgKi9cclxuICAgICcvKCg/IWFwaXxfbmV4dC9zdGF0aWN8X25leHQvaW1hZ2V8ZmF2aWNvbi5pY298c2l0ZW1hcC54bWx8cm9ib3RzLnR4dCkuKiknLFxyXG4gIF0sXHJcbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicHVibGljUm91dGVzIiwiUkVESVJFQ1RfV0hFTl9OT1RfQVVUSEVOVElDQVRFRF9ST1VURSIsIm1pZGRsZXdhcmUiLCJyZXF1ZXN0IiwiY29uc29sZSIsImxvZyIsIm5leHQiLCJjb25maWciLCJtYXRjaGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});