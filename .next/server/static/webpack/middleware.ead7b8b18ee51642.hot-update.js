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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(middleware)/./node_modules/next/dist/esm/server/web/exports/next-response.js\");\n\nconst publicRoutes = [];\nconst REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = \"sign-in\";\nfunction middleware(request) {\n    console.log(\"funcionou\");\n    return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].next();\n}\n// Opcional: Filtro mais específico para melhor performance\nconst config = {\n    matcher: [\n        /*\r\n     * Match all request paths except for the ones starting with:\r\n     * - api (API routes)\r\n     * - _next/static (static files)\r\n     * - _next/image (image optimization files)\r\n     * - favicon.ico, sitemap.xml, robots.txt (metadata files)\r\n     */ \"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBaUY7QUFHakYsTUFBTUMsZUFBZSxFQUFFO0FBQ3ZCLE1BQU1DLHdDQUFzQztBQUVyQyxTQUFTQyxXQUFXQyxPQUFvQjtJQUM3Q0MsUUFBUUMsR0FBRyxDQUFDO0lBQ1osT0FBT04sdUZBQWlCO0FBQzFCO0FBRUEsMkRBQTJEO0FBQ3BELE1BQU1RLFNBQVM7SUFDcEJDLFNBQVM7UUFDUDs7Ozs7O0tBTUMsR0FDRDtLQUNEO0FBQ0gsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9taWRkbGV3YXJlLnRzPzQyMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlLCB0eXBlIE5leHRSZXF1ZXN0LCB0eXBlIE5leHRNaWRkbGV3YXJlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXHJcbmltcG9ydCB0eXBlIHsgIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXHJcblxyXG5jb25zdCBwdWJsaWNSb3V0ZXMgPSBbXVxyXG5jb25zdCBSRURJUkVDVF9XSEVOX05PVF9BVVRIRU5USUNBVEVEX1JPVVRFPSdzaWduLWluJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1pZGRsZXdhcmUocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICBjb25zb2xlLmxvZyhcImZ1bmNpb25vdVwiKTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLm5leHQoKVxyXG59XHJcblxyXG4vLyBPcGNpb25hbDogRmlsdHJvIG1haXMgZXNwZWPDrWZpY28gcGFyYSBtZWxob3IgcGVyZm9ybWFuY2VcclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBtYXRjaGVyOiBbXHJcbiAgICAvKlxyXG4gICAgICogTWF0Y2ggYWxsIHJlcXVlc3QgcGF0aHMgZXhjZXB0IGZvciB0aGUgb25lcyBzdGFydGluZyB3aXRoOlxyXG4gICAgICogLSBhcGkgKEFQSSByb3V0ZXMpXHJcbiAgICAgKiAtIF9uZXh0L3N0YXRpYyAoc3RhdGljIGZpbGVzKVxyXG4gICAgICogLSBfbmV4dC9pbWFnZSAoaW1hZ2Ugb3B0aW1pemF0aW9uIGZpbGVzKVxyXG4gICAgICogLSBmYXZpY29uLmljbywgc2l0ZW1hcC54bWwsIHJvYm90cy50eHQgKG1ldGFkYXRhIGZpbGVzKVxyXG4gICAgICovXHJcbiAgICAnLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvfHNpdGVtYXAueG1sfHJvYm90cy50eHQpLiopJyxcclxuICBdLFxyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInB1YmxpY1JvdXRlcyIsIlJFRElSRUNUX1dIRU5fTk9UX0FVVEhFTlRJQ0FURURfUk9VVEUiLCJtaWRkbGV3YXJlIiwicmVxdWVzdCIsImNvbnNvbGUiLCJsb2ciLCJuZXh0IiwiY29uZmlnIiwibWF0Y2hlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});