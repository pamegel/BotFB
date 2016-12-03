var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var data = require('./botfb-bd219-export.json')

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/webhook', function(req, res) {
  var key = 'EAAYB5mZATsskBACBdjfMpAB94jrghicZBhuJafK2go6d4uZCKBPqmAYDMJUuQZCtWRqy37uF1QGbBbos2aWtiLyyEs7aBtLjumrYFQQe2egZCWKNsFej4zVMeIRlWHvaV0kfmgiEEGT14VHIcqFeYN7eZBcJZAsqbJhCbOqx8024AZDZD'
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === key) {
    console.log("Validating webhook");
    res.send(req.query['hub.challenge'])
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

 /* if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);
    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }*/

  if (messageText) {
     switch (messageText) {
        case 'HELLO':
        case 'hello':
        case 'Hello':
        sendTextMessage(senderID, "สวัสดีเหมียววว");
        sendGreetMessage(senderID);
        break;
        case 'ขอบคุณ' :
        case 'ขอบใจ' :
        sendTextMessage(senderID, "ยินดีช่วยเหมียวว <3");
        break;
        case 'สัส' :
        case 'ควย' :
        case 'ฟวย' :
        case 'พ่องตาย' :
        case 'พ่อมึงตาย' :
        case 'แม่งตาย' :
        case 'แม่งตาย' :
        sendTextMessage(senderID, " 👎 สุภาพหน่อย ");
        break;  
        case 'กาก' :
        case 'ควาย' :
        sendTextMessage(senderID, "เดะหน้าเป็นรอยหรอก 😾");
        break
/*case 'quick reply':
sendQuickReply(senderID);
break;*/
        default:
        sendTextMessage(senderID, "พิมพ์อะไรแมวไม่รู้เรื่อง :p \n เลือกเมนูเอาข้างล่างละกัน " );
        sendGreetMessage(senderID)
        }
} else if (messageAttachments) {
  sendTextMessage(senderID, "จุ๊บๆ");
}
}
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);
  if(payload == 'findLocation'){
    findLocations(senderID);
  }
  else if(payload == 'USER_DEFINED_PAYLOAD'){
       sendTextMessage(senderID, "สวัสดีเหมียววว ")
       sendGreetMessage(senderID)
  }
  else if(payload == 'noThank'){
       sendTextMessage(senderID, "ไม่ต้องการความช่วยเหลือเหยออ เหมียวว :("+"\n"+"หากคุณต้องการมองหาที่ๆน่าเที่ยวในปราจีนบุรีอีก ให้แมวช่วยสิ");
       NoThank(senderID)
  }////////////////////////////////////////////////////////////////////////////////////////////
  else if (payload == 'fineHere1') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : ดาษดาแกลเลอรี่");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 09.00-19.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : เป็นชื่อของสถานที่ท่องเที่ยวที่ได้ชื่อว่าเป็น สวรรค์ของคนรักดอกไม้นานาพรรณ ที่นี่มีการนำพันธุ์ไม้ดอกและไม้ประดับหลากหลายชนิด มาจัดแสดงในเรือนกระจกขนาดใหญ่ ");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/87MRktZm3dA2 ");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 037-239-800 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)


  }
  else if (payload == 'fineHere2') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : อุทยานแห่งชาติเขาใหญ่");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 08.00 - 17.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : นับว่าเป็นแหล่งกำเนิดของต้นน้ำลำธารที่ทำให้เกิดปรากฏการณ์ธรรมชาติซึ่งมีน้ำตกน้อยใหญ่เกิดขึ้นหลายแห่งในพื้นที่อุทยานแห่งชาติเขาใหญ่ ซึ่งสำรวจพบและทำเส้นทางเดินเท้าไปถึงแล้วประมาณ 30 แห่ง");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/Hk8TdcS24rE2 ");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n ที่ทำการ : 086-092-6527\n บ้านพัก : 086-092-6529\n ด่านตรวจศาลเจ้าพ่อ : 086-0926531 , 044-249305\nด่านตรวจเนินหอม : 090-7821929");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere3') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : อุทยานแห่งชาติทับลาน");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 08.00 - 18.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : อุทยานแห่งชาติทับลาน จ.ปราจีนบุรี สถานที่ท่องเที่ยวที่โอบล้อมไปด้วยขุนเขา และยังคงความอุดมสมบูรณ์ที่รอให้นักท่องเที่ยวทั่วทุกสารทิศไปสัมผัสความงดงาม");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/suDQDLQCgQD2 ");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 037-210-340 , 092-550-0172 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere4') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : โรงพยาบาลอภัยภูเบศร");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 08.30-17.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : โรงพยาบาลเแห่งนี้ มีขีดความสามารถในการให้การบริการทางการแพทย์ในระดับสูง แต่ต่างจากรพ.อื่นตรงที่มีการผสมผสานการใช้สมุนไพรและการแพทย์แผนไทยเข้าสู่ระบบบริการสุขภาพของโรงพยาบาล");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/JkFqKagn5ZH2 ");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 037-211-088 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere5') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : The Verona at Tublan");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 10.00-20.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : ช้อปชิวๆ มุมถ่ายรูปคลูๆ ไม่ว่าจะมากับครอบครัว คนรู้ใจหรือจะเดินเล่นติสๆ คนเดียวก็เข้าที รวมถึงอร่อยกับร้านอาหารสไตท์ปิ้ง-ย่าง-ชาบู ลานเบียร์ และอื่นๆอีกมากมากมาย พร้อมฟังดนตรีสดๆได้เลย");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/vhams5WeQZR2 ");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 096-324-4423 , 092-324-2636 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere6') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : เขาทุ่ง");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 06.00-18.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : ตั้งอยู่ในเขตอุทยานแห่งชาติเขาใหญ่ ด้านอำเภอนาดี ได้รับฉายาว่าเป็นภูกระดึงแห่งภาคตะวันออก โดยรอบบริเวณบนเขาทุ่งมีลักษณะเป็นที่ราบทุ่งหญ้า เมื่อขึ้นไปยังบริเวณดังกล่าวจะสามารถมองเห็นวิวทิวทัศน์ที่สวยงาม");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/wL2RhapFSzM2");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 086-071-4957 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere7') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : แก่งหินเพิง");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 08.00 - 17.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : เป็นเส้นทางล่องแก่งที่มีระดับความยากอยู่ที่ 3-5 บนระยะทางรวมกว่า 4.5 กิโลเมตร มีลานหินหักที่เทตัวลงมาทำให้เกิดเป็นวังน้ำวนไหลเชี่ยวผ่านแก่งหินต่างๆ ระยะทางกว่า 200 เมตร");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/ZCHmc5QTAXM2");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 083-731-2282 , 083-731-2284 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere8') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : น้ำตกเขาอีโต้");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 08.00 - 16.30 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : เป็นลำธารน้ำที่ไหลผ่านโขดหินน้อยใหญเป็นชั้นๆ ซึ่งคุณสามารถเข้าไปนั่งพักผ่อนตามแนวโขดหินของตัวน้ำตก เพื่อสัมผัสกับสายน้ำที่ไหลผ่านตลอดแนวหิน");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/yhfakNcgeyG2");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 037-312-282 , 037-312-284 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere9') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : อ่างเก็บน้ำจักรพงษ์");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 08.30 - 16.30 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : อยู่บริเวณเชิงเขาอีโต้ จากปากทางเข้าอ่างเก็บน้ำให้เลี้ยวซ้ายจะมีถนนขึ้นไปจนถึงยอดเขาเพื่อชมทัศนียภาพโดยรอบ ระยะทางประมาณ 11 กิโลเมตร");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/SHBzmQmkdyM2");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 037-312-282 , 037-312-284 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)
  }
  else if (payload == 'fineHere10') {
  setTimeout(function(){  sendTextMessage(senderID, "📌 ชือ : โบราณสถานสระมรกต");},500)
  setTimeout(function(){  sendTextMessage(senderID, "⏰ เวลาทำการ : 09.00 - 16.00 น.");},1000)
  setTimeout(function(){  sendTextMessage(senderID, "📅 วันเปิดทำการ : เปิดทำการทุกวัน");},1500)
  setTimeout(function(){  sendTextMessage(senderID, "📣 คำอธิบาย : โบราณสถานสระมรกต ประกอบด้วยรอยพระพุทธบาทคู่ ซึ่งสลักลงไปในพื้นศิลาแลงธรรมชาติลักษณะเหมือนจริง เป็นรอยพระพุทธบาทเก่าแก่ที่สุดในเมืองไทย อายุราวพุทธศตวรรษที่ 11-13");},2000)
  setTimeout(function(){  sendTextMessage(senderID, "🌍 แผนที่ : https://goo.gl/maps/Je2UowcSMLE2 ");},2500)
  setTimeout(function(){  sendTextMessage(senderID, "☎️ ติดต่อเพิ่มเติม \n 037-276-084 ");},3000)
  setTimeout(function(){  fineHeres(senderID);},3500)

  }else {
    var result = "";
  }

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  // sendTextMessage(senderID, emoji);
}
// --------------------ทักทายตอบกลับ---------------------------
function sendGreetMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text : "นี้คือคู่มือสถานที่ท่องเที่ยวของคุณในปราจีนบุรี แมวมีตัวเลือกให้ข้างล่าง",
            buttons: [{
              type: "postback",
              title: "🔎 หาที่เที่ยว",
              payload: "findLocation"
            }, {
              type: "postback",
              title: "👋 ไม่เป็นไร ขอบคุณ",
              payload: "noThank"
            }],
        }
      }
    }
  };

  callSendAPI(messageData);
}
//-----------------------------------------------------------------------------
//------------------หาสถานที่---------------------------------------------------
function findLocations(recipientId, messageText) {
  var messageData = {
  recipient: {
    id : recipientId
  },
  message:{
    attachment:{
      type:"template",
      payload:{
        template_type:"generic",
        elements:[
          {
            title:"ดาษดาแกลเลอรี่",
            item_url:"",
            image_url:"http://www.mx7.com/i/1f6/XV3hWB.jpg",
            subtitle:" ",
            buttons:[
              {
                type:"postback",
                title:"📍 เลือกที่นี้",
                payload:"fineHere1"
              }]
           },
           {
             title:"อุทยานแห่งชาติเขาใหญ่",
             item_url:"",
             image_url:"http://www.mx7.com/i/963/tLXLbq.jpg",
             subtitle:" ",
             buttons:[
               {
                 type:"postback",
                 title:"📍 เลือกที่นี้",
                 payload:"fineHere2"
               }]
            },
            {
              title:"อุทยานแห่งชาติทับลาน",
              item_url:"",
              image_url:"http://www.mx7.com/i/115/GscHWV.jpg",
              subtitle:" ",
              buttons:[
                {
                  type:"postback",
                  title:"📍 เลือกที่นี้",
                  payload:"fineHere3"
                }]
             },
             {
               title:"โรงพยาบาลอภัยภูเบศร",
               item_url:"",
               image_url:"http://www.mx7.com/i/938/nytfo7.jpg",
               subtitle:" ",
               buttons:[
                 {
                   type:"postback",
                   title:"📍 เลือกที่นี้",
                   payload:"fineHere4"
                 }]
              },
              {
                title:"The Verona at Tublan",
                item_url:"",
                image_url:"http://www.mx7.com/i/158/X6K3Pu.jpg",
                subtitle:" ",
                buttons:[
                  {
                    type:"postback",
                    title:"📍 เลือกที่นี้",
                    payload:"fineHere5"
                  }]
               },
               {
                 title:"เขาทุ่ง",
                 item_url:"",
                 image_url:"http://www.mx7.com/i/b8f/l4MHfg.jpg",
                 subtitle:" ",
                 buttons:[
                   {
                     type:"postback",
                     title:"📍 เลือกที่นี้",
                     payload:"fineHere6"
                   }]
                },
                {
                  title:"แก่งหินเพิง",
                  item_url:"",
                  image_url:"http://www.mx7.com/i/d03/8j83vO.jpg",
                  subtitle:" ",
                  buttons:[
                    {
                      type:"postback",
                      title:"📍 เลือกที่นี้",
                      payload:"fineHere7"
                    }]
                 },
                 {
                   title:"น้ำตกเขาอีโต้",
                   item_url:"",
                   image_url:"http://www.mx7.com/i/97f/thdg1i.jpg",
                   subtitle:" ",
                   buttons:[
                     {
                       type:"postback",
                       title:"📍 เลือกที่นี้",
                       payload:"fineHere8"
                     }]
                  },
                  {
                    title:"อ่างเก็บน้ำจักรพงษ์",
                    item_url:"",
                    image_url:"http://www.mx7.com/i/9a7/zp2b7A.jpg",
                    subtitle:" ",
                    buttons:[
                      {
                        type:"postback",
                        title:"📍 เลือกที่นี้",
                        payload:"fineHere9"
                      }]
                   },
                   {
                     title:"โบราณสถานสระมรกต",
                     item_url:"",
                     image_url:"http://www.mx7.com/i/bed/rB7MJv.jpg",
                     subtitle:" ",
                     buttons:[
                       {
                         type:"postback",
                         title:"📍 เลือกที่นี้",
                         payload:"fineHere10"
                       },
                       ]
                    }]
      }
    }
  }
};
callSendAPI(messageData);
}
//-----------------------------------------------------------------------------
//----------------ตอบกลับ------------------------------------------------------
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}
//------------------------------------------------------------------------------
//--------ดึงAPIคนที่คุยด้วย---------------------------------------------------------
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAYB5mZATsskBACBdjfMpAB94jrghicZBhuJafK2go6d4uZCKBPqmAYDMJUuQZCtWRqy37uF1QGbBbos2aWtiLyyEs7aBtLjumrYFQQe2egZCWKNsFej4zVMeIRlWHvaV0kfmgiEEGT14VHIcqFeYN7eZBcJZAsqbJhCbOqx8024AZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}
//------------------------------------------------------------------------------
//------------ก่อนจาก-----------------------------------------------------------
function fineHeres(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text : "หวังว่าจะช่วยได้นะ เหมียวว :3",
            buttons: [{
              type: "postback",
              title: "🔎 อยากหาที่อื่นอีก",
              payload: "findLocation"
            }],
        }
      }
    }
  };

  callSendAPI(messageData);
}
function NoThank(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text : "ไม่อยากให้ช่วยจริงเหรอ :3 ",
            buttons: [{
              type: "postback",
              title: "🔎 ช่วยหน่อยสิ",
              payload: "findLocation"
            }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Action",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type":"text",
          "title":"Comedy",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type":"text",
          "title":"Drama",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };
  callSendAPI(messageData);
}*/

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})
