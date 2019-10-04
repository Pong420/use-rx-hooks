(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{128:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__webpack_require__(1),rxjs_1=__webpack_require__(130),initialArg={loading:!1};function reducer(state,action){switch(action.type){case"FETCH_INIT":return{...initialArg,loading:!0,data:state.data};case"FETCH_SUCCESS":return{...state,loading:!1,data:action.payload};case"FETCH_FAILURE":return{...state,loading:!1,error:action.payload};case"CANCEL":return{...state,loading:!1};default:throw new Error}}exports.useRxAsync=function useRxAsync(fn,options={}){const{defer:defer,pipe:pipe,initialValue:initialValue,onSuccess:onSuccess,onFailure:onFailure}=options,[state,dispatch]=react_1.useReducer(reducer,{...initialArg,data:initialValue}),subscription=react_1.useRef(new rxjs_1.Subscription),run=react_1.useCallback(()=>{dispatch({type:"FETCH_INIT"});let source$=rxjs_1.from(fn());pipe&&(source$=source$.pipe(pipe));const newSubscription=source$.subscribe(payload=>{dispatch({type:"FETCH_SUCCESS",payload:payload}),onSuccess&&onSuccess(payload)},payload=>{dispatch({type:"FETCH_FAILURE",payload:payload}),onFailure&&onFailure(payload)});subscription.current.unsubscribe(),subscription.current=newSubscription},[fn,pipe,onSuccess,onFailure]),cancel=react_1.useCallback(()=>{subscription.current.unsubscribe(),dispatch({type:"CANCEL"})},[dispatch,subscription]);return react_1.useEffect(()=>{!defer&&run()},[dispatch,run,defer]),{...state,run:run,cancel:cancel}}},129:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__webpack_require__(1),rxjs_1=__webpack_require__(130),operators_1=__webpack_require__(105);exports.useRxInput=function useRxInput({defaultValue:defaultValue="",interceptors:interceptors,pipe:pipe}={}){const ref=react_1.useRef(null),[value,setValue]=react_1.useState();return react_1.useEffect(()=>{const el=ref.current;if(el){let source$=rxjs_1.fromEvent(el,"input").pipe(interceptors?interceptors(el):operators_1.map(evt=>evt),operators_1.map(evt=>evt),operators_1.map(evt=>evt.target.value),operators_1.startWith(defaultValue));pipe&&(source$=source$.pipe(pipe));const subscription=source$.subscribe(setValue);return()=>subscription.unsubscribe()}},[pipe,defaultValue,interceptors]),[value,{ref:ref,defaultValue:defaultValue}]}},168:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),delay=ms=>new Promise(_=>setTimeout(_,ms));exports.request=()=>delay(2e3).then(()=>"done!"),exports.request2=()=>delay(2e3).then(()=>Math.random()),exports.request3=result=>delay(2e3).then(()=>result),exports.Result=function Result({loading:loading,error:error,data:data}){const content=(()=>loading?"Loading...":error?"Error !":data?"object"==typeof data?JSON.stringify(data,null,2):data:" ")();return react_1.default.createElement("pre",null,content)}},411:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const rxjs_1=__webpack_require__(130),operators_1=__webpack_require__(105),react_1=__webpack_require__(1);exports.useRxFileToImage=function useRxFileToImage(fn){const[state,setState]=react_1.useState(),ref=react_1.useRef(null);return react_1.useEffect(()=>{const target=ref.current;if(target){const subscription=fn(target).pipe(operators_1.map(([items,event])=>{if(items&&items.length)for(let i=0;i<items.length;i++)if(-1!==items[i].type.indexOf("image"))return event.preventDefault(),{file:items[i].getAsFile(),type:items[i].type};return null}),operators_1.switchMap(state=>state?getBase64ImageURL(state).pipe(operators_1.map(url=>({url:url,...state}))):rxjs_1.empty())).subscribe(setState);return()=>subscription.unsubscribe()}},[fn]),[state,{ref:ref}]};const getBase64ImageURL=({file:file,type:type})=>new rxjs_1.Observable(observer=>{const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d"),img=new Image;img.onload=()=>{canvas.width=img.width,canvas.height=img.height,ctx.drawImage(img,0,0),observer.next(canvas.toDataURL(type))},img.src=URL.createObjectURL(file),img.onerror=observer.error})},412:function(module,exports,__webpack_require__){"use strict";var __importStar=this&&this.__importStar||function(mod){if(mod&&mod.__esModule)return mod;var result={};if(null!=mod)for(var k in mod)Object.hasOwnProperty.call(mod,k)&&(result[k]=mod[k]);return result.default=mod,result};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importStar(__webpack_require__(1)),style={display:"flex",marginTop:10,backgroundColor:"rgb(242, 242, 242)",padding:10},imageContainerStyle={alignSelf:"center",maxWidth:200,marginRight:10};exports.Display=function Display({image:image}){const[images,setImages]=react_1.useState([]);return react_1.useEffect(()=>{image&&setImages(curr=>[...curr,image])},[image]),react_1.default.createElement("div",null,images.map(({url:url,...rest},index)=>react_1.default.createElement("div",{key:index,style:style},react_1.default.createElement("div",{className:"image",style:imageContainerStyle},react_1.default.createElement("img",{src:url,alt:"",width:"100%"})),react_1.default.createElement("pre",{className:"json"},JSON.stringify(function clone({file:file,...rest}){if(file)return{file:{lastModified:file.lastModified,name:file.name,size:file.size,type:file.type},...rest};return{}}(rest),null,2)))))}},422:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxAsync_1=__webpack_require__(128),utils_1=__webpack_require__(168);exports.Basic=()=>{const state=useRxAsync_1.useRxAsync(utils_1.request,{initialValue:"123123"});return react_1.default.createElement(utils_1.Result,Object.assign({},state))}},423:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxAsync_1=__webpack_require__(128),utils_1=__webpack_require__(168);exports.Cancellation=()=>{const state=useRxAsync_1.useRxAsync(utils_1.request2,{defer:!0});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("button",{onClick:state.run},"Get Result"),react_1.default.createElement("button",{onClick:state.cancel},"Cancel"),react_1.default.createElement(utils_1.Result,Object.assign({},state)))}},424:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxAsync_1=__webpack_require__(128),utils_1=__webpack_require__(168);exports.Defer=()=>{const state=useRxAsync_1.useRxAsync(utils_1.request,{defer:!0});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("button",{onClick:state.run},"Get Result"),react_1.default.createElement(utils_1.Result,Object.assign({},state)))}},425:function(module,exports,__webpack_require__){"use strict";var __importStar=this&&this.__importStar||function(mod){if(mod&&mod.__esModule)return mod;var result={};if(null!=mod)for(var k in mod)Object.hasOwnProperty.call(mod,k)&&(result[k]=mod[k]);return result.default=mod,result};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importStar(__webpack_require__(1)),useRxAsync_1=__webpack_require__(128),utils_1=__webpack_require__(168);exports.DynamicParameters=()=>{const[result,setResult]=react_1.useState(0),callback=react_1.useCallback(()=>utils_1.request3(result),[result]),state=useRxAsync_1.useRxAsync(callback,{defer:!0});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("h5",null,"Click on the button to get a result"),react_1.default.createElement("button",{onClick:()=>setResult(100)},"100"),react_1.default.createElement("button",{onClick:()=>setResult(200)},"200"),react_1.default.createElement("button",{onClick:()=>setResult(300)},"300"),react_1.default.createElement(utils_1.Result,Object.assign({},state)))}},426:function(module,exports,__webpack_require__){"use strict";var __importStar=this&&this.__importStar||function(mod){if(mod&&mod.__esModule)return mod;var result={};if(null!=mod)for(var k in mod)Object.hasOwnProperty.call(mod,k)&&(result[k]=mod[k]);return result.default=mod,result};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importStar(__webpack_require__(1)),operators_1=__webpack_require__(105),useRxAsync_1=__webpack_require__(128),utils_1=__webpack_require__(168);exports.Pipe=()=>{const[result,setResult]=react_1.useState(0),callback=react_1.useCallback(()=>utils_1.request3(result),[result]),state=useRxAsync_1.useRxAsync(callback,{defer:!0,pipe:ob=>ob.pipe(operators_1.map(v=>2*v))});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("button",{onClick:()=>setResult(100)},"100"),react_1.default.createElement("button",{onClick:()=>setResult(200)},"200"),react_1.default.createElement("button",{onClick:()=>setResult(300)},"300"),react_1.default.createElement(utils_1.Result,Object.assign({},state)))}},427:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxPasteImage_1=__webpack_require__(850),Display_1=__webpack_require__(412);exports.PasteImage=()=>{const[image,props]=useRxPasteImage_1.useRxPasteImage();return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("input",Object.assign({},props,{placeholder:"Paste image here"})),react_1.default.createElement(Display_1.Display,{image:image}))}},428:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxDropImage_1=__webpack_require__(851),Display_1=__webpack_require__(412);exports.DropImage=()=>{const[image,props]=useRxDropImage_1.useRxDropImage();return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("div",Object.assign({},props,{style:{width:"100%",border:"1px dashed",color:"#ccc",textAlign:"center",padding:30}}),"Drop an image to here"),react_1.default.createElement(Display_1.Display,{image:image}))}},429:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxInput_1=__webpack_require__(129);exports.Basic=()=>{const[value,inputProps]=useRxInput_1.useRxInput();return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("input",Object.assign({},inputProps)),react_1.default.createElement("pre",null,value))}},430:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxInput_1=__webpack_require__(129),isComposing_1=__webpack_require__(852);exports.Composing=()=>{const[value,inputProps]=useRxInput_1.useRxInput({interceptors:isComposing_1.isComposing});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("input",Object.assign({},inputProps)),react_1.default.createElement("pre",null,value))}},431:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxInput_1=__webpack_require__(129);exports.DefaultValue=()=>{const[value,inputProps]=useRxInput_1.useRxInput({defaultValue:"Default Value"});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("input",Object.assign({},inputProps)),react_1.default.createElement("pre",null,value))}},432:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxInput_1=__webpack_require__(129),operators_1=__webpack_require__(105),debounce=ob=>ob.pipe(operators_1.debounceTime(1e3));exports.Debounce=()=>{const[value,inputProps]=useRxInput_1.useRxInput({pipe:debounce});return react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("input",Object.assign({},inputProps)),react_1.default.createElement("pre",null,value))}},433:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),useRxInput_1=__webpack_require__(129),operators_1=__webpack_require__(105),double=ob=>ob.pipe(operators_1.map(v=>isNaN(Number(v))?0:2*Number(v)));exports.Double=()=>{const[value,inputProps]=useRxInput_1.useRxInput({pipe:double});return console.log(value),react_1.default.createElement(react_1.default.Fragment,null,react_1.default.createElement("input",Object.assign({},inputProps)),react_1.default.createElement("pre",null,value))}},434:function(module,exports,__webpack_require__){__webpack_require__(435),__webpack_require__(544),module.exports=__webpack_require__(545)},456:function(module,exports){},49:function(module,exports,__webpack_require__){"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const react_1=__importDefault(__webpack_require__(1)),components_1=__webpack_require__(93);exports.Preview=({language:language="jsx",code:code,children:children,withSource:withSource,...props})=>react_1.default.createElement(components_1.Preview,{withSource:{...withSource,code:code,language:language},...props},children),exports.delay=ms=>new Promise(_=>setTimeout(_,ms))},545:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),function(module){var _storybook_react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(414);Object(_storybook_react__WEBPACK_IMPORTED_MODULE_0__.configure)(__webpack_require__(733),module)}.call(this,__webpack_require__(546)(module))},733:function(module,exports,__webpack_require__){var map={"./__stories__/useRxAsync/useRxAsync.stories.mdx":853,"./__stories__/useRxFileToImage/useRxFileToImage.stories.mdx":856,"./__stories__/useRxInput/useRxInput.stories.mdx":854};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=733},850:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const rxjs_1=__webpack_require__(130),operators_1=__webpack_require__(105),useRxFileToImage_1=__webpack_require__(411);function fromPasteEvent(el){return rxjs_1.fromEvent(el,"paste").pipe(operators_1.map(event=>event),operators_1.map(clipboardEvent=>[clipboardEvent.clipboardData&&clipboardEvent.clipboardData.items,clipboardEvent]))}exports.fromPasteEvent=fromPasteEvent,exports.useRxPasteImage=function useRxPasteImage(){return useRxFileToImage_1.useRxFileToImage(fromPasteEvent)}},851:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const rxjs_1=__webpack_require__(130),operators_1=__webpack_require__(105),useRxFileToImage_1=__webpack_require__(411);function fromDropEvent(el){return rxjs_1.merge(rxjs_1.fromEvent(el,"drop"),rxjs_1.fromEvent(el,"dragover").pipe(operators_1.tap(event=>event.preventDefault()))).pipe(operators_1.filter(event=>"drop"===event.type),operators_1.map(event=>event),operators_1.map(dragEvent=>[dragEvent.dataTransfer&&dragEvent.dataTransfer.items,dragEvent]))}exports.fromDropEvent=fromDropEvent,exports.useRxDropImage=function useRxDropImage(){return useRxFileToImage_1.useRxFileToImage(fromDropEvent)}},852:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const rxjs_1=__webpack_require__(130),operators_1=__webpack_require__(105);exports.isComposing=function isComposing(element){const composingStart$=rxjs_1.fromEvent(element,"compositionstart").pipe(operators_1.map(()=>!0)),composingEnd$=rxjs_1.fromEvent(element,"compositionend").pipe(operators_1.map(()=>!1)),isComposing$=rxjs_1.merge(composingStart$,composingEnd$).pipe(operators_1.startWith(!1));return source$=>source$.pipe(operators_1.combineLatest(isComposing$),operators_1.filter(([,isComposing])=>!isComposing),operators_1.map(([evt])=>evt))}},853:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(1);var index_es=__webpack_require__(4),blocks=__webpack_require__(59),utils=__webpack_require__(49),Basic=__webpack_require__(422),Cancellation=__webpack_require__(423),Defer=__webpack_require__(424),DynamicParameters=__webpack_require__(425),Pipe=__webpack_require__(426),useRxAsync_Basic="import React from 'react';\nimport { useRxAsync } from '../../useRxAsync';\nimport { Result, request } from './utils';\n\nexport const Basic = () => {\n  const state = useRxAsync(request, { initialValue: '123123' });\n  return <Result {...state} />;\n};\n",useRxAsync_Cancellation="import React from 'react';\nimport { useRxAsync } from '../../useRxAsync';\nimport { Result, request2 } from './utils';\n\nexport const Cancellation = () => {\n  const state = useRxAsync(request2, { defer: true });\n  return (\n    <>\n      <button onClick={state.run}>Get Result</button>\n      <button onClick={state.cancel}>Cancel</button>\n      <Result {...state} />\n    </>\n  );\n};\n",useRxAsync_Defer="import React from 'react';\nimport { useRxAsync } from '../../useRxAsync';\nimport { Result, request } from './utils';\n\nexport const Defer = () => {\n  const state = useRxAsync(request, { defer: true });\n  return (\n    <>\n      <button onClick={state.run}>Get Result</button>\n      <Result {...state} />\n    </>\n  );\n};\n",useRxAsync_DynamicParameters="import React, { useState, useCallback } from 'react';\nimport { useRxAsync } from '../../useRxAsync';\nimport { Result, request3 } from './utils';\n\nexport const DynamicParameters = () => {\n  const [result, setResult] = useState(0);\n  const callback = useCallback(() => request3(result), [result]);\n  const state = useRxAsync(callback, { defer: true });\n  return (\n    <>\n      <h5>Click on the button to get a result</h5>\n      <button onClick={() => setResult(100)}>100</button>\n      <button onClick={() => setResult(200)}>200</button>\n      <button onClick={() => setResult(300)}>300</button>\n      <Result {...state} />\n    </>\n  );\n};\n",useRxAsync_Pipe="import React, { useState, useCallback } from 'react';\nimport { Observable } from 'rxjs';\nimport { map } from 'rxjs/operators';\nimport { useRxAsync } from '../../useRxAsync';\nimport { Result, request3 } from './utils';\n\nexport const Pipe = () => {\n  const double = (ob: Observable<number>) => ob.pipe(map(v => v * 2));\n\n  const [result, setResult] = useState(0);\n  const callback = useCallback(() => request3(result), [result]);\n  const state = useRxAsync(callback, { defer: true, pipe: double });\n\n  return (\n    <>\n      <button onClick={() => setResult(100)}>100</button>\n      <button onClick={() => setResult(200)}>200</button>\n      <button onClick={() => setResult(300)}>300</button>\n      <Result {...state} />\n    </>\n  );\n};\n";function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));const layoutProps={},MDXLayout="wrapper";function MDXContent({components:components,...props}){return Object(index_es.mdx)(MDXLayout,_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(index_es.mdx)(blocks.Meta,{title:"useRxAsync",mdxType:"Meta"}),Object(index_es.mdx)("h1",null,"useRxAsync"),Object(index_es.mdx)("pre",null,Object(index_es.mdx)("code",_extends({parentName:"pre"},{className:"language-js"}),"const state = useRxAsync(input, options?);\n")),Object(index_es.mdx)("h2",null,"Typings"),Object(index_es.mdx)("pre",null,Object(index_es.mdx)("code",_extends({parentName:"pre"},{className:"language-js"}),"export interface RxAsyncState<T> {\n  loading: boolean;\n  error?: any;\n  data?: T;\n  run: () => void;\n  cancel: () => void;\n}\n\nexport interface RxAsyncOptions<I, O = I> {\n  initialValue?: O;\n  defer?: boolean;\n  pipe?(ob: Observable<I>): Observable<O>;\n  onSuccess?(value: O): void;\n  onFailure?(error: any): void;\n}\n\ntype AsyncFn<T> = () => ObservableInput<T>;\n\ndeclare function useRxAsync<T, O = T>(\n  fn: AsyncFn<O>,\n  options?: RxAsyncOptions<T, O>\n): State<O>;\n")),Object(index_es.mdx)("h3",null,"Basic"),Object(index_es.mdx)(utils.Preview,{name:"Basic",code:useRxAsync_Basic,mdxType:"Preview"},Object(index_es.mdx)(Basic.Basic,{mdxType:"Basic"})),Object(index_es.mdx)("h3",null,"Cancellation"),Object(index_es.mdx)(utils.Preview,{name:"Cancellation",code:useRxAsync_Cancellation,mdxType:"Preview"},Object(index_es.mdx)(Cancellation.Cancellation,{mdxType:"Cancellation"})),Object(index_es.mdx)("h3",null,"Defer"),Object(index_es.mdx)(utils.Preview,{name:"Cancellation",code:useRxAsync_Defer,mdxType:"Preview"},Object(index_es.mdx)(Defer.Defer,{mdxType:"Defer"})),Object(index_es.mdx)("h3",null,"Dynamic Parameters"),Object(index_es.mdx)(utils.Preview,{name:"Cancellation",code:useRxAsync_DynamicParameters,mdxType:"Preview"},Object(index_es.mdx)(DynamicParameters.DynamicParameters,{mdxType:"DynamicParameters"})),Object(index_es.mdx)("h3",null,"Double Result (Pipe)"),Object(index_es.mdx)(utils.Preview,{name:"Cancellation",code:useRxAsync_Pipe,mdxType:"Preview"},Object(index_es.mdx)(Pipe.Pipe,{mdxType:"Pipe"})))}MDXContent.isMDXComponent=!0;const __page=()=>{throw new Error("Docs-only story")};__page.story={parameters:{docsOnly:!0}};const componentMeta={title:"useRxAsync",includeStories:["__page"]},mdxStoryNameToId={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={container:({context:context,children:children})=>Object(index_es.mdx)(blocks.DocsContainer,{context:{...context,mdxStoryNameToId:mdxStoryNameToId}},children),page:MDXContent};__webpack_exports__.default=componentMeta},854:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(1);var index_es=__webpack_require__(4),blocks=__webpack_require__(59),utils=__webpack_require__(49),Basic=__webpack_require__(429),Composing=__webpack_require__(430),DefaultValue=__webpack_require__(431),Debounce=__webpack_require__(432),Double=__webpack_require__(433),useRxInput_Basic="import React from 'react';\nimport { useRxInput } from '../../useRxInput';\n\nexport const Basic = () => {\n  const [value, inputProps] = useRxInput();\n  return (\n    <>\n      <input {...inputProps} />\n      <pre>{value}</pre>\n    </>\n  );\n};\n",useRxInput_Composing="import React from 'react';\nimport { useRxInput } from '../../useRxInput';\nimport { isComposing } from '../../utils/isComposing';\n\n// You could import `isComposing` from this library\n\nexport const Composing = () => {\n  const [value, inputProps] = useRxInput<HTMLInputElement>({\n    interceptors: isComposing,\n  });\n  return (\n    <>\n      <input {...inputProps} />\n      <pre>{value}</pre>\n    </>\n  );\n};\n",useRxInput_DefaultValue="import React from 'react';\nimport { useRxInput } from '../../useRxInput';\n\nexport const DefaultValue = () => {\n  const [value, inputProps] = useRxInput({ defaultValue: 'Default Value' });\n  return (\n    <>\n      <input {...inputProps} />\n      <pre>{value}</pre>\n    </>\n  );\n};\n",useRxInput_Debounce="import React from 'react';\nimport { useRxInput, RxInputPipe } from '../../useRxInput';\nimport { debounceTime } from 'rxjs/operators';\n\nconst debounce: RxInputPipe<string> = ob => ob.pipe(debounceTime(1000));\n\nexport const Debounce = () => {\n  const [value, inputProps] = useRxInput({ pipe: debounce });\n  return (\n    <>\n      <input {...inputProps} />\n      <pre>{value}</pre>\n    </>\n  );\n};\n",useRxInput_Double="import React from 'react';\nimport { useRxInput, RxInputPipe } from '../../useRxInput';\nimport { map } from 'rxjs/operators';\n\nconst double: RxInputPipe<number> = ob =>\n  ob.pipe(map(v => (!isNaN(Number(v)) ? Number(v) * 2 : 0)));\n\nexport const Double = () => {\n  const [value, inputProps] = useRxInput({ pipe: double });\n  console.log(value);\n  return (\n    <>\n      <input {...inputProps} />\n      <pre>{value}</pre>\n    </>\n  );\n};\n";function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));const layoutProps={},MDXLayout="wrapper";function MDXContent({components:components,...props}){return Object(index_es.mdx)(MDXLayout,_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(index_es.mdx)(blocks.Meta,{title:"useRxInput",mdxType:"Meta"}),Object(index_es.mdx)("h1",null,"useRxInput"),Object(index_es.mdx)("pre",null,Object(index_es.mdx)("code",_extends({parentName:"pre"},{className:"language-js"}),"const [value, inputProps] = useRxInput(options?);\n")),Object(index_es.mdx)("h2",null,"Typings"),Object(index_es.mdx)("pre",null,Object(index_es.mdx)("code",_extends({parentName:"pre"},{className:"language-js"}),"\ntype TargetEl = HTMLInputElement | HTMLTextAreaElement;\n\ninterface InputProps<T extends TargetEl = HTMLInputElement> {\n  ref: RefObject<T>;\n  defaultValue?: string;\n}\n\ntype RxInputPipe<O> = (ob: Observable<string | undefined>) => Observable<O>;\n\nexport interface RxInputOptions<O, T extends TargetEl = HTMLInputElement> {\n  interceptors?: (el: T) => (ob: Observable<Event>) => Observable<Event>;\n  defaultValue?: string;\n  pipe?: RxInputPipe<O>;\n}\n\nexport type RxInputState<O, T extends TargetEl = HTMLInputElement> = [\n  O | undefined,\n  InputProps<T>\n];\n\nexport function useRxInput<O, T extends TargetEl = HTMLInputElement>(\n  options?:RxInputOptions<O>\n): RxInputState<O, T>;\n")),Object(index_es.mdx)("h3",null,"Basic"),Object(index_es.mdx)(utils.Preview,{name:"Basic",code:useRxInput_Basic,mdxType:"Preview"},Object(index_es.mdx)(Basic.Basic,{mdxType:"Basic"})),Object(index_es.mdx)("h2",null,"Composing"),Object(index_es.mdx)(utils.Preview,{name:"Composing",code:useRxInput_Composing,mdxType:"Preview"},Object(index_es.mdx)(Composing.Composing,{mdxType:"Composing"})),Object(index_es.mdx)("h2",null,"With default value"),Object(index_es.mdx)(utils.Preview,{name:"Default Value",code:useRxInput_DefaultValue,mdxType:"Preview"},Object(index_es.mdx)(DefaultValue.DefaultValue,{mdxType:"DefaultValue"})),Object(index_es.mdx)("h2",null,"Debounce 1 second (Pipe)"),Object(index_es.mdx)(utils.Preview,{name:"Debounce",code:useRxInput_Debounce,mdxType:"Preview"},Object(index_es.mdx)(Debounce.Debounce,{mdxType:"Debounce"})),Object(index_es.mdx)("h2",null,"Double your input"),Object(index_es.mdx)(utils.Preview,{name:"Double",code:useRxInput_Double,mdxType:"Preview"},Object(index_es.mdx)(Double.Double,{mdxType:"Double"})))}MDXContent.isMDXComponent=!0;const __page=()=>{throw new Error("Docs-only story")};__page.story={parameters:{docsOnly:!0}};const componentMeta={title:"useRxInput",includeStories:["__page"]},mdxStoryNameToId={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={container:({context:context,children:children})=>Object(index_es.mdx)(blocks.DocsContainer,{context:{...context,mdxStoryNameToId:mdxStoryNameToId}},children),page:MDXContent};__webpack_exports__.default=componentMeta},856:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(1);var index_es=__webpack_require__(4),blocks=__webpack_require__(59),utils=__webpack_require__(49),PasteImage=__webpack_require__(427),DropImage=__webpack_require__(428),useRxFileToImage_PasteImage="import React from 'react';\nimport { useRxPasteImage } from '../../useRxPasteImage';\nimport { Display } from './Display';\n\nexport const PasteImage = () => {\n  const [image, props] = useRxPasteImage<HTMLInputElement>();\n\n  return (\n    <>\n      <input {...props} placeholder=\"Paste image here\" />\n      <Display image={image}></Display>\n    </>\n  );\n};\n",useRxFileToImage_DropImage="import React from 'react';\nimport { useRxDropImage } from '../../useRxDropImage';\nimport { Display } from './Display';\n\nexport const DropImage = () => {\n  const [image, props] = useRxDropImage<HTMLDivElement>();\n\n  return (\n    <>\n      <div\n        {...props}\n        style={{\n          width: '100%',\n          border: '1px dashed',\n          color: '#ccc',\n          textAlign: 'center',\n          padding: 30,\n        }}\n      >\n        Drop an image to here\n      </div>\n      <Display image={image}></Display>\n    </>\n  );\n};\n",Window="import React from 'react';\nimport { merge } from 'rxjs';\nimport { fromDropEvent } from '../../useRxDropImage';\nimport { fromPasteEvent } from '../../useRxPasteImage';\nimport { useRxFileToImage } from '../../useRxFileToImage';\nimport { Display } from './Display';\n\nconst merged = () => merge(fromDropEvent(window), fromPasteEvent(window));\n\nexport const Window = () => {\n  const [image] = useRxFileToImage(merged);\n  return <Display image={image} />;\n};\n";function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));const layoutProps={},MDXLayout="wrapper";function MDXContent({components:components,...props}){return Object(index_es.mdx)(MDXLayout,_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(index_es.mdx)(blocks.Meta,{title:"useRxFileToImage",mdxType:"Meta"}),Object(index_es.mdx)("h1",null,"useRxFileToImage"),Object(index_es.mdx)("pre",null,Object(index_es.mdx)("code",_extends({parentName:"pre"},{className:"language-js"}),"const [state?, props] = useRxFileToImage<T extends HTMLElement, E extends Event>(fn: RxFileToImageInput<E>);\n\n// HOC for `useRxFileToImage`\nconst [state?, props] = useRxDropImage<T extends HTMLElement, E extends Event = Event>();\nconst [state?, props] = useRxPasteImage<T extends HTMLElement, E extends Event = Event>();\n")),Object(index_es.mdx)("h2",null,"Typings"),Object(index_es.mdx)("pre",null,Object(index_es.mdx)("code",_extends({parentName:"pre"},{className:"language-js"}),"import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';\n\nexport type RxFileToImageInput<E> = (\n  target: FromEventTarget<E>\n) => Observable<[DataTransferItemList | null, Event]>;\n\n\ninterface State {\n  file: File;\n  url: string;\n  type: string;\n}\n\ninterface Props<T> {\n  ref: RefObject<T>;\n}\n\ndeclare function useRxDropImage<T>();\ndeclare function useRxPasteImage<T>();\n")),Object(index_es.mdx)("h3",null,"Paste Image"),Object(index_es.mdx)(utils.Preview,{name:"Paste Image",code:useRxFileToImage_PasteImage,mdxType:"Preview"},Object(index_es.mdx)(PasteImage.PasteImage,{mdxType:"PasteImage"})),Object(index_es.mdx)("h3",null,"Drop Image"),Object(index_es.mdx)(utils.Preview,{name:"Drop Image",code:useRxFileToImage_DropImage,mdxType:"Preview"},Object(index_es.mdx)(DropImage.DropImage,{mdxType:"DropImage"})),Object(index_es.mdx)("h3",null,"Custom"),Object(index_es.mdx)("blockquote",null,Object(index_es.mdx)("p",{parentName:"blockquote"},"you could import ",Object(index_es.mdx)("inlineCode",{parentName:"p"},"fromDropEvent"),", ",Object(index_es.mdx)("inlineCode",{parentName:"p"},"fromPasteEvent"),", ",Object(index_es.mdx)("inlineCode",{parentName:"p"},"useRxFileToImage")," from this libaray")),Object(index_es.mdx)("p",null,"An example"),Object(index_es.mdx)("ul",null,Object(index_es.mdx)("li",{parentName:"ul"},"mix paste and drop action"),Object(index_es.mdx)("li",{parentName:"ul"},"use window instead of dom")),Object(index_es.mdx)(blocks.Source,{code:Window,language:"jsx",mdxType:"Source"}))}MDXContent.isMDXComponent=!0;const __page=()=>{throw new Error("Docs-only story")};__page.story={parameters:{docsOnly:!0}};const componentMeta={title:"useRxFileToImage",includeStories:["__page"]},mdxStoryNameToId={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={container:({context:context,children:children})=>Object(index_es.mdx)(blocks.DocsContainer,{context:{...context,mdxStoryNameToId:mdxStoryNameToId}},children),page:MDXContent};__webpack_exports__.default=componentMeta}},[[434,1,2]]]);
//# sourceMappingURL=main.4eebead6c1a500992dd3.bundle.js.map