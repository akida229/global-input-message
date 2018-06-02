# global-input-message
```global-input-message``` is a JavaScript library for transfering the end-to-end encypted data via the [Global Input WebSocket server](https://github.com/global-input/global-input-node).

The WebSocket client applications can simply pass the unencrypted messsages to the global-input-message JavaScript library, which encrypts the message content and forwards them over to the destination. On the receiving end, the WebSocket client appplication can simply register a callback function to the [global-input-message] JavaScript library to receive the decrypted messages. The JavaScript library is responsible to receiving the encrypted messages, decrypting them and forwarding the decrypted message to the registered callback function. The end-to-end encryption details and the message routing logic is transparently implemented inside the JavaScript library.

### Setup
The Websocket applications need to use the QR codes to share the encryption key as well as the other connection parameters with each other so that they can transfer the message using the end-to-end encryption. Hence, beside including the global-input-message JavaScript module, you may also include another QR Code Javascript module in your set up process.  

Type the following command in your project directory to install the global-input-message node module

```shell
npm install --save global-input-message
```

 Type the following command to to install the [davidshimjs's qrcode module](https://github.com/davidshimjs/qrcodejs)

 ```shell
 npm install --save davidshimjs-qrcodejs
 ```

 and then include  ```import```/```require``` to the javascript libraries in your code:
 ```javascript
	import {createMessageConnector} from "global-input-message";
```

If your JavaScript application is a traditonal HTML+Javascript application without using any transpilers, dependency or development tools, you can set it up by placing  the following scrip tags in your HTML page:
```javascript
<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/04f46c6a/qrcode.min.js">
</script>

<script src="https://unpkg.com/global-input-message@1.4.6/lib/global-input-message.min.js">
</script>
```

### Hello World Example
The following defines a form field to receive messages from another device (mobile), when a user type in the field on the mobile, the javascript console in the computer will display the content received:

```javascript
var options={
     initData:{
            form:{                                       
                title:"Type Something in the following field:",        
                fields:[{
                    label:"Content",
                    operations:{
                        onInput:function(content){                                                                 console.log("Content received:"+content);
                        }
                    }
                }]
             }
        }
    };
```
The


For example, if you use the ES6 transpiler, then you can import the ```createMessageConnector``` function from the package and then call that function to create message connector:

```javascript
	import {createMessageConnector} from "global-input-message";
    var connector=createMessageConnector();
```
If you do not use the ES6 transpier, then you can use ```require``` instead, check [this example](https://jsfiddle.net/dilshat/c5fvyxqa/) for actual example for this.

##### Set up as a browserified JS and include it in the javascript tag

In your HTML code, include the qrcode javascript library as well as the ```global-input-message``` javascript library:

```javascript
<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/04f46c6a/qrcode.min.js">
</script>

<script src="https://unpkg.com/global-input-message@1.4.6/lib/global-input-message.min.js">
</script>

```

In the above code, the first line uses the [davidshimjs's qrcode javascript library](https://github.com/davidshimjs/qrcodejs), which you need to use to display the QR code to share the encryption key etc with the other WebSocket client application.

Now you can create the WebSocket connector in your javascript code:

```javascript
	var globalinput=require("global-input-message");
    var connector = globalinput.createMessageConnector();
```
### Define configuration object.
The configuration define the callback intwerface to receive the






### Usage

After implement the set up process explained in the Setup section, you just need to call  ```connect()``` method, and get the codedata from the connector.

```
    connector.connect(globalInputConfig);
    var codedata=connector.buildInputCodeData();
```

 The codedata contains the information necessary for the mobile app to connect to your application. For example, it contains the encryption key used for end-to-end encryption and the necessary connection information. This data should be displayed as the content of the QR code, so that the mobile can obtain the ionformation to establish the secure communication to your application.

In the above code, the ```globalInputConfig```  variable is passed in to the connect method. The variable contains the information about the form that you would like to display on the mobile screen. It also contains the callback function that you would like to be invoked when the user interacts with the form. I explain this in details in the next section.

After that, you just need to display the coedata content with the QR code:

```javascript    
      var qrcode = new QRCode(document.getElementById("qrcode"), {
      text: codedata,
      width: 300,
      height: 300,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
```

Above code requires you to define a HTML element with the id ```qrcode```:

```
  <div id="qrcode"></div>
```

That is all you need to do allow your users to operate on your application via their mobile.


### Configuration

As explained above, the ```globalInputConfig```  variable is passed in to the connect method. The variable defines the form that you would like to display on the mobile phone screen. It also contains the callback function that you would like to be invoked when the user interact with the form.

This can be explained very easily with the following requirements that you may have:

* Suppose you would like to display a ```Sign In``` form on the mobile screen.
* You would like the form to contain ```Email Address``` input field,  a ```Password``` input field and a ```Login``` button.
* When a user enters something in the ```Email Address``` field on the mobile screen, you would like your function  ```setUsername(username)``` invoked.
* When a user enters something in the ```Password``` field on the mobile screen, you would like your function called ```setPassword(password)``` invoked with the text entered.
* When a user clicks on the ```Login``` button on the mobile screen, you would like your function ```login()``` invoked, so that you can do the login operation within your ```login()``` function

The following ```globalInputConfig``` variable contains the data that satisfies the requirements described above.

```javascript

var globaInputConfig = {
        initData:{                
               form:{
                      title:"Sign In",
                      fields:[{
                                   label:"Email address",
                                   operations:{
                                       onInput:setUsername
                                   }

                             },{
                                 label:"Password",
                                 type:"secret",
                                 operations:{
                                     onInput:setPassword
                                 }

                             },{
                                 label:"Login",
                                 type:"button",
                                 operations:{
                                 onInput:login
                                }
                             }]
                     }

               }               

 };
```

Click on the the [JS Fiddler](https://jsfiddle.net/dilshat/c5fvyxqa/) link to play around with the above code and see it in action.

Folllwing is the explainartion with line by line:

(1)
```
var globaInputConfig = {
        initData:{                
```
defines the ```globaInputConfig``` variable, it has the ```initData``` object, which contain all the data for initialising the Global Input Mobile app on the other end.

(2)

```
form:{
       title:"Sign In",
```
defines the form that is to be displayed on the mobile screen. Obviously, ```Sign In``` will be displayed on the mobile screen as the title.


(3)
```
fields:[{
```
defines an array containing the form elements.

(4)
```
{
             label:"Email address",
             operations:{
                 onInput:setUsername
             }

}
```
Instructs the mobile app to display a ```text``` field on the mobile screen with the label ```Email Address```. Because the ```type``` is not defined, and the default value of the ```type``` is ```text```, the mobile display the text field.  
The ```operations``` contains  contains all the callback functions. The ```onInput``` callback function will be invoked when user is entering text on the field. In this case, ```setUsername(username)``` will be invoked for each user typing in the ```Email Address``` field. The function ```setUsername(username)``` will passed in with the current value in the ```Email Address``` field.


(5)

```
{
     label:"Password",
     type:"secret",
     operations:{
           onInput:setPassword
     }
 }
```                             
Instructs the mobile app to display a ```secret``` field on the mobile screen with the label ```Password```. The ```type``` defines the types of form field, it can be ```button```, ```secret```, ```range```, ```text```, ```list``` etc. If it is not defined, it take the default value ```text```.

The ```operations``` contains  contains all the callback functions.

The ```onInput``` callback function will be invoked when user is entering text on the field. In this case, ```setPassword(password)``` will be invoked for each user typing in the ```password``` field. The function ```setUPassword(password)``` will passed in with the current value in the ```password``` field.

(6)
```
{
      label:"Login",
      type:"button",
      operations:{
             onInput:login
      }
 }
```                             


Instructs the mobile app to display a ```Login``` button on the mobile screen. The ```type``` defines the types of form field, it can be ```button```, ```secret```, ```range```, ```text```, ```list``` etc.

The ```operations``` contains all the callback functions.

The ```onInput``` callback function will be invoked when user has clicked on the button. In this case, ```login()``` function will be invoked.

With the above addition to your application, your application can display a QR code, so that the Global Input App can scan it to connect to your app and display any form you like and calls back your function on your choice.

The communication between your application and the Global Input app is absolutely secure. An encryption key will be generated for each session and will be part of the QR code to be transferred to the mobile app to establish a secure end-to-end encryption. Nothing between your application and the Global Input App will know what the user is typing. Furthermore, you can control the authentication and authorisation from within your app when the mobile app tries to connect to your mobile.


Please try it out this free library and the free mobile app, and you will see that you can use Global Input app on your mobile to operate on your application. If you like our solution, let us know so we will be encouraged to make it better and exciting without support and encouragement!

You can also find some applications in action in

[https://globalinput.co.uk/](https://globalinput.co.uk/)
