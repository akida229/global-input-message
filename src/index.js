import SocketIOClient from "socket.io-client";
import {encrypt,decrypt} from "./aes";
export function createGUID() {
 function s4() {
   return Math.floor((1 + Math.random()) * 0x10000)
     .toString(16)
     .substring(1);
 }
 return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
   s4() + '-' + s4() + s4() + s4();
}

function createAESKey(){
  return createGUID();
}
 class GlobalInputMessageConnector{
    log(message){
      console.log(this.client+":"+message);
    }
    constructor(){
        this.apikey="756ffa56-69ef-11e7-907b-a6006ad3dba0";
        this.sessionGroup="359a15fa-23e7-4a10-89fa-efc12d2ee891";
        this.session=createGUID();
        this.client=createGUID();
        this.aes=createGUID();
        this.socket=null;
        this.action="input";

        this.connectedInputSenders=new Map();
        this.url="https://globalinput.co.uk";

    }
    isConnected(){
      return this.socket!=null;
    }
    disconnect(){
        if(this.socket){
          this.socket.disconnect();
          this.socket=null;
        }
        this.targetSession=null;
    }
    connect(options={}){
        this.disconnect();

         if(options.apikey){
              this.apikey=options.apikey;
          }
          if(options.url){
            this.url=options.url;
          }
          this.log("connecting to:"+this.url);
          this.socket=SocketIOClient(this.url);
          const that=this;
          this.socket.on("registerPermission", function(data){
                 that.log("registerPermission message is received:"+data);
                  that.onRegisterPermission(JSON.parse(data), options);
          });
          this.log("connection process complete, will for permisstion to register");
    }
    onRegisterPermission(registerPermistion, options){
         if(registerPermistion.result==="ok"){
                 var that=this;
                 this.socket.on("registered", function(data){
                         that.log("received the registered message:"+data);
                         var registeredMessage=JSON.parse(data);
                         if(options.onRegistered){
                            options.onRegistered(function(){
                                that.onRegistered(registeredMessage,options);
                            },registeredMessage,options);
                         }
                         else{
                              that.onRegistered(registeredMessage,options);
                         }
                 });
                 const registerMessage={
                       sessionGroup:this.sessionGroup,
                       session:this.session,
                       client:this.client,
                       apikey:this.apikey
                 };
                 this.log("sending register message");
                 this.socket.emit("register", JSON.stringify(registerMessage));
         }
         else{
                this.log("failed to get register permission");
         }


    }


    onRegistered(registeredMessage, options){
            var that=this;
            this.socket.on(this.session+"/inputPermission", function(data){
                that.log("inputPermission message is received:"+data);
                const inputPermissionMessage=JSON.parse(data);
                if(options.onInputPermission){
                    options.onInputPermission(function(){
                        inputPermissionMessage.allow=true;
                        that.onInputPermission(inputPermissionMessage,options);
                    },function(){
                      inputPermissionMessage.allow=false;
                      that.onInputPermission(inputPermissionMessage,options);
                    },inputPermissionMessage,options);
                }
                else{
                    inputPermissionMessage.allow=true;
                    that.onInputPermission(inputPermissionMessage,options);
                }
            });
            if(options.inputSession){
                    that.socket.on(options.inputSession+"/inputPermissionResult", function(data){
                    that.log("inputPermissionResult is received "+data);
                    that.onInputPermissionResult(JSON.parse(data),options);
                    });
                    const requestInputPermissionMessage={
                          sessionGroup:that.sessionGroup,
                          session:that.session,
                          client:that.client,
                          inputSession:options.inputSession
                    };
                    const data=JSON.stringify(requestInputPermissionMessage)
                    this.log("sending the requestInputPermissionMessage:"+data);
                    this.socket.emit("inputPermision",data);
            }

    }

    onInputPermission(inputPermissionMessage,options){
            var that=this;
            const inputSender=this.buildInputSender(inputPermissionMessage,options);
            this.connectedInputSenders.set(inputPermissionMessage.client,inputSender);
            if(options.onSendedJoin){
                      options.onSendedJoin(inputSender);
            }
            this.socket.on(that.session+"/input", inputSender.onInput);
            this.socket.on(that.session+"/leave",inputSender.onLeave);
            var inputPermissionResult=Object.assign({},inputPermissionMessage);
            if(options.metadata){
                    inputPermissionResult.metadata=options.metadata;
            }
            var data=JSON.stringify(inputPermissionResult)
            this.log("sending the inputPermissionResult  message:"+data);
            this.socket.emit(this.session+"/inputPermissionResult",data);
    }

    onInputPermissionResult(inputPermissionResultMessage, options){
            this.inputSession=options.inputSession;
            this.inputAES=options.aes;
            if(options.onInputPermissionResult){
              options.onInputPermissionResult(inputPermissionResultMessage);
            }
    }

    buildInputSender(inputPermissionMessage,options){
      var that=this;
      var inputSender={
        client:inputPermissionMessage.client,
        session:inputPermissionMessage.session,
        onInput:function(data){
            that.log("input message received:"+data);
            if(options.onInput){
                const inputMessage=JSON.parse(data);
                if(inputMessage.client===that.client){
                    that.log("input message is coming from itself:"+data);
                  }
                else{

                    if(that.aes && inputMessage.data){
                          var dataDecrypted=decrypt(inputMessage.data,that.aes);
                          that.log("decrypted:"+dataDecrypted);
                          inputMessage.data=JSON.parse(dataDecrypted);
                    }
                    options.onInput(inputMessage);
                  }

              }

         },
         onLeave:function(data){
             that.log("leave request is received:"+data);
             const leaveMessage=JSON.parse(data);
             const inputSenderToLeave=that.connectedInputSenders.get(leaveMessage.client);
             if(inputSenderToLeave){
                 that.socket.removeListener(this.session+"/input",inputSenderToLeave.onInput);
                 that.socket.removeListener(this.session+"/leave",inputSenderToLeave.onLeave);
                 that.connectedInputSenders.delete(leaveMessage.client);
                 that.log("sender is removed:"+that.connectedInputSenders.size);
                 if(options.onLeave){
                     options.onLeave(inputSenderToLeave);
                 }
               }
         }
      };
      return inputSender;
    }





   sendInputMessage(data){
      if(!this.isConnected()){
           this.log("not connected yet");
           return;
      }

      var message={
          client:this.client,
          session:this.session,
          inputSession:this.inputSession,
          data
      }
      if(this.inputAES){
          const contentToEncrypt=JSON.stringify(message.data);
          this.log("content to be encrypted:"+contentToEncrypt);
          const contentEcrypted=encrypt(contentToEncrypt,this.inputAES);
          this.log("content encrypted:"+contentEcrypted);
          message.data=contentEcrypted;
      }

       const content=JSON.stringify(message);
       this.log("sending input message  to:"+this.inputSession+" content:"+content);
       this.socket.emit(this.inputSession+'/input', content);


   }
   sendMetadata(metadata){
     if(!this.isConnected()){
          this.log("not connected yet");
          return;
     }
     var message={
         client:this.client,
         inputSession:this.inputSession,
         metadata
     }
     const content=JSON.stringify(message);
     this.log("sending metdata message  to:"+this.inputSession+" content:"+content);
     this.socket.emit(this.inputSession+'/metadata', content);
   }


   buildInputCodeData(data={}){
       return Object.assign(data,{
                   url:this.url,
                   session:this.session,
                   action:"input",
                   aes:this.aes
       });
   }
   processCodeData(opts={},codedata){
      console.log("codedata:"+JSON.stringify(codedata));
      if(codedata.action=='input'){
            const options=Object.assign({},opts);
            options.inputSession=codedata.session;
            options.url=codedata.url;
            options.aes=codedata.aes;
            this.connect(options);
      }
   }



}

 export function createMessageConnector(){
   return new GlobalInputMessageConnector();
 }
