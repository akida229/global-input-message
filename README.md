

## global-input-message

This is a JavaScript library for web and device applications to have mobile integration without developing a separate mobile app. If you already have a mobile app, you need to include the [Global Input App](https://globalinput.co.uk/) component. Then, this library allows your applications running on various devices to interoperate with user's mobile device.

The simple addition allows your applications instantly have [Mobile Encryption ](https://globalinput.co.uk/global-input-app/mobile-content-encryption), [Mobile Authentication ](https://globalinput.co.uk/global-input-app/mobile-authentication), [Mobile Content Transfer ](https://globalinput.co.uk/global-input-app/mobile-content-transfer), [Mobile Input & Control ](https://globalinput.co.uk/global-input-app/mobile-input-control), [Second Screen Experience](https://globalinput.co.uk/global-input-app/second-screen-experience) and [Mobile Personal Storage](https://globalinput.co.uk/global-input-app/mobile-personal-storage) features
 

## ReactJS or React Native Applications

If you have React applications, you can include the [React extension library](https://github.com/global-input/global-input-react), which is much more intuitive to use.

## Setup

### ```npm``` module

```shell
npm install --save global-input-message
```
### CDN
```JavaScript
<script src="https://unpkg.com/global-input-message@1.7.7/distribution/globalinputmessage.min.js">
</script>
```

## Usage

Import and create a connector object:

```JavaScript
import {createMessageConnector} from "global-input-message";
const connector=createMessageConnector();
```

or use require:

```JavaScript
const globalInputMessage=require("global-input-message");
const connector=globalInputMessage.createMessageConnector();
```
Now you pass you can pass the configuration to the ```connector``` via  ```connect()```  function. The configuration contains a list of mobile user interface elements and the callback functions when the connected user interacted with them.

For example following configuration specify a form containing a single field named ```Content```:
```JavaScript
 const mobileConfig={        
   initData:{                              
     form:{
        title:"Content Transfer",   
        fields:[{
          label:"Content",            
          operation:{onInput:setContent}             
         }]
       }
     },
     ...
 };
 connector.connect(mobileConfig);           
```
The following configuration specifies a login form:
```JavaScript
 const mobileConfig={        
   initData:{                              
     form:{
        title:"Sign In",
        id:"###username###@mycompany.com",
        fields:[{
           label:"Username",
           id:"username",
           operations:{
            onInput:setUsername
           }
       },{
          label:"Password",            
          id:"password",
          operations:{
            onInput:setPassword
          }
       },{
         label:"Sign In",
         type:"button",            
         operations:{
            onInput:signIn
          }
       }]
     }
   },
   ...
 };
    connector.connect(mobileConfig);           
```
You can try out the sample code above on [JSFiddler](https://jsfiddle.net/dilshat/c5fvyxqa/)


