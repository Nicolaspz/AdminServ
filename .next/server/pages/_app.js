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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthContext: () => (/* binding */ AuthContext),\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   signOut: () => (/* binding */ signOut)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! nookies */ \"nookies\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nookies__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toastify */ \"react-toastify\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _services_apiClients__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/apiClients */ \"./services/apiClients.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([react_toastify__WEBPACK_IMPORTED_MODULE_3__, _services_apiClients__WEBPACK_IMPORTED_MODULE_5__]);\n([react_toastify__WEBPACK_IMPORTED_MODULE_3__, _services_apiClients__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\nfunction signOut() {\n    try {\n        (0,nookies__WEBPACK_IMPORTED_MODULE_2__.destroyCookie)(undefined, \"@sujeitopizza.token\");\n        next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/\");\n    } catch  {\n        console.log(\"erro ao deslogar\");\n    }\n}\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        id: \"\",\n        name: \"\",\n        email: \"\",\n        token: \"\",\n        role: \"\",\n        telefone: \"\",\n        user_name: \"\",\n        organizationId: \"\"\n    });\n    const isAuthenticated = !!user;\n    const inactivityTimeout = 15 * 60 * 1000;\n    let inactivityTimer;\n    const resetInactivityTimer = ()=>{\n        clearTimeout(inactivityTimer);\n        inactivityTimer = setTimeout(()=>{\n            signOut(); // Chama a função de logout após o tempo de inatividade\n        }, inactivityTimeout);\n    };\n    const handleUserInteraction = ()=>{\n        resetInactivityTimer();\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const checkToken = async ()=>{\n            try {\n                const { \"@sujeitopizza.token\": token } = (0,nookies__WEBPACK_IMPORTED_MODULE_2__.parseCookies)();\n                if (token) {\n                    const response = await _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.get(\"/me\");\n                    const { id, name, email, role, user_name } = response.data;\n                    console.log(\"me\", response.data);\n                    setUser({\n                        id,\n                        email,\n                        name,\n                        role,\n                        user_name,\n                        token\n                    });\n                    //console.log(\"Logado\");\n                    console.log(\"token->\", token);\n                }\n            } catch (error) {\n                console.log(\"Erro ao verificar o token\", error);\n                signOut();\n            }\n        };\n        checkToken(); // Verifica o token ao carregar o componente\n        // Adiciona event listeners para redefinir o temporizador em interações do usuário\n        window.addEventListener(\"mousemove\", handleUserInteraction);\n        window.addEventListener(\"mousedown\", handleUserInteraction);\n        window.addEventListener(\"keydown\", handleUserInteraction);\n        // Inicia o temporizador quando o componente é montado\n        resetInactivityTimer();\n        return ()=>{\n            // Remove os event listeners e limpa o temporizador quando o componente é desmontado\n            window.removeEventListener(\"mousemove\", handleUserInteraction);\n            window.removeEventListener(\"mousedown\", handleUserInteraction);\n            window.removeEventListener(\"keydown\", handleUserInteraction);\n            clearTimeout(inactivityTimer);\n        };\n    // Restante do seu código...\n    }, []);\n    async function signIn({ credential, password }) {\n        try {\n            const response = await _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.post(\"/session\", {\n                credential,\n                password\n            });\n            console.log(\"aqui\", response);\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.success(\"Logado com sucesso!\");\n            console.log(\"Response-> \", response.data);\n            const { id, name, email, user_name, token, role, organizationId } = response.data;\n            console.log(\"aqui\", {\n                token\n            });\n            (0,nookies__WEBPACK_IMPORTED_MODULE_2__.setCookie)(undefined, \"@sujeitopizza.token\", token, {\n                maxAge: 60 * 60 * 24 * 30,\n                path: \"/\" // Quais caminhos terao acesso ao cookie\n            });\n            setUser({\n                id,\n                name,\n                role,\n                token,\n                user_name,\n                organizationId,\n                email\n            });\n            console.log(\"aqui\", user);\n            //Passar para proximas requisiçoes o nosso token\n            _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.defaults.headers[\"Authorization\"] = `Bearer ${token}`;\n            next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/produt\");\n        } catch (err) {\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.error(\"Erro ao Logar\");\n            console.log(\"erro aki\", err);\n        }\n    }\n    async function signUp({ name, email, role, user_name }) {\n        try {\n            const response = await _services_apiClients__WEBPACK_IMPORTED_MODULE_5__.api.post(\"/users\", {\n                name,\n                email,\n                role,\n                user_name\n            });\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.success(\"Cadastrado com sucesso!\");\n            next_router__WEBPACK_IMPORTED_MODULE_4___default().push(\"/\");\n        } catch (err) {\n            react_toastify__WEBPACK_IMPORTED_MODULE_3__.toast.error(\"Erro ao se Cadastrar\");\n        }\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            isAuthenticated,\n            signIn,\n            signOut,\n            signUp\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\PC-WEE-LPT012\\\\Desktop\\\\SR\\\\pizzaria\\\\Admin_Web\\\\contexts\\\\AuthContext.tsx\",\n        lineNumber: 190,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QmxCLGtEQUFTQSxDQUFDTyxXQUFXLHVCQUF1QlcsT0FBTztnQkFDakR5QixRQUFRLEtBQUssS0FBSyxLQUFLO2dCQUN2QkMsTUFBTSxJQUFJLHdDQUF3QztZQUNwRDtZQUVBOUIsUUFBUTtnQkFDTkM7Z0JBQ0FDO2dCQUNBRztnQkFDQUQ7Z0JBQ0FHO2dCQUNBQztnQkFDQUw7WUFDRjtZQUNBUixRQUFRQyxHQUFHLENBQUMsUUFBUUc7WUFDcEIsZ0RBQWdEO1lBQ2hEVCxxREFBR0EsQ0FBQ3lDLFFBQVEsQ0FBQ0MsT0FBTyxDQUFDLGdCQUFnQixHQUFHLENBQUMsT0FBTyxFQUFFNUIsTUFBTSxDQUFDO1lBRXZEZix1REFBVyxDQUFDO1FBRWhCLEVBQUMsT0FBTTRDLEtBQUk7WUFDVDdDLGlEQUFLQSxDQUFDZ0MsS0FBSyxDQUFDO1lBQ1p6QixRQUFRQyxHQUFHLENBQUMsWUFBV3FDO1FBQ3pCO0lBQ0Y7SUFHQSxlQUFlQyxPQUFPLEVBQUVoQyxJQUFJLEVBQUVDLEtBQUssRUFBQ0UsSUFBSSxFQUFDRSxTQUFTLEVBQWM7UUFDOUQsSUFBRztZQUVELE1BQU1VLFdBQVcsTUFBTTNCLHFEQUFHQSxDQUFDcUMsSUFBSSxDQUFDLFVBQVU7Z0JBQ3hDekI7Z0JBQ0FDO2dCQUNBRTtnQkFDQUU7WUFDRjtZQUVBbkIsaURBQUtBLENBQUN3QyxPQUFPLENBQUM7WUFFZHZDLHVEQUFXLENBQUM7UUFFZCxFQUFDLE9BQU00QyxLQUFJO1lBQ1Q3QyxpREFBS0EsQ0FBQ2dDLEtBQUssQ0FBQztRQUNkO0lBQ0Y7SUFFQSxxQkFDRSw4REFBQzdCLFlBQVk0QyxRQUFRO1FBQUNDLE9BQU87WUFBRXJDO1lBQU1VO1lBQWlCZTtZQUFRaEM7WUFBUTBDO1FBQU07a0JBQ3pFcEM7Ozs7OztBQUdQIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC1kYXNoLy4vY29udGV4dHMvQXV0aENvbnRleHQudHN4PzZkODEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgUmVhY3ROb2RlLCB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7ZGVzdHJveUNvb2tpZSxzZXRDb29raWUscGFyc2VDb29raWVzfSBmcm9tICdub29raWVzJ1xyXG5pbXBvcnQge3RvYXN0fSBmcm9tICdyZWFjdC10b2FzdGlmeSdcclxuaW1wb3J0IFJvdXRlciBmcm9tICduZXh0L3JvdXRlcidcclxuXHJcbmltcG9ydCB7IGFwaSB9IGZyb20gJy4uL3NlcnZpY2VzL2FwaUNsaWVudHMnO1xyXG5cclxuXHJcblxyXG50eXBlIEF1dGhDb250ZXh0RGF0YSA9IHtcclxuICB1c2VyOiBVc2VyUHJvcHM7XHJcbiAgaXNBdXRoZW50aWNhdGVkOiBib29sZWFuO1xyXG4gIHNpZ25JbjogKGNyZWRlbnRpYWxzOiBTaWduSW5Qcm9wcykgPT4gUHJvbWlzZTx2b2lkPjtcclxuICBzaWduT3V0OiAoKSA9PiB2b2lkO1xyXG4gIHNpZ25VcDogKGNyZWRlbnRpYWxzOiBTaWduVXBQcm9wcykgPT4gUHJvbWlzZTx2b2lkPjtcclxufVxyXG5cclxudHlwZSBVc2VyUHJvcHMgPSB7XHJcbiAgaWQ/OiBzdHJpbmc7XHJcbiAgbmFtZT86IHN0cmluZztcclxuICBlbWFpbD86IHN0cmluZztcclxuICB0b2tlbjogc3RyaW5nO1xyXG4gIHJvbGU/OiBzdHJpbmc7XHJcbiAgdGVsZWZvbmU/OiBzdHJpbmc7XHJcbiAgb3JnYW5pemF0aW9uSWQ/OiBzdHJpbmc7XHJcbiAgdXNlcl9uYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG50eXBlIFNpZ25JblByb3BzID0ge1xyXG4gIGNyZWRlbnRpYWw6IHN0cmluZztcclxuICBwYXNzd29yZDogc3RyaW5nO1xyXG59XHJcblxyXG50eXBlIFNpZ25VcFByb3BzID0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGVtYWlsOiBzdHJpbmc7XHJcbiAgcm9sZTogc3RyaW5nO1xyXG4gIHRlbGVmb25lOiBzdHJpbmc7XHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZztcclxuICB1c2VyX25hbWU6IHN0cmluZzsgIFxyXG59XHJcblxyXG50eXBlIEF1dGhQcm92aWRlclByb3BzID0ge1xyXG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe30gYXMgQXV0aENvbnRleHREYXRhKVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaWduT3V0KCl7XHJcbiAgdHJ5e1xyXG4gICAgZGVzdHJveUNvb2tpZSh1bmRlZmluZWQsICdAc3VqZWl0b3BpenphLnRva2VuJylcclxuICAgIFJvdXRlci5wdXNoKCcvJylcclxuICB9Y2F0Y2h7XHJcbiAgICBjb25zb2xlLmxvZygnZXJybyBhbyBkZXNsb2dhcicpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfTogQXV0aFByb3ZpZGVyUHJvcHMpe1xyXG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPFVzZXJQcm9wcz4oe1xyXG4gICAgaWQ6ICcnLFxyXG4gICAgbmFtZTogJycsXHJcbiAgICBlbWFpbDogJycsXHJcbiAgICB0b2tlbjogJycsXHJcbiAgICByb2xlOiAnJyxcclxuICAgIHRlbGVmb25lOiAnJyxcclxuICAgIHVzZXJfbmFtZTogJycsXHJcbiAgICBvcmdhbml6YXRpb25JZDonJyxcclxuICB9KTtcclxuICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSAhIXVzZXI7XHJcbiAgY29uc3QgaW5hY3Rpdml0eVRpbWVvdXQgPSAxNSAqIDYwICogMTAwMDsgXHJcbiAgbGV0IGluYWN0aXZpdHlUaW1lcjogTm9kZUpTLlRpbWVvdXQ7XHJcblxyXG4gIGNvbnN0IHJlc2V0SW5hY3Rpdml0eVRpbWVyID0gKCkgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KGluYWN0aXZpdHlUaW1lcik7XHJcbiAgICBpbmFjdGl2aXR5VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgc2lnbk91dCgpOyAvLyBDaGFtYSBhIGZ1bsOnw6NvIGRlIGxvZ291dCBhcMOzcyBvIHRlbXBvIGRlIGluYXRpdmlkYWRlXHJcbiAgICB9LCBpbmFjdGl2aXR5VGltZW91dCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXNlckludGVyYWN0aW9uID0gKCkgPT4ge1xyXG4gICAgcmVzZXRJbmFjdGl2aXR5VGltZXIoKTtcclxuICB9O1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4gIHtcclxuICAgIGNvbnN0IGNoZWNrVG9rZW4gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyAnQHN1amVpdG9waXp6YS50b2tlbic6IHRva2VuIH0gPSBwYXJzZUNvb2tpZXMoKTtcclxuXHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoJy9tZScpO1xyXG4gICAgICAgICAgY29uc3QgeyBpZCxuYW1lLGVtYWlsLHJvbGUsdXNlcl9uYW1lfSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJtZVwiLCByZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgIHNldFVzZXIoe1xyXG4gICAgICAgICAgICBpZCxlbWFpbCxuYW1lLHJvbGUsdXNlcl9uYW1lLHRva2VuXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTG9nYWRvXCIpO1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwidG9rZW4tPlwiLHRva2VuKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvIGFvIHZlcmlmaWNhciBvIHRva2VuXCIsIGVycm9yKTtcclxuICAgICAgICBzaWduT3V0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2hlY2tUb2tlbigpOyAvLyBWZXJpZmljYSBvIHRva2VuIGFvIGNhcnJlZ2FyIG8gY29tcG9uZW50ZVxyXG5cclxuICAgIC8vIEFkaWNpb25hIGV2ZW50IGxpc3RlbmVycyBwYXJhIHJlZGVmaW5pciBvIHRlbXBvcml6YWRvciBlbSBpbnRlcmHDp8O1ZXMgZG8gdXN1w6FyaW9cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVVc2VySW50ZXJhY3Rpb24pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZVVzZXJJbnRlcmFjdGlvbik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZVVzZXJJbnRlcmFjdGlvbik7XHJcblxyXG4gICAgLy8gSW5pY2lhIG8gdGVtcG9yaXphZG9yIHF1YW5kbyBvIGNvbXBvbmVudGUgw6kgbW9udGFkb1xyXG4gICAgcmVzZXRJbmFjdGl2aXR5VGltZXIoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAvLyBSZW1vdmUgb3MgZXZlbnQgbGlzdGVuZXJzIGUgbGltcGEgbyB0ZW1wb3JpemFkb3IgcXVhbmRvIG8gY29tcG9uZW50ZSDDqSBkZXNtb250YWRvXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVVc2VySW50ZXJhY3Rpb24pO1xyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlVXNlckludGVyYWN0aW9uKTtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVVc2VySW50ZXJhY3Rpb24pO1xyXG4gICAgICBjbGVhclRpbWVvdXQoaW5hY3Rpdml0eVRpbWVyKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gUmVzdGFudGUgZG8gc2V1IGPDs2RpZ28uLi5cclxuXHJcbiAgfSwgW10pO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBzaWduSW4oeyBjcmVkZW50aWFsLCBwYXNzd29yZCB9OiBTaWduSW5Qcm9wcyl7XHJcbiAgICB0cnl7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLnBvc3QoJy9zZXNzaW9uJywge1xyXG4gICAgICAgIGNyZWRlbnRpYWwsXHJcbiAgICAgICAgcGFzc3dvcmRcclxuICAgICAgfSlcclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYXF1aVwiLHJlc3BvbnNlKVxyXG4gICAgICB0b2FzdC5zdWNjZXNzKFwiTG9nYWRvIGNvbSBzdWNlc3NvIVwiKTtcclxuICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZS0+IFwiLHJlc3BvbnNlLmRhdGEpXHJcbiAgICAgIGNvbnN0IHtpZCxuYW1lLGVtYWlsLHVzZXJfbmFtZSx0b2tlbixyb2xlLG9yZ2FuaXphdGlvbklkfSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYXF1aVwiLCB7dG9rZW59KTtcclxuICAgICAgc2V0Q29va2llKHVuZGVmaW5lZCwgJ0BzdWplaXRvcGl6emEudG9rZW4nLCB0b2tlbiwge1xyXG4gICAgICAgIG1heEFnZTogNjAgKiA2MCAqIDI0ICogMzAsIC8vIEV4cGlyYXIgZW0gMSBtZXNcclxuICAgICAgICBwYXRoOiBcIi9cIiAvLyBRdWFpcyBjYW1pbmhvcyB0ZXJhbyBhY2Vzc28gYW8gY29va2llXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBzZXRVc2VyKHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHJvbGUsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgdXNlcl9uYW1lLFxyXG4gICAgICAgIG9yZ2FuaXphdGlvbklkLFxyXG4gICAgICAgIGVtYWlsXHJcbiAgICAgIH0pXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYXF1aVwiLCB1c2VyKTtcclxuICAgICAgLy9QYXNzYXIgcGFyYSBwcm94aW1hcyByZXF1aXNpw6dvZXMgbyBub3NzbyB0b2tlblxyXG4gICAgICBhcGkuZGVmYXVsdHMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3Rva2VufWBcclxuICAgICAgXHJcbiAgICAgICAgUm91dGVyLnB1c2goJy9wcm9kdXQnKTtcclxuICAgICBcclxuICAgIH1jYXRjaChlcnIpe1xyXG4gICAgICB0b2FzdC5lcnJvcihcIkVycm8gYW8gTG9nYXJcIilcclxuICAgICAgY29uc29sZS5sb2coXCJlcnJvIGFraVwiLGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc2lnblVwKHsgbmFtZSwgZW1haWwscm9sZSx1c2VyX25hbWV9OiBTaWduVXBQcm9wcyl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5wb3N0KCcvdXNlcnMnLCB7XHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgICByb2xlLFxyXG4gICAgICAgIHVzZXJfbmFtZVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdG9hc3Quc3VjY2VzcyhcIkNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hXCIpXHJcblxyXG4gICAgICBSb3V0ZXIucHVzaCgnLycpXHJcblxyXG4gICAgfWNhdGNoKGVycil7XHJcbiAgICAgIHRvYXN0LmVycm9yKFwiRXJybyBhbyBzZSBDYWRhc3RyYXJcIilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybihcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17eyB1c2VyLCBpc0F1dGhlbnRpY2F0ZWQsIHNpZ25Jbiwgc2lnbk91dCxzaWduVXB9fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApXHJcbn0iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiZGVzdHJveUNvb2tpZSIsInNldENvb2tpZSIsInBhcnNlQ29va2llcyIsInRvYXN0IiwiUm91dGVyIiwiYXBpIiwiQXV0aENvbnRleHQiLCJzaWduT3V0IiwidW5kZWZpbmVkIiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwiaWQiLCJuYW1lIiwiZW1haWwiLCJ0b2tlbiIsInJvbGUiLCJ0ZWxlZm9uZSIsInVzZXJfbmFtZSIsIm9yZ2FuaXphdGlvbklkIiwiaXNBdXRoZW50aWNhdGVkIiwiaW5hY3Rpdml0eVRpbWVvdXQiLCJpbmFjdGl2aXR5VGltZXIiLCJyZXNldEluYWN0aXZpdHlUaW1lciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJoYW5kbGVVc2VySW50ZXJhY3Rpb24iLCJjaGVja1Rva2VuIiwicmVzcG9uc2UiLCJnZXQiLCJkYXRhIiwiZXJyb3IiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInNpZ25JbiIsImNyZWRlbnRpYWwiLCJwYXNzd29yZCIsInBvc3QiLCJzdWNjZXNzIiwibWF4QWdlIiwicGF0aCIsImRlZmF1bHRzIiwiaGVhZGVycyIsImVyciIsInNpZ25VcCIsIlByb3ZpZGVyIiwidmFsdWUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./contexts/AuthContext.tsx\n");

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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupAPIClient: () => (/* binding */ setupAPIClient)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nookies */ \"nookies\");\n/* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nookies__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _errors_AuthTokenError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors/AuthTokenError */ \"./services/errors/AuthTokenError.ts\");\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__]);\n([axios__WEBPACK_IMPORTED_MODULE_0__, _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\nfunction setupAPIClient(ctx = undefined) {\n    let cookies = (0,nookies__WEBPACK_IMPORTED_MODULE_1__.parseCookies)(ctx);\n    const api = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n        baseURL: \"http://10.20.18.100:3333\",\n        headers: {\n            Authorization: `Bearer ${cookies[\"@sujeitopizza.token\"]}`\n        }\n    });\n    api.interceptors.response.use((response)=>{\n        return response;\n    }, (error)=>{\n        if (error.response.status === 401) {\n            // qualquer erro 401 (não autorizado) devemos deslogar o usuário\n            if (true) {\n                // Estamos no lado do servidor, então você não deve chamar singOut() aqui\n                return Promise.reject(new _errors_AuthTokenError__WEBPACK_IMPORTED_MODULE_2__.AuthTokenError());\n            } else {}\n        }\n        return Promise.reject(error);\n    });\n    return api;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zZXJ2aWNlcy9hcGkudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXlDO0FBQ0g7QUFDa0I7QUFFTjtBQUUzQyxTQUFTSSxlQUFlQyxNQUFNQyxTQUFTO0lBQzVDLElBQUlDLFVBQVVOLHFEQUFZQSxDQUFDSTtJQUUzQixNQUFNRyxNQUFNUixvREFBWSxDQUFDO1FBQ3ZCVSxTQUFRO1FBQ1JDLFNBQVM7WUFDUEMsZUFBZSxDQUFDLE9BQU8sRUFBRUwsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDM0Q7SUFDRjtJQUVBQyxJQUFJSyxZQUFZLENBQUNDLFFBQVEsQ0FBQ0MsR0FBRyxDQUFDRCxDQUFBQTtRQUM1QixPQUFPQTtJQUNULEdBQUcsQ0FBQ0U7UUFDRixJQUFJQSxNQUFNRixRQUFRLENBQUNHLE1BQU0sS0FBSyxLQUFLO1lBQ2pDLGdFQUFnRTtZQUNoRSxJQUFJLElBQWtCLEVBQWE7Z0JBQ2pDLHlFQUF5RTtnQkFDekUsT0FBT0MsUUFBUUMsTUFBTSxDQUFDLElBQUlqQixrRUFBY0E7WUFDMUMsT0FBTyxFQUdOO1FBQ0g7UUFDRixPQUFPZ0IsUUFBUUMsTUFBTSxDQUFDSDtJQUN0QjtJQUVBLE9BQU9SO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWRhc2gvLi9zZXJ2aWNlcy9hcGkudHM/NGJlNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NFcnJvciB9IGZyb20gJ2F4aW9zJ1xyXG5pbXBvcnQgeyBwYXJzZUNvb2tpZXMgfSBmcm9tICdub29raWVzJ1xyXG5pbXBvcnQgeyBBdXRoVG9rZW5FcnJvciB9IGZyb20gJy4vZXJyb3JzL0F1dGhUb2tlbkVycm9yJ1xyXG5cclxuaW1wb3J0IHsgc2lnbk91dCB9IGZyb20gJy4uL2NvbnRleHRzL0F1dGhDb250ZXh0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEFQSUNsaWVudChjdHggPSB1bmRlZmluZWQpIHtcclxuICBsZXQgY29va2llcyA9IHBhcnNlQ29va2llcyhjdHgpO1xyXG5cclxuICBjb25zdCBhcGkgPSBheGlvcy5jcmVhdGUoe1xyXG4gICAgYmFzZVVSTDonaHR0cDovLzEwLjIwLjE4LjEwMDozMzMzJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2Nvb2tpZXNbJ0BzdWplaXRvcGl6emEudG9rZW4nXX1gXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgYXBpLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UocmVzcG9uc2UgPT4ge1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gIH0sIChlcnJvcjogQXhpb3NFcnJvcikgPT4ge1xyXG4gICAgaWYgKGVycm9yLnJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgIC8vIHF1YWxxdWVyIGVycm8gNDAxIChuw6NvIGF1dG9yaXphZG8pIGRldmVtb3MgZGVzbG9nYXIgbyB1c3XDoXJpb1xyXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBFc3RhbW9zIG5vIGxhZG8gZG8gc2Vydmlkb3IsIGVudMOjbyB2b2PDqiBuw6NvIGRldmUgY2hhbWFyIHNpbmdPdXQoKSBhcXVpXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBdXRoVG9rZW5FcnJvcigpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBFc3RhbW9zIG5vIGxhZG8gZG8gY2xpZW50ZSwgZW50w6NvIMOpIHNlZ3VybyBjaGFtYXIgc2luZ091dCgpXHJcbiAgICAgICAgc2lnbk91dCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gIH0pXHJcblxyXG4gIHJldHVybiBhcGk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImF4aW9zIiwicGFyc2VDb29raWVzIiwiQXV0aFRva2VuRXJyb3IiLCJzaWduT3V0Iiwic2V0dXBBUElDbGllbnQiLCJjdHgiLCJ1bmRlZmluZWQiLCJjb29raWVzIiwiYXBpIiwiY3JlYXRlIiwiYmFzZVVSTCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiaW50ZXJjZXB0b3JzIiwicmVzcG9uc2UiLCJ1c2UiLCJlcnJvciIsInN0YXR1cyIsIlByb21pc2UiLCJyZWplY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./services/api.ts\n");

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