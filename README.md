
## global-input-message

This is a [Global Input App](https://globalinput.co.uk) JavaScript library for web and device applications to implement mobile integrations.

The [Global Input App](https://globalinput.co.uk) with its extensions provides a universal mobile integration solution for web and device applications, allowing users to use mobiles to operate on those applications. It provides applications with mobile input, mobile control, and portable encrypted storage functionalities without the need to develop separate mobile apps. Applications can implement mobile integration logic within its application context.


Some of its use cases:
* [Mobile Authentication](https://globalinput.co.uk/global-input-app/about-mobile-authentication)
* [Mobile Input & Control](https://globalinput.co.uk/global-input-app/about-mobile-control)
* [Second Screen Experience](https://globalinput.co.uk/global-input-app/about-second-screen)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/about-print-scan-qrcodes)




## React Application

For React application, please use the [Global Input React](https://github.com/global-input/global-input-react) Component that
you may find much more straightforward to use.


## Setup

The following command installs the ```npm``` module:

```shell
npm install --save global-input-message
```

## Usage

import and create a connector object:



```JavaScript
import {createMessageConnector} from "global-input-message";
var gloalinputconnector=createMessageConnector();
```

or if you use require:

```JavaScript
var globalInputMessage=require("global-input-message");
var gloalinputconnector=globalInputMessage.createMessageConnector();
```

or if you are using manual linking of your JavaScript files:

```JavaScript
<script src="https://unpkg.com/global-input-message@1.6.6/distribution/globalinputmessage.min.js">
</script>
```

Let's say that you would like to display a text field, labelled as ```Content```, on the user's mobile screen after the user has connected to your application by scanning an encrypted QR code. And you would like to receive the content when the user is typing on his/her mobile:


```JavaScript

 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Content Transfer",   
                                fields:[{
                                  label:"Content",            
                                  operations:{
                                      onInput:value=>setContent(value);
                                  }
                                }]
                              }
                          },
                          onRegistered:function(next){
                                  next();
                                  displayQRCode();
                          }
             };
  gloalinputconnector.connect(mobileConfig);           
```

On scanning the Encrypted QR Code using the [Global Input App](https://globalinput.co.uk/), a form titles as "Content Transfer" will be displayed on the mobile screen. The form contains a single field labelled as "Content". If you type on the content field on your mobile, the ```setContent()'``` will be invoked with the content parameter in real-time. The GlobalInputConnect component is responsible for displaying an encrypted QR code that contains a one-time-use encryption key among other communication channel parameters.

The 'displayQRCode' function displays an encrypted QR code that contains a one-time-use encryption key among other communication channel parameters.


### Another Example

Let's say that you would like to display a button, labelled with ```Play```, on the user's mobile screen after the user has connected to your application by scanning the encrypted QR code. And you would like to invoke ```play()``` function when the user has press the button on his/her mobile. You can include the following code to achieve that:


```JavaScript

 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Play",   
                                fields:[{
                                  label:"Play",
                                  type:"button",            
                                  operations:{
                                      onInput:()=>play();
                                  }
                                }]
                              }
                          },
                          onRegistered:function(next){
                                  next();
                                  displayQRCode();
                          }
             };
  gloalinputconnector.connect(mobileConfig);           
```

### Sign In Example
Let's say that you would like to display a ```Username``` and a ```Password``` fields, and a ```Sign In``` button, on
the user's mobile screen after the user has connected to your application by scanning the encrypted QR code. And you would like to receive user inputs via ```setUsername(username)``` and ```setPassword(password)``` functions when the user are filling their credentials. And you would like to invoke ```signIn()``` function when the user has pressed the ```Sign In``` button on
his/her button. You can include the following code to achieve that:

```JavaScript
 let mobileConfig={        
                          initData:{                              
                              form:{
                                	title:"Sign In",
                                  id:"###username###@mycompany.com",  
                                fields:[{
                                  label:"Username",            
                                  operations:{
                                      onInput:username=>setUsername(username);
                                  }
                                },{
                                  label:"Password",            
                                  operations:{
                                      onInput:password=>setPassword(password);
                                  }
                                },{
                                  label:"Sign In",
                                  type:"button",            
                                  operations:{
                                      onInput:()=>signIn();
                                  }
                                }]
                              }
                          },
             };

    gloalinputconnector.connect(mobileConfig);           
```

In the above example, The ```id``` of the form identifies the form data when the user saves/loads the data from/to the encrypted storage on his/her mobile device. using place holder ```###username###``` allows to identifies data uniquely when multiple accounts on the same domain are used.

## More Examples
* [Content Transfer Example](https://globalinput.co.uk/global-input-app/content-transfer)
* [Second Screen Application](https://globalinput.co.uk/global-input-app/video-player)
* [Game Control Application](https://globalinput.co.uk/global-input-app/game-example)
* [Mobile Form Automation](https://globalinput.co.uk/global-input-app/send-message)
* [Mobile Form Transfer](https://globalinput.co.uk/global-input-app/form-data-transfer)
* [Mobile Content Encryption](https://globalinput.co.uk/global-input-app/qr-printing)
