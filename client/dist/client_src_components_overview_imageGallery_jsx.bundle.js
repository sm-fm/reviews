"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunksdc"] = self["webpackChunksdc"] || []).push([["client_src_components_overview_imageGallery_jsx"],{

/***/ "./client/src/components/overview/imageGallery.jsx":
/*!*********************************************************!*\
  !*** ./client/src/components/overview/imageGallery.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_icons_bs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-icons/bs */ \"./node_modules/react-icons/bs/index.esm.js\");\n/* harmony import */ var react_icons_ai__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-icons/ai */ \"./node_modules/react-icons/ai/index.esm.js\");\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../styles/index.css */ \"./client/src/styles/index.css\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : \"undefined\" != typeof Symbol && arr[Symbol.iterator] || arr[\"@@iterator\"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i[\"return\"] && (_r = _i[\"return\"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n// import { v4 as uuidv4 } from 'uuid';\n// import SpecificImage from './SpecificImage.jsx';\n// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';\n\n\n\nvar Spinner = __webpack_require__(/*! ../../img/spiffygif_46x46.gif */ \"./client/src/img/spiffygif_46x46.gif\");\n\n\n\nvar ImageGallery = function ImageGallery(props) {\n  var _props$styles$props$s2, _props$styles$props$s3, _props$styles$props$s4;\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(props.primaryImageIndex),\n    _useState2 = _slicedToArray(_useState, 2),\n    primaryImageIndex = _useState2[0],\n    setPrimaryImageIndex = _useState2[1];\n  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),\n    _useState4 = _slicedToArray(_useState3, 2),\n    arrowIndex = _useState4[0],\n    setArrowIndex = _useState4[1];\n\n  // console.log(props.styles[props.styleIndex]?.photos);\n\n  var arrowClicked = function arrowClicked(_int) {\n    var _props$styles$props$s;\n    setPrimaryImageIndex(primaryImageIndex + _int);\n    if (((_props$styles$props$s = props.styles[props.styleIndex]) === null || _props$styles$props$s === void 0 ? void 0 : _props$styles$props$s.photos.length) - (arrowIndex + _int) >= 5 && arrowIndex + _int >= 0) setArrowIndex(arrowIndex + _int);\n    // console.log('arrowInd', arrowIndex, 'length', props.styles[props.styleIndex]?.photos.length, 'plus', int, \"diff\", props.styles[props.styleIndex]?.photos.length - arrowIndex);\n  };\n\n  // if (props.photos && props.chosenStyle) {\n  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(\"div\", {\n    widgetname: \"Overview\",\n    \"data-testid\": \"testImageGallery\",\n    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(\"div\", {\n      widgetname: \"Overview\",\n      id: \"main-img\",\n      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(\"img\", {\n        widgetname: \"Overview\",\n        id: \"primary-img\",\n        className: \"maxDimensions\",\n        src: (_props$styles$props$s2 = props.styles[props.styleIndex]) === null || _props$styles$props$s2 === void 0 ? void 0 : _props$styles$props$s2.photos[primaryImageIndex].url,\n        onClick: function onClick() {\n          props.setExpandedView(true);\n          props.setPrimaryImageIndex(primaryImageIndex);\n        }\n      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_3__.AiOutlineExpand, {\n        onClick: function onClick() {\n          props.setPrimaryImageIndex(primaryImageIndex);\n          props.setExpandedView(true);\n        },\n        size: \"1.5em\",\n        color: \"white\",\n        className: \"expanded\"\n      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(\"div\", {\n        className: \"photoList\",\n        children: [primaryImageIndex === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(\"div\", {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_icons_bs__WEBPACK_IMPORTED_MODULE_4__.BsChevronUp, {\n          size: \"1.5em\",\n          color: \"gray\",\n          className: \"up-Arrow\",\n          onClick: function onClick() {\n            return arrowClicked(-1);\n          }\n        }), (_props$styles$props$s3 = props.styles[props.styleIndex]) === null || _props$styles$props$s3 === void 0 ? void 0 : _props$styles$props$s3.photos.map(function (photo, index) {\n          return index >= arrowIndex && index - arrowIndex <= 4 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(\"img\", {\n            onClick: function onClick() {\n              return setPrimaryImageIndex(index);\n            },\n            className: index === primaryImageIndex ? \"onePhoto selectedImage\" : \"onePhoto\",\n            src: photo.thumbnail_url,\n            alt: \"...\"\n          }, index) : null;\n        }), primaryImageIndex === ((_props$styles$props$s4 = props.styles[props.styleIndex]) === null || _props$styles$props$s4 === void 0 ? void 0 : _props$styles$props$s4.photos.length) - 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(\"div\", {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_icons_bs__WEBPACK_IMPORTED_MODULE_4__.BsChevronDown, {\n          size: \"1.5em\",\n          color: \"gray\",\n          className: \"down-Arrow\",\n          onClick: function onClick() {\n            return arrowClicked(1);\n          }\n        })]\n      })]\n    })\n  });\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageGallery);\n\n//# sourceURL=webpack://sdc/./client/src/components/overview/imageGallery.jsx?");

/***/ })

}]);