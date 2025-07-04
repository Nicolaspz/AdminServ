/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/AuthContext.tsx":
/*!**********************************!*\
  !*** ./contexts/AuthContext.tsx ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthContext: () => (/* binding */ AuthContext),\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   signOut: () => (/* binding */ signOut)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! nookies */ \"nookies\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nookies__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toastify */ \"react-toastify\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _services_apiClients__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/apiClients */ \"./services/apiClients.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([react_toastify__WEBPACK_IMPORTED_MODULE_3__, _services_apiClients__WEBPACK_IMPORTED_MODULE_5__]);\n([react_toastify__WEBPACK_IMPORTED_MODULE_3__, _services_apiClients__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\nfunction signOut() {\n    try {\n        (0,nookies__WEBPACK_IMPORTED_MODULE_2__.destroyCookie)(undefined, \"@sujeitopizza.token\");\n        next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/\");\n    } catch  {\n    // console.log('erro ao deslogar')\n    }\n}\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const isAuthenticated = !!user?.token;\n    const inactivityTimeout = 15 * 60 * 1000;\n    let inactivityTimer;\n    const resetInactivityTimer = ()=>{\n        clearTimeout(inactivityTimer);\n        inactivityTimer = setTimeout(()=>{\n            signOut(); // Chama a função de logout após o tempo de inatividade\n        }, inactivityTimeout);\n    };\n    const handleUserInteraction = ()=>{\n        resetInactivityTimer();\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const checkToken = async ()=>{\n            try {\n                const { \"@sujeitopizza.token\": token } = (0,nookies__WEBPACK_IMPORTED_MODULE_2__.parseCookies)();\n                if (token) {\n                    const response = await _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.get(\"/me\");\n                    const { id, name, email, role, organizationId, user_name } = response.data;\n                    const orgData = response.data.Organization || {};\n                    setUser({\n                        id,\n                        name,\n                        email,\n                        role,\n                        user_name,\n                        token,\n                        organizationId,\n                        address: orgData.address || null,\n                        imageLogo: orgData.imageLogo || null,\n                        nif: orgData.nif || null,\n                        activeLicense: orgData.activeLicense || null,\n                        name_org: orgData.name || \"\"\n                    });\n                    _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.defaults.headers[\"Authorization\"] = `Bearer ${token}`;\n                    console.log(\"usuario\", user);\n                }\n            } catch (error) {\n                console.error(\"Erro ao verificar token:\", error);\n                signOut();\n            }\n        };\n        checkToken(); // Verifica o token ao carregar o componente\n        // Adiciona event listeners para redefinir o temporizador em interações do usuário\n        window.addEventListener(\"mousemove\", handleUserInteraction);\n        window.addEventListener(\"mousedown\", handleUserInteraction);\n        window.addEventListener(\"keydown\", handleUserInteraction);\n        // Inicia o temporizador quando o componente é montado\n        resetInactivityTimer();\n        return ()=>{\n            // Remove os event listeners e limpa o temporizador quando o componente é desmontado\n            window.removeEventListener(\"mousemove\", handleUserInteraction);\n            window.removeEventListener(\"mousedown\", handleUserInteraction);\n            window.removeEventListener(\"keydown\", handleUserInteraction);\n            clearTimeout(inactivityTimer);\n        };\n    // Restante do seu código...\n    }, []);\n    async function signIn({ credential, password }) {\n        try {\n            const response = await _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.post(\"/session\", {\n                credential,\n                password\n            });\n            //console.log(\"logado\",response)\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.success(\"Logado com sucesso!\");\n            //console.log(\"Response-> \",response.data)\n            const { id, name, email, user_name, token, role, organizationId } = response.data;\n            const { address, imageLogo, nif, activeLicense } = response.data.Organization;\n            const dados = response.data.Organization;\n            //console.log(\"aqui\", {token});\n            (0,nookies__WEBPACK_IMPORTED_MODULE_2__.setCookie)(undefined, \"@sujeitopizza.token\", token, {\n                maxAge: 60 * 60 * 24 * 30,\n                path: \"/\" // Quais caminhos terao acesso ao cookie\n            });\n            setUser({\n                id,\n                name,\n                role,\n                token,\n                user_name,\n                organizationId,\n                address,\n                imageLogo,\n                nif,\n                activeLicense,\n                name_org: dados.name\n            });\n            //console.log(\"usuario logado\", user);\n            //Passar para proximas requisiçoes o nosso token\n            _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.defaults.headers[\"Authorization\"] = `Bearer ${token}`;\n            next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/dashboard\");\n        } catch (err) {\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.error(\"Erro ao Logar\");\n            console.log(\"erro aki\", err);\n        }\n    }\n    async function signUp({ name, email, role, user_name }) {\n        try {\n            const response = await _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.post(\"/users\", {\n                name,\n                email,\n                role,\n                user_name\n            });\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.success(\"Cadastrado com sucesso!\");\n            next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/cardapio\");\n        } catch (err) {\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.error(\"Erro ao se Cadastrar\");\n        }\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            isAuthenticated,\n            signIn,\n            signOut,\n            signUp\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\PC-WEE-LPT012\\\\Desktop\\\\SR\\\\pizzaria\\\\Admin_Web\\\\contexts\\\\AuthContext.tsx\",\n        lineNumber: 209,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM7UUFDZDtJQUNGO0lBRUEscUJBQ0UsOERBQUNyQyxZQUFZbUQsUUFBUTtRQUFDQyxPQUFPO1lBQUU5QztZQUFNRTtZQUFpQmlDO1lBQVF4QztZQUFRaUQ7UUFBTTtrQkFDekU3Qzs7Ozs7O0FBR1AiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWRhc2gvLi9jb250ZXh0cy9BdXRoQ29udGV4dC50c3g/NmQ4MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCBSZWFjdE5vZGUsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHtkZXN0cm95Q29va2llLHNldENvb2tpZSxwYXJzZUNvb2tpZXN9IGZyb20gJ25vb2tpZXMnXHJcbmltcG9ydCB7dG9hc3R9IGZyb20gJ3JlYWN0LXRvYXN0aWZ5J1xyXG5pbXBvcnQgUm91dGVyIGZyb20gJ25leHQvcm91dGVyJ1xyXG5cclxuaW1wb3J0IHsgYXBpIH0gZnJvbSAnLi4vc2VydmljZXMvYXBpQ2xpZW50cyc7XHJcblxyXG5cclxuXHJcbnR5cGUgQXV0aENvbnRleHREYXRhID0ge1xyXG4gIHVzZXI6IFVzZXJQcm9wcztcclxuICBpc0F1dGhlbnRpY2F0ZWQ6IGJvb2xlYW47XHJcbiAgc2lnbkluOiAoY3JlZGVudGlhbHM6IFNpZ25JblByb3BzKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIHNpZ25PdXQ6ICgpID0+IHZvaWQ7XHJcbiAgc2lnblVwOiAoY3JlZGVudGlhbHM6IFNpZ25VcFByb3BzKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG59XHJcblxyXG50eXBlIFVzZXJQcm9wcyA9IHtcclxuICBpZD86IHN0cmluZztcclxuICBuYW1lPzogc3RyaW5nO1xyXG4gIGVtYWlsPzogc3RyaW5nO1xyXG4gIHRva2VuPzogc3RyaW5nOyAvLyBUb3JuYWRvIG9wY2lvbmFsXHJcbiAgcm9sZT86IHN0cmluZztcclxuICB0ZWxlZm9uZT86IHN0cmluZztcclxuICBvcmdhbml6YXRpb25JZD86IHN0cmluZztcclxuICB1c2VyX25hbWU/OiBzdHJpbmc7XHJcbiAgYWRkcmVzcz86IHN0cmluZyB8IG51bGw7XHJcbiAgaW1hZ2VMb2dvPzogc3RyaW5nIHwgbnVsbDtcclxuICBuaWY/OiBzdHJpbmcgfCBudWxsO1xyXG4gIGFjdGl2ZUxpY2Vuc2U/OiBzdHJpbmcgfCBib29sZWFuIHwgbnVsbDtcclxuICBuYW1lX29yZz86IHN0cmluZztcclxufVxyXG5cclxudHlwZSBTaWduSW5Qcm9wcyA9IHtcclxuICBjcmVkZW50aWFsOiBzdHJpbmc7XHJcbiAgcGFzc3dvcmQ6IHN0cmluZztcclxufVxyXG5cclxudHlwZSBTaWduVXBQcm9wcyA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBlbWFpbDogc3RyaW5nO1xyXG4gIHJvbGU6IHN0cmluZztcclxuICB0ZWxlZm9uZTogc3RyaW5nO1xyXG4gIG9yZ2FuaXphdGlvbklkOiBzdHJpbmc7XHJcbiAgdXNlcl9uYW1lOiBzdHJpbmc7XHJcbiAgYWRkcmVzcz86IHN0cmluZyxcclxuXHRpbWFnZUxvZ286IHN0cmluZyxcclxuXHRuaWY6IHN0cmluZyxcclxuXHRhY3RpdmVMaWNlbnNlOiBzdHJpbmcsXHJcblx0bmFtZV9vcmc6IHN0cmluZ1xyXG59XHJcblxyXG50eXBlIEF1dGhQcm92aWRlclByb3BzID0ge1xyXG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe30gYXMgQXV0aENvbnRleHREYXRhKVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaWduT3V0KCl7XHJcbiAgdHJ5e1xyXG4gICAgZGVzdHJveUNvb2tpZSh1bmRlZmluZWQsICdAc3VqZWl0b3BpenphLnRva2VuJylcclxuICAgIFJvdXRlci5wdXNoKCcvJylcclxuICB9Y2F0Y2h7XHJcbiAgIC8vIGNvbnNvbGUubG9nKCdlcnJvIGFvIGRlc2xvZ2FyJylcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiBBdXRoUHJvdmlkZXJQcm9wcyl7XHJcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlclByb3BzIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gISF1c2VyPy50b2tlbjtcclxuICBjb25zdCBpbmFjdGl2aXR5VGltZW91dCA9IDE1ICogNjAgKiAxMDAwOyBcclxuICBsZXQgaW5hY3Rpdml0eVRpbWVyOiBOb2RlSlMuVGltZW91dDtcclxuXHJcbiAgY29uc3QgcmVzZXRJbmFjdGl2aXR5VGltZXIgPSAoKSA9PiB7XHJcbiAgICBjbGVhclRpbWVvdXQoaW5hY3Rpdml0eVRpbWVyKTtcclxuICAgIGluYWN0aXZpdHlUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBzaWduT3V0KCk7IC8vIENoYW1hIGEgZnVuw6fDo28gZGUgbG9nb3V0IGFww7NzIG8gdGVtcG8gZGUgaW5hdGl2aWRhZGVcclxuICAgIH0sIGluYWN0aXZpdHlUaW1lb3V0KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVVc2VySW50ZXJhY3Rpb24gPSAoKSA9PiB7XHJcbiAgICByZXNldEluYWN0aXZpdHlUaW1lcigpO1xyXG4gIH07XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiAge1xyXG4gICAgY29uc3QgY2hlY2tUb2tlbiA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7ICdAc3VqZWl0b3BpenphLnRva2VuJzogdG9rZW4gfSA9IHBhcnNlQ29va2llcygpO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoJy9tZScpO1xyXG4gICAgICAgICAgY29uc3QgeyBpZCwgbmFtZSwgZW1haWwsIHJvbGUsIG9yZ2FuaXphdGlvbklkLCB1c2VyX25hbWUgfSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICBjb25zdCBvcmdEYXRhID0gcmVzcG9uc2UuZGF0YS5Pcmdhbml6YXRpb24gfHwge307XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHNldFVzZXIoe1xyXG4gICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgICAgIHJvbGUsXHJcbiAgICAgICAgICAgIHVzZXJfbmFtZSxcclxuICAgICAgICAgICAgdG9rZW4sIC8vIEdhcmFudGEgcXVlIG8gdG9rZW4gZXN0w6Egc2VuZG8gc2V0YWRvXHJcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbklkLFxyXG4gICAgICAgICAgICBhZGRyZXNzOiBvcmdEYXRhLmFkZHJlc3MgfHwgbnVsbCxcclxuICAgICAgICAgICAgaW1hZ2VMb2dvOiBvcmdEYXRhLmltYWdlTG9nbyB8fCBudWxsLFxyXG4gICAgICAgICAgICBuaWY6IG9yZ0RhdGEubmlmIHx8IG51bGwsXHJcbiAgICAgICAgICAgIGFjdGl2ZUxpY2Vuc2U6IG9yZ0RhdGEuYWN0aXZlTGljZW5zZSB8fCBudWxsLFxyXG4gICAgICAgICAgICBuYW1lX29yZzogb3JnRGF0YS5uYW1lIHx8ICcnXHJcbiAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgYXBpLmRlZmF1bHRzLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0b2tlbn1gO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJ1c3VhcmlvXCIsIHVzZXIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvIGFvIHZlcmlmaWNhciB0b2tlbjpcIiwgZXJyb3IpO1xyXG4gICAgICAgIHNpZ25PdXQoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG5cclxuICAgIGNoZWNrVG9rZW4oKTsgLy8gVmVyaWZpY2EgbyB0b2tlbiBhbyBjYXJyZWdhciBvIGNvbXBvbmVudGVcclxuXHJcbiAgICAvLyBBZGljaW9uYSBldmVudCBsaXN0ZW5lcnMgcGFyYSByZWRlZmluaXIgbyB0ZW1wb3JpemFkb3IgZW0gaW50ZXJhw6fDtWVzIGRvIHVzdcOhcmlvXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlVXNlckludGVyYWN0aW9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVVc2VySW50ZXJhY3Rpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVVc2VySW50ZXJhY3Rpb24pO1xyXG5cclxuICAgIC8vIEluaWNpYSBvIHRlbXBvcml6YWRvciBxdWFuZG8gbyBjb21wb25lbnRlIMOpIG1vbnRhZG9cclxuICAgIHJlc2V0SW5hY3Rpdml0eVRpbWVyKCk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgLy8gUmVtb3ZlIG9zIGV2ZW50IGxpc3RlbmVycyBlIGxpbXBhIG8gdGVtcG9yaXphZG9yIHF1YW5kbyBvIGNvbXBvbmVudGUgw6kgZGVzbW9udGFkb1xyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlVXNlckludGVyYWN0aW9uKTtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVVzZXJJbnRlcmFjdGlvbik7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlVXNlckludGVyYWN0aW9uKTtcclxuICAgICAgY2xlYXJUaW1lb3V0KGluYWN0aXZpdHlUaW1lcik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFJlc3RhbnRlIGRvIHNldSBjw7NkaWdvLi4uXHJcblxyXG4gIH0sIFtdKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc2lnbkluKHsgY3JlZGVudGlhbCwgcGFzc3dvcmQgfTogU2lnbkluUHJvcHMpe1xyXG4gICAgdHJ5e1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5wb3N0KCcvc2Vzc2lvbicsIHtcclxuICAgICAgICBjcmVkZW50aWFsLFxyXG4gICAgICAgIHBhc3N3b3JkXHJcbiAgICAgIH0pXHJcbiAgICAgIFxyXG4gICAgICAvL2NvbnNvbGUubG9nKFwibG9nYWRvXCIscmVzcG9uc2UpXHJcbiAgICAgIHRvYXN0LnN1Y2Nlc3MoXCJMb2dhZG8gY29tIHN1Y2Vzc28hXCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwiUmVzcG9uc2UtPiBcIixyZXNwb25zZS5kYXRhKVxyXG4gICAgICBjb25zdCB7IGlkLCBuYW1lLCBlbWFpbCwgdXNlcl9uYW1lLCB0b2tlbiwgcm9sZSwgb3JnYW5pemF0aW9uSWQgfSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgIGNvbnN0IHsgYWRkcmVzcyxpbWFnZUxvZ28sbmlmLGFjdGl2ZUxpY2Vuc2V9ID0gcmVzcG9uc2UuZGF0YS5Pcmdhbml6YXRpb247XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IGRhZG9zID0gcmVzcG9uc2UuZGF0YS5Pcmdhbml6YXRpb247XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJhcXVpXCIsIHt0b2tlbn0pO1xyXG4gICAgICBzZXRDb29raWUodW5kZWZpbmVkLCAnQHN1amVpdG9waXp6YS50b2tlbicsIHRva2VuLCB7XHJcbiAgICAgICAgbWF4QWdlOiA2MCAqIDYwICogMjQgKiAzMCwgLy8gRXhwaXJhciBlbSAxIG1lc1xyXG4gICAgICAgIHBhdGg6IFwiL1wiIC8vIFF1YWlzIGNhbWluaG9zIHRlcmFvIGFjZXNzbyBhbyBjb29raWVcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHNldFVzZXIoe1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgcm9sZSxcclxuICAgICAgICB0b2tlbixcclxuICAgICAgICB1c2VyX25hbWUsXHJcbiAgICAgICAgb3JnYW5pemF0aW9uSWQsIGFkZHJlc3MsXHJcbiAgICAgICAgaW1hZ2VMb2dvLFxyXG4gICAgICAgIG5pZixcclxuICAgICAgICBhY3RpdmVMaWNlbnNlLFxyXG4gICAgICAgIG5hbWVfb3JnOmRhZG9zLm5hbWUsXHJcbiAgICAgIH0pXHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJ1c3VhcmlvIGxvZ2Fkb1wiLCB1c2VyKTtcclxuICAgICAgLy9QYXNzYXIgcGFyYSBwcm94aW1hcyByZXF1aXNpw6dvZXMgbyBub3NzbyB0b2tlblxyXG4gICAgICBhcGkuZGVmYXVsdHMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3Rva2VufWBcclxuICAgICAgXHJcbiAgICAgICAgUm91dGVyLnB1c2goJy9kYXNoYm9hcmQnKTtcclxuICAgICBcclxuICAgIH1jYXRjaChlcnIpe1xyXG4gICAgICB0b2FzdC5lcnJvcihcIkVycm8gYW8gTG9nYXJcIilcclxuICAgICAgY29uc29sZS5sb2coXCJlcnJvIGFraVwiLGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc2lnblVwKHsgbmFtZSwgZW1haWwscm9sZSx1c2VyX25hbWV9OiBTaWduVXBQcm9wcyl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5wb3N0KCcvdXNlcnMnLCB7XHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICByb2xlLFxyXG4gICAgICAgIHVzZXJfbmFtZVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdG9hc3Quc3VjY2VzcyhcIkNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hXCIpXHJcblxyXG4gICAgICBSb3V0ZXIucHVzaCgnL2NhcmRhcGlvJylcclxuXHJcbiAgICB9Y2F0Y2goZXJyKXtcclxuICAgICAgdG9hc3QuZXJyb3IoXCJFcnJvIGFvIHNlIENhZGFzdHJhclwiKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuKFxyXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHVzZXIsIGlzQXV0aGVudGljYXRlZCwgc2lnbkluLCBzaWduT3V0LHNpZ25VcH19PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gIClcclxufSJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJkZXN0cm95Q29va2llIiwic2V0Q29va2llIiwicGFyc2VDb29raWVzIiwidG9hc3QiLCJSb3V0ZXIiLCJhcGkiLCJBdXRoQ29udGV4dCIsInNpZ25PdXQiLCJ1bmRlZmluZWQiLCJwdXNoIiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ1c2VyIiwic2V0VXNlciIsImlzQXV0aGVudGljYXRlZCIsInRva2VuIiwiaW5hY3Rpdml0eVRpbWVvdXQiLCJpbmFjdGl2aXR5VGltZXIiLCJyZXNldEluYWN0aXZpdHlUaW1lciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJoYW5kbGVVc2VySW50ZXJhY3Rpb24iLCJjaGVja1Rva2VuIiwicmVzcG9uc2UiLCJnZXQiLCJpZCIsIm5hbWUiLCJlbWFpbCIsInJvbGUiLCJvcmdhbml6YXRpb25JZCIsInVzZXJfbmFtZSIsImRhdGEiLCJvcmdEYXRhIiwiT3JnYW5pemF0aW9uIiwiYWRkcmVzcyIsImltYWdlTG9nbyIsIm5pZiIsImFjdGl2ZUxpY2Vuc2UiLCJuYW1lX29yZyIsImRlZmF1bHRzIiwiaGVhZGVycyIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2lnbkluIiwiY3JlZGVudGlhbCIsInBhc3N3b3JkIiwicG9zdCIsInN1Y2Nlc3MiLCJkYWRvcyIsIm1heEFnZSIsInBhdGgiLCJlcnIiLCJzaWduVXAiLCJQcm92aWRlciIsInZhbHVlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/AuthContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toastify */ \"react-toastify\");\n/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.css */ \"./node_modules/react-toastify/dist/ReactToastify.css\");\n/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_4__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__, react_toastify__WEBPACK_IMPORTED_MODULE_3__]);\n([_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__, react_toastify__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\PC-WEE-LPT012\\\\Desktop\\\\SR\\\\pizzaria\\\\Admin_Web\\\\pages\\\\_app.tsx\",\n                lineNumber: 11,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_toastify__WEBPACK_IMPORTED_MODULE_3__.ToastContainer, {\n                autoClose: 3000\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\PC-WEE-LPT012\\\\Desktop\\\\SR\\\\pizzaria\\\\Admin_Web\\\\pages\\\\_app.tsx\",\n                lineNumber: 12,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\PC-WEE-LPT012\\\\Desktop\\\\SR\\\\pizzaria\\\\Admin_Web\\\\pages\\\\_app.tsx\",\n        lineNumber: 10,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQStCO0FBR3dCO0FBQ1A7QUFDRDtBQUVoQyxTQUFTRSxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ2xELHFCQUNFLDhEQUFDSiwrREFBWUE7OzBCQUNYLDhEQUFDRztnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7MEJBQ3hCLDhEQUFDSCwwREFBY0E7Z0JBQUNJLFdBQVc7Ozs7Ozs7Ozs7OztBQUdqQyIsInNvdXJjZXMiOlsid2VicGFjazovL25leHQtZGFzaC8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgU2lkZWJhciBmcm9tICcuLi9jb21wb25lbnRzL1NpZGViYXInO1xyXG5cclxuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dHMvQXV0aENvbnRleHQnO1xyXG5pbXBvcnQgeyBUb2FzdENvbnRhaW5lciB9IGZyb20gJ3JlYWN0LXRvYXN0aWZ5JztcclxuaW1wb3J0ICdyZWFjdC10b2FzdGlmeS9kaXN0L1JlYWN0VG9hc3RpZnkuY3NzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICA8VG9hc3RDb250YWluZXIgYXV0b0Nsb3NlPXszMDAwfSAvPlxyXG4gICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiVG9hc3RDb250YWluZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJhdXRvQ2xvc2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./services/api.ts":
/*!*************************!*\
  !*** ./services/api.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupAPIClient: () => (/* binding */ setupAPIClient)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nookies */ \"nookies\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nookies__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _errors_AuthTokenError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors/AuthTokenError */ \"./services/errors/AuthTokenError.ts\");\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__]);\n([axios__WEBPACK_IMPORTED_MODULE_0__, _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\nfunction setupAPIClient(ctx = undefined) {\n    let cookies = (0,nookies__WEBPACK_IMPORTED_MODULE_1__.parseCookies)(ctx);\n    const api = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n        baseURL: \"http://localhost:3333\",\n        headers: {\n            Authorization: `Bearer ${cookies[\"@sujeitopizza.token\"]}`\n        }\n    });\n    api.interceptors.response.use((response)=>{\n        return response;\n    }, (error)=>{\n        if (error.response.status === 401) {\n            // qualquer erro 401 (não autorizado) devemos deslogar o usuário\n            if (true) {\n                // Estamos no lado do servidor, então você não deve chamar singOut() aqui\n                return Promise.reject(new _errors_AuthTokenError__WEBPACK_IMPORTED_MODULE_2__.AuthTokenError());\n            } else {}\n        }\n        return Promise.reject(error);\n    });\n    return api;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zZXJ2aWNlcy9hcGkudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXlDO0FBQ0g7QUFDa0I7QUFFTjtBQUUzQyxTQUFTSSxlQUFlQyxNQUFNQyxTQUFTO0lBQzVDLElBQUlDLFVBQVVOLHFEQUFZQSxDQUFDSTtJQUUzQixNQUFNRyxNQUFNUixvREFBWSxDQUFDO1FBQ3ZCVSxTQUFRO1FBQ1JDLFNBQVM7WUFDUEMsZUFBZSxDQUFDLE9BQU8sRUFBRUwsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDM0Q7SUFDRjtJQUVBQyxJQUFJSyxZQUFZLENBQUNDLFFBQVEsQ0FBQ0MsR0FBRyxDQUFDRCxDQUFBQTtRQUM1QixPQUFPQTtJQUNULEdBQUcsQ0FBQ0U7UUFDRixJQUFJQSxNQUFNRixRQUFRLENBQUNHLE1BQU0sS0FBSyxLQUFLO1lBQ2pDLGdFQUFnRTtZQUNoRSxJQUFJLElBQWtCLEVBQWE7Z0JBQ2pDLHlFQUF5RTtnQkFDekUsT0FBT0MsUUFBUUMsTUFBTSxDQUFDLElBQUlqQixrRUFBY0E7WUFDMUMsT0FBTyxFQUdOO1FBQ0g7UUFDRixPQUFPZ0IsUUFBUUMsTUFBTSxDQUFDSDtJQUN0QjtJQUVBLE9BQU9SO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWRhc2gvLi9zZXJ2aWNlcy9hcGkudHM/NGJlNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NFcnJvciB9IGZyb20gJ2F4aW9zJ1xyXG5pbXBvcnQgeyBwYXJzZUNvb2tpZXMgfSBmcm9tICdub29raWVzJ1xyXG5pbXBvcnQgeyBBdXRoVG9rZW5FcnJvciB9IGZyb20gJy4vZXJyb3JzL0F1dGhUb2tlbkVycm9yJ1xyXG5cclxuaW1wb3J0IHsgc2lnbk91dCB9IGZyb20gJy4uL2NvbnRleHRzL0F1dGhDb250ZXh0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEFQSUNsaWVudChjdHggPSB1bmRlZmluZWQpIHtcclxuICBsZXQgY29va2llcyA9IHBhcnNlQ29va2llcyhjdHgpO1xyXG5cclxuICBjb25zdCBhcGkgPSBheGlvcy5jcmVhdGUoe1xyXG4gICAgYmFzZVVSTDonaHR0cDovL2xvY2FsaG9zdDozMzMzJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2Nvb2tpZXNbJ0BzdWplaXRvcGl6emEudG9rZW4nXX1gXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgYXBpLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UocmVzcG9uc2UgPT4ge1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gIH0sIChlcnJvcjogQXhpb3NFcnJvcikgPT4ge1xyXG4gICAgaWYgKGVycm9yLnJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgIC8vIHF1YWxxdWVyIGVycm8gNDAxIChuw6NvIGF1dG9yaXphZG8pIGRldmVtb3MgZGVzbG9nYXIgbyB1c3XDoXJpb1xyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBFc3RhbW9zIG5vIGxhZG8gZG8gc2Vydmlkb3IsIGVudMOjbyB2b2PDqiBuw6NvIGRldmUgY2hhbWFyIHNpbmdPdXQoKSBhcXVpXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBdXRoVG9rZW5FcnJvcigpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBFc3RhbW9zIG5vIGxhZG8gZG8gY2xpZW50ZSwgZW50w6NvIMOpIHNlZ3VybyBjaGFtYXIgc2luZ091dCgpXHJcbiAgICAgICAgc2lnbk91dCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gIH0pXHJcblxyXG4gIHJldHVybiBhcGk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImF4aW9zIiwicGFyc2VDb29raWVzIiwiQXV0aFRva2VuRXJyb3IiLCJzaWduT3V0Iiwic2V0dXBBUElDbGllbnQiLCJjdHgiLCJ1bmRlZmluZWQiLCJjb29raWVzIiwiYXBpIiwiY3JlYXRlIiwiYmFzZVVSTCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiaW50ZXJjZXB0b3JzIiwicmVzcG9uc2UiLCJ1c2UiLCJlcnJvciIsInN0YXR1cyIsIlByb21pc2UiLCJyZWplY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./services/api.ts\n");

/***/ }),

/***/ "./services/apiClients.ts":
/*!********************************!*\
  !*** ./services/apiClients.ts ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   api: () => (/* binding */ api)\n/* harmony export */ });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./services/api.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_api__WEBPACK_IMPORTED_MODULE_0__]);\n_api__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst api = (0,_api__WEBPACK_IMPORTED_MODULE_0__.setupAPIClient)();\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zZXJ2aWNlcy9hcGlDbGllbnRzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVDO0FBR2hDLE1BQU1DLE1BQU1ELG9EQUFjQSxHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC1kYXNoLy4vc2VydmljZXMvYXBpQ2xpZW50cy50cz8wOTU5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNldHVwQVBJQ2xpZW50IH0gZnJvbSBcIi4vYXBpXCI7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGFwaSA9IHNldHVwQVBJQ2xpZW50KCk7Il0sIm5hbWVzIjpbInNldHVwQVBJQ2xpZW50IiwiYXBpIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./services/apiClients.ts\n");

/***/ }),

/***/ "./services/errors/AuthTokenError.ts":
/*!*******************************************!*\
  !*** ./services/errors/AuthTokenError.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthTokenError: () => (/* binding */ AuthTokenError)\n/* harmony export */ });\nclass AuthTokenError extends Error {\n    constructor(){\n        super(\"error with authrntication token\");\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zZXJ2aWNlcy9lcnJvcnMvQXV0aFRva2VuRXJyb3IudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPLE1BQU1BLHVCQUF1QkM7SUFDbENDLGFBQWE7UUFDWCxLQUFLLENBQUM7SUFDUjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC1kYXNoLy4vc2VydmljZXMvZXJyb3JzL0F1dGhUb2tlbkVycm9yLnRzP2YxYWUiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEF1dGhUb2tlbkVycm9yIGV4dGVuZHMgRXJyb3J7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHN1cGVyKCdlcnJvciB3aXRoIGF1dGhybnRpY2F0aW9uIHRva2VuJylcclxuICB9XHJcbn0iXSwibmFtZXMiOlsiQXV0aFRva2VuRXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./services/errors/AuthTokenError.ts\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "nookies":
/*!**************************!*\
  !*** external "nookies" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("nookies");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "react-toastify":
/*!*********************************!*\
  !*** external "react-toastify" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-toastify");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc","vendor-chunks/react-toastify"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();