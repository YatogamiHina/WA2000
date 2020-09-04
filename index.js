var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var app = express();

var jsonParser = bodyParser.json();

var options = {
  host: 'api.line.me',
  port: 443,
  path: '/v2/bot/message/reply',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer FCqFqvATGYaH/la4saJXy4zTPjLPXPTpYucDGsDhqbVBylZ/ulbO/LPIUoRRtToSv7lBSu/9UmgAPvupIHpdntCpDTNqeHQK4cIXL5Ti5wwJdShhvcXQ3pr+yHwL2JSHeVn+WfWSn4QpNm5tGpwzzAdB04t89/1O/w1cDnyilFU='

  }
}
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files

app.get('/', function(req, res) {
//  res.send(parseInput(req.query.input));
  res.send('Hello');
});

app.post('/', jsonParser, function(req, res) {
  let event = req.body.events[0];
  let type = event.type;
  let msgType = event.message.type;
  let msg = event.message.text;
  let rplyToken = event.replyToken;

  let rplyVal = null;
  console.log(msg);
  if (type == 'message' && msgType == 'text') {
    try {
      rplyVal = parseInput(rplyToken, msg);
    }
    catch(e) {
      console.log('catch error');
    }
  }

  if (rplyVal) {
    replyMsgToLine(rplyToken, rplyVal);
  } else {
    console.log('Do not trigger');
  }

  res.send('ok');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function replyMsgToLine(rplyToken, rplyVal) {
  let rplyObj = {
    replyToken: rplyToken,
    messages: [
      {
        type: "text",
        text: rplyVal
      }
    ]
  }

  let rplyJson = JSON.stringify(rplyObj);

  var request = https.request(options, function(response) {
    console.log('Status: ' + response.statusCode);
    console.log('Headers: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function(body) {
      console.log(body);
    });
  });
  request.on('error', function(e) {
    console.log('Request error: ' + e.message);
  })
  request.end(rplyJson);
}


function SendMsg(rplyToken, rplyVal) {
  let rplyObj = {
    replyToken: rplyToken,
    messages: rplyVal
  }

  let rplyJson = JSON.stringify(rplyObj);

  var request = https.request(options, function(response) {
    console.log('Status: ' + response.statusCode);
    console.log('Headers: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function(body) {
      console.log(body);
    });
  });
  request.on('error', function(e) {
    console.log('Request error: ' + e.message);
  })
  request.end(rplyJson);
}


//上面的部分呢，是LINE BOT能夠運轉，和伺服器的一些連結與認證有關。坦白說有很多部份我也不太確定是幹嘛用的，不要亂動比較安全。

//以下是這個機器人在處理指令的核心。
function parseInput(rplyToken, inputStr) {
        //此處傳入的變數inputStr是大家輸入的文字訊息。
        //其實LineBot可以讀取的不只有文字訊息，貼圖、圖片等都可辨識。
        //但有看得懂上半段的程式碼的人可能會注意到，我們擋掉了其他的種類。只留文字訊息。
        //這是因為這個機器人的主要目的是擲骰，所以專注以處理文字指令為主。
        //而這個函數最後return的也將會以文字訊息的方式回覆給使用者。
        //回傳非文字訊息的方式，下文會另外敘述。


        //這一段不要理他，因為我看不懂，總之留著。
        console.log('InputStr: ' + inputStr);
        _isNaN = function(obj) {
          return isNaN(parseInt(obj));
        }



        //以下這一串是一連串的判定，用來判斷是否有觸發條件的關鍵字。

        //這是我用來測試用的，可以刪掉。
        if (inputStr.match(/^DvTest/) != null) return DvTest(rplyToken, inputStr) ;
        else

        //底下是做為一個擲骰機器人的核心功能。
        //CoC7th系統的判定在此，關鍵字是「句首的cc」，在此的判定使用正則表達式。
        //用 / / 框起來的部分就是正則表達式的範圍， ^ 代表句首，所以 ^cc 就代表句首的cc。
        if (inputStr.toLowerCase().match(/^cc/)!= null) return CoC7th(rplyToken, inputStr.toLowerCase()) ;
        else

        //pbta系統判定在此，關鍵字是「句首的pb」。
        if (inputStr.toLowerCase().match(/^pb/)!= null) return pbta(inputStr.toLowerCase()) ;
        else

	//這三個是偏向玩鬧型的功能，如果說只是要擲骰可以不管。
        //鴨霸獸指令開始於此
        if (inputStr.match('WA2000') != null) return YabasoReply(inputStr) ;
        else

	//圖片訊息在此
        if (inputStr.toLowerCase().match('.jpg') != null) return SendImg(rplyToken, inputStr) ;
        else

        if (inputStr.match('召喚拜亞基') != null) return Byakhee(inputStr) ;
        else

        if (inputStr.match('召喚黑山羊幼仔') != null) return DarkYoung(inputStr) ;
        else

        if (inputStr.match('召喚空鬼') != null) return Shambler(inputStr) ;
        else

	//通用擲骰判定在此，這邊的判定比較寬鬆。
        //第一部分的 \w 代表「包括底線的任何單詞字元」，所以兩個部份的意涵就是：
        //「不是全部都是空白或中文字，而且裡面含有d的訊息」都會觸發這個判定。
        //為了要正確運作，剩下的判定式還有很多，寫在這邊太冗長所以擺在nomalDiceRoller裡面了。
	//為什麼判定要放最後呢，不然只要有d都會被當成這個，很不方便
        if (inputStr.match(/\w/)!=null && inputStr.toLowerCase().match(/d/)!=null) {
          return nomalDiceRoller(inputStr);
        }

        else return undefined;

}


function DvTest(rplyToken, inputStr){
  let rePly = '開發者測試：\n';
	let fumbleImgArr =['https://i.imgur.com/ju9UQzA.png','https://i.imgur.com/M3meWXu.png'];
	let fumbleImg = fumbleImgArr[Dice(fumbleImgArr.length)-1];
	let fumble = [
			{
			type: "text",
			text: rePly
			},
			{
			type: "image",
			originalContentUrl: fumbleImg,
			previewImageUrl:fumbleImg
			}
		]
		SendMsg(rplyToken, fumble);
return undefined;

  //let testStr = '2d10+10';
  //rePly=rePly + DiceCal(testStr).eq + '\n' + DiceCal(testStr).eqStr ;
  let i =1;
  let testStr = '200 =1.2a3456';
  //rePly=rePly + parseInt(testStr.split('=',2)[1]) ;
  return rePly + (i+1+2);

  let testValue = inputStr.toLowerCase().split(' ',2)[1];
  let a ;
  let b = 3;
  //if,else簡寫
  // (布林值)?為真時的狀況:不為真時狀況;
  (testValue > 5)?a=5:a=10,b=20;
  rePly = rePly + a +':'+ b;
  return rePly;

}


//這可能是整個程式中最重要的一個函數。它是用來做「擲骰」的最基本部份，會一直被叫出來用。
//它的功能是，打 Dice(6) ，就會像骰六面骰一樣骰出一個介於1和6間的整數。
function Dice(diceSided){
  //首先，Math.random()是一個製造亂數的函數，它會產生一個介於0～1的隨機數（不包含1）
  //然後我們將它乘上diceSided，就是我們指定的骰子面數。以剛剛的六面骰為例，它會產生一個0~6之間的隨機數（不包含6）。
  //接下來就要說 Math.floor() 了，它會把數字的小數部分無條件捨棄掉，變成整數。所以把上面那個餵他之後就會出現0~5這六個整數。
  //但是我們要的是1~6不是0~5，所以要找個地方+1，大概就是這樣啦。
  return Math.floor((Math.random() * diceSided) + 1)
}



//這個就是通用擲骰啦！
//但這是一個很大的東西，我拆成幾個不同的部分。
//nomalDiceRoller是程式的最外圍，主要是做複數擲骰與否的判定和最終輸出，然後加上「基本擲骰」的字樣。
//DiceCal和RollDice是計算的函數，RollDice把骰子骰出來變成數字，DiceCal負責把算式算出來變成值。
//舉例來說，2D10+3D8 這串，其中的2D10和3D8只要進到RollDice裡面，它會把裡面的骰子骰出來。
//2D10 會變成 (5+2) ，3D8 會變成像 (2+7+5) 。最後輸出回 DiceCal 組合成像 (5+2)+(2+7+5) 的算式。
//DiceCal他會計算出結果，然後加上等號，變成 (5+2)+(2+7+5)=21
//之所以拆開，是因為RollDice和DiceCal在其他地方還可以拿來用，所以才拆開。
function nomalDiceRoller(inputStr){

  //先定義要輸出的Str
  //先把這個打出來，然後在過程中一點一點把它補上去，大部分的思路是這樣的。
  let finalStr = '' ;

  //首先判斷是否是誤啟動，檢查是否有符合骰子格式，就是d的前後有沒有都是數字。
  //這邊就複雜一點，我們拆開來看： \d+ d \d+
  //先看 \d ，這代表「數字字元」。再來是 + ，他是指「前面這個東西至少要出現一次（可以超過一次）」
  //因此 \d+ 代表「至少要有一個數字」。
  //所以在中間的 d 的前後各有一個 \d+ ，就是「緊鄰 d 的前後都至少要有一個數字。」
  if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;

  //再來先把第一個分段拆出來，待會判斷是否是複數擲骰
  //match這個函數本來就是用來把符合的部分摘取出來，那 \S 代表的是「句首的非空白字元」的意思。
  //所以 \S+ 就是句首的所有非空白字元，舉例來說就是 "Hello World!" 的話，他會從第一個字元一直抓到遇到空白為止，
  //因此會抓出 Hello 這個部份。
  let mutiOrNot = inputStr.toLowerCase().match(/\S+/);

  //排除小數點，其實我也不知道為什麼不能用 '.' ，總之就是會報錯。
  //注意 . 這個字元在正則表達式裡面有特殊意義，所以單指小數點的時候要加 \ ，變成 \.
  if (mutiOrNot.toString().match(/\./)!=null)return undefined;

  //把剛剛的第一個分段拉出來看，我們這裡設定的複數擲骰語法是這樣： 3 2d6+1
  //這樣就會輸出三次 2d6+1 ，所以最前面那個一定要是整數。
  //這裡的 \D 代表非數字字元；如果所有的字元都不是非數字，那就是只有整數，那就抓出來做複數擲骰。
  //如果不是只有整數，就丟進去DiceCal裡面算算看。
  if(mutiOrNot.toString().match(/\D/)==null )  {
    finalStr= '複數擲骰：'
    if(mutiOrNot>20) return '不支援20次以上的複數擲骰。';

  //把第二部份分拆出來，丟進去待會要介紹的擲骰計算函數當中
  let DiceToRoll = inputStr.toLowerCase().split(' ',2)[1];
  if (DiceToRoll.match('d') == null) return undefined;

    for (i=1 ; i<=mutiOrNot ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal(DiceToRoll).eqStr;
    }
    //報錯，不解釋。
    if(finalStr.match('200D')!= null) finalStr = '複數擲骰：\n指揮官 用腦袋好好想一想 什麼時候會要骰超過200顆以上';
    if(finalStr.match('D500')!= null) finalStr = '複數擲骰：\n指揮官，這裡不支援D1和超過D500的擲骰';

  }

  //走到這邊，表示可能是單次擲骰，丟進去DiceCal裡面算算看。
  else
  {
    //丟進去前檢查，第一部分是檢查如果沒有任何一部份符合骰子格式就回報undefined
    //第二部份是 d 的前後有非數字
    //第三部份是檢查是否有數字或運算符之外的字元
    if (mutiOrNot.toString().match(/\d+d\d+/) == null||
        mutiOrNot.toString().match(/\Dd|d\D/) != null||
        mutiOrNot.toString().match(/[^0-9dD+\-*\/()]/) != null)
        return undefined;

    finalStr= '基本擲骰：\n' + DiceCal(mutiOrNot.toString()).eqStr;
  }

  if (finalStr.match('NaN')!= null||finalStr.match('undefined')!= null) return undefined;
  return finalStr;
}


//這就是作計算的函數，負責把骰子算出來。
function DiceCal(inputStr){

  //首先判斷是否是誤啟動（檢查是否有符合骰子格式）
  //你可能會想說上面不是檢查過了，但是因為在別的地方還機會呼叫所以不能省
  if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;

  //排除小數點
  if (inputStr.toString().match(/\./)!=null)return undefined;

  //一樣先定義要輸出的Str
  let equationStr = '' ;

  //一般單次擲骰，先把字串讀進來轉小寫
  let DiceToRoll = inputStr.toString().toLowerCase();

  //再檢查一次
  if (DiceToRoll.match(/\d+d\d+/) == null||
      DiceToRoll.match(/\Dd|d\D/) != null||
      DiceToRoll.match(/[^0-9dD+\-*\/()]/) != null)
      return undefined;

  //寫出算式，這裡使用while將所有「幾d幾」的骰子找出來，一個一個帶入RollDice並取代原有的部分
  while(DiceToRoll.match(/\d+d\d+/)!=null) {
    let tempMatch = DiceToRoll.match(/\d+d\d+/);
    if (tempMatch.toString().split('d')[0]>200) return {eqStr :'指揮官 用腦袋好好想一想 什麼時候會要骰超過200顆以上'};
    if (tempMatch.toString().split('d')[1]==1 || tempMatch.toString().split('d')[1]>500) return {eqStr :'指揮官，這裡不支援D1和超過D500的擲骰'};
    DiceToRoll = DiceToRoll.replace(/\d+d\d+/, RollDice(tempMatch));
  }

  //計算算式
  let answer = eval(DiceToRoll.toString());
  equationStr= DiceToRoll + ' = ' + answer;


  //在這裡設定兩個子參數，eq是只有算式，eqStr是把算式加總。
  //在不同情形下可能會有不同應用，所以拆開來，這樣可以少寫一個函數。
  let Final ={
  eq : DiceToRoll.toString(),
  eqStr : equationStr
  }

  return Final;


}

//用來把d給展開成算式的函數
function RollDice(inputStr){
  //先把inputStr變成字串（不知道為什麼非這樣不可）
  let comStr=inputStr.toString().toLowerCase();

  //若是要把 3d6 變成 (2+1+4) ，那就先要有個 (
  let finalStr = '(';

  //接下來就是看有幾d幾，就要骰幾次骰，像是 3d6 就要做 3 次 Dice(6)，還要補上加號
  for (let i = 1; i <= comStr.split('d')[0]; i++) {
    finalStr = finalStr + Dice(comStr.split('d')[1]) + '+';
  }

  //那這樣會多一個+號，所以要去掉，再補上 ) ，這樣就完成了。
  finalStr = finalStr.substring(0, finalStr.length - 1) + ')';
  return finalStr;
}


//PBTA判定在這裡
function pbta(inputStr){

  //先把句首前面的一段拆出來，我不知道為什麼如果用 \S+ 會報錯，多半是變數種類的問題但我不太懂。
  let input = inputStr.toLowerCase().split(' ',2)[0];

  //同樣先處理報錯，先確定pb後面只有加或減
  if(input.match(/^pb[^+\-]/) != null||
     input.match(/[^0-9pb+\-]/) != null)
  return undefined;

  //把pb去掉，留下後面的+-值，處理報錯
  bonus = input.replace('pb','') ;
  if ( bonus != '' && bonus.match(/-\d|\+\d/) == null) return undefined;

  //開始算咯，你看我們用到DiceCal.eq了吧
  let CalStr = DiceCal('2d6'+ bonus).eq;

    if (eval(CalStr.toString()) >= 10){
      return 'pbta擲骰：\n' + CalStr + '=' + eval(CalStr.toString()) + '，成功！';
      }
    else if (eval(CalStr.toString()) <= 6){
      return 'pbta擲骰：\n' + CalStr + '=' + eval(CalStr.toString()) + '，失敗。';
      }
    else {
      return 'pbta擲骰：\n' + CalStr + '=' + eval(CalStr.toString()) + '，部分成功。';
      }


}

function ccCreate(inputStr){
  //大致上的精神是，後面有數字就當作是有年齡調整的傳統創角，沒有的話就是常見的房規創角
  //如果最後面不是數字，就當作是常見的房規創角
  if (inputStr.toLowerCase().match(/\d+$/)==null){
    let finalStr = '《悠子、冷嵐房規創角擲骰》\n==\n骰七次3D6取五次，\n決定STR、CON、DEX、APP、POW。\n';

    //DiceCal又被拿出來用了
    for (i=1 ; i<=7 ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal('3d6*5').eqStr;
    }

    finalStr = finalStr +'\n==\n骰四次2D6+6取三次，\n決定SIZ、INT、EDU。\n';

    for (i=1 ; i<=4 ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal('(2d6+6)*5').eqStr;
    }

    finalStr = finalStr +'\n==\n骰兩次3D6取一次，\n決定LUK。\n';
    for (i=1 ; i<=2 ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal('3d6*5').eqStr;
    }

    return finalStr;
  }

  //這是傳統創角，要抓年齡出來做年齡調整值的
  if (inputStr.toLowerCase().match(/\d+$/)!=null){

    //讀取年齡

    let old = inputStr.toLowerCase().match(/\d+$/);


    let ReStr = '《CoC7版核心規則創角擲骰》\n調查員年齡設為：' + old + '\n';
    if (old < 15) return ReStr + '指揮官，核心規則不允許小於15歲的人物哦。';
    if (old >= 90) return ReStr + '指揮官，核心規則不允許90歲以上的人物哦。';


    //設定 因年齡減少的點數 和 EDU加骰次數，預設為零
    let AdjustValue = {
      Debuff : 0,
      AppDebuff : 0,
      EDUinc : 0
    }

    //這裡是不同年齡的資料
    let AdjustData = {
      old : [15,20,40,50,60,70,80],
      Debuff : [5,0,5,10,20,40,80],
      AppDebuff : [0,0,5,10,15,20,25],
      EDUinc : [0,1,2,3,4,4,4]
    }

    for ( i=0 ; old >= AdjustData.old[i] ; i ++){

      AdjustValue.Debuff = AdjustData.Debuff[i];
      AdjustValue.AppDebuff = AdjustData.AppDebuff[i];
      AdjustValue.EDUinc = AdjustData.EDUinc[i];

    }

    ReStr = ReStr + '==\n年齡調整：';

    if (old < 20) {
      ReStr = ReStr + '從STR、SIZ擇一減去' + AdjustValue.Debuff + '點\n（請自行手動選擇計算）。\n將EDU減去5點。LUK可擲兩次取高。' ;
    }
    else if (old >= 40) {
      ReStr = ReStr + '從STR、CON或DEX中「總共」減去' + AdjustValue.Debuff + '點\n（請自行手動選擇計算）。\n將APP減去' + AdjustValue.AppDebuff +'點。可做' + AdjustValue.EDUinc + '次EDU的成長擲骰。' ;
    }
    else {
      ReStr = ReStr + '可做' + AdjustValue.EDUinc + '次EDU的成長擲骰。' ;
    }

    ReStr = ReStr + '\n==';

    if (old>=40) ReStr = ReStr + '\n（以下箭號三項，自選共減' + AdjustValue.Debuff + '點。）' ;
    if (old<20) ReStr = ReStr + '\n（以下箭號兩項，擇一減去' + AdjustValue.Debuff + '點。）' ;
    ReStr = ReStr + '\nＳＴＲ：' + DiceCal('3d6*5').eqStr;
    if (old>=40) ReStr = ReStr + ' ← 共減' + AdjustValue.Debuff ;
    if (old<20) ReStr = ReStr + ' ←擇一減' + AdjustValue.Debuff ;
    ReStr = ReStr + '\nＣＯＮ：' + DiceCal('3d6*5').eqStr;
    if (old>=40) ReStr = ReStr + ' ← 共減' + AdjustValue.Debuff;
    ReStr = ReStr + '\nＤＥＸ：' + DiceCal('3d6*5').eqStr;
    if (old>=40) ReStr = ReStr + ' ← 共減' + AdjustValue.Debuff ;
    if (old>=40) ReStr = ReStr + '\nＡＰＰ：' + DiceCal('3d6*5-' + AdjustValue.AppDebuff).eqStr;
    else ReStr = ReStr + '\nＡＰＰ：' + DiceCal('3d6*5').eqStr;
    ReStr = ReStr + '\nＰＯＷ：' + DiceCal('3d6*5').eqStr;
    ReStr = ReStr + '\nＳＩＺ：' + DiceCal('(2d6+6)*5').eqStr;
    if (old<20) ReStr = ReStr + ' ←擇一減' + AdjustValue.Debuff ;
    ReStr = ReStr + '\nＩＮＴ：' + DiceCal('(2d6+6)*5').eqStr;
    if (old<20) ReStr = ReStr + '\nＥＤＵ：' + DiceCal('(2d6+6)*5-5').eqStr;
    else {
      ReStr = ReStr + '\n==';

      let firstEDU = DiceCal('(2d6+6)*5').eq;
      let tempEDU = eval(firstEDU);

      ReStr = ReStr + '\nＥＤＵ初始值：' + firstEDU + ' = ' + tempEDU;

      for (i = 1 ; i <= AdjustValue.EDUinc ; i++){
        let EDURoll = Dice(100);
        ReStr = ReStr + '\n第' + i + '次EDU成長 → ' + EDURoll;


        if (EDURoll>tempEDU) {
          let EDUplus = Dice(10);
          ReStr = ReStr + ' → 成長' + EDUplus +'點';
          tempEDU = tempEDU + EDUplus;
        }
        else{
          ReStr = ReStr + ' → 沒有成長';
        }
      }
      ReStr = ReStr + '\n';
      ReStr = ReStr + '\nＥＤＵ最終值：' +tempEDU;
    }
    ReStr = ReStr + '\n==';

    ReStr = ReStr + '\nＬＵＫ：' + DiceCal('3d6*5').eqStr;
    if (old<20) ReStr = ReStr + '\nＬＵＫ加骰：' + DiceCal('3D6*5').eqStr;


    return ReStr;
  }

}

function ccbg(){

  let bg = {
    //基本描述
    //PersonalDescription
    PD :['結實的', '英俊的', '粗鄙的', '機靈的', '迷人的', '娃娃臉的', '聰明的', '蓬頭垢面的', '愚鈍的', '骯髒的', '耀眼的', '有書卷氣的','青春洋溢的','感覺疲憊的','豐滿的','粗壯的','毛髮茂盛的','苗條的','優雅的','邋遢的','敦實的','蒼白的','陰沉的','平庸的','臉色紅潤的','皮膚黝黑色','滿臉皺紋的','古板的','有狐臭的','狡猾的','健壯的','嬌俏的','筋肉發達的','魁梧的','遲鈍的', '虛弱的'],

    //信念
    //IdeologyBeliefs
    IB :['虔誠信仰著某個神祈','覺得人類不需要依靠宗教也可以好好生活','覺得科學可以解釋所有事，並對某種科學領域有獨特的興趣','相信因果循環與命運','是一個政黨、社群或秘密結社的成員','覺得這個社會已經病了，而其中某些病灶需要被剷除','是神秘學的信徒','是積極參與政治的人，有特定的政治立場','覺得金錢至上，且為了金錢不擇手段','是一個激進主義分子，活躍於社會運動'],

    //重要之人
    //SignificantPeople
    SP :['他的父母', '他的祖父母', '他的兄弟姐妹', '他的孩子', '他的另一半', '那位曾經教導調查員最擅長的技能（點數最高的職業技能）的人','他的兒時好友', '他心目中的偶像或是英雄', '在遊戲中的另一位調查員', '一個由KP指定的NPC'],

    //這個人為什麼重要
    //SignificantPeopleWhy
    SPW :['調查員在某種程度上受了他的幫助，欠了人情','調查員從他那裡學到了些什麼重要的東西','他給了調查員生活的意義','調查員曾經傷害過他，尋求他的原諒','和他曾有過無可磨滅的經驗與回憶','調查員想要對他證明自己','調查員崇拜著他','調查員對他有著某些使調查員後悔的過往','調查員試圖證明自己和他不同，比他更出色','他讓調查員的人生變得亂七八糟，因此調查員試圖復仇'],

    //意義非凡之地
    //MeaningfulLocations
    ML :['過去就讀的學校','他的故鄉','與他的初戀之人相遇之處','某個可以安靜沉思的地方','某個類似酒吧或是熟人的家那樣的社交場所','與他的信念息息相關的地方','埋葬著某個對調查員別具意義的人的墓地','他從小長大的那個家','他生命中最快樂時的所在','他的工作場所'],

    //寶貴之物
    //TreasuredPossessions
    TP :['一個與他最擅長的技能（點數最高的職業技能）相關的物品','一件他的在工作上需要用到的必需品','一個從他童年時就保存至今的寶物','一樣由調查員最重要的人給予他的物品','一件調查員珍視的蒐藏品','一件調查員無意間發現，但不知道到底是什麼的東西，調查員正努力尋找答案','某種體育用品','一把特別的武器','他的寵物'],

    //特徵
    //Traits
    T :['慷慨大方的人','對動物很友善的人','善於夢想的人','享樂主義者','甘冒風險的賭徒或冒險者', '善於料理的人', '萬人迷','忠心耿耿的人','有好名聲的人','充滿野心的人']

  }


  return 'CoC7th背景描述生成器\n（僅供娛樂用，不具實際參考價值）\n==\n調查員是一個' + bg.PD[Dice(bg.PD.length)-1] + '人。\n【信念】：說到這個人，他' + bg.IB[Dice(bg.IB.length)-1] + '。\n【重要之人】：對他來說，最重要的人是' + bg.SP[Dice(bg.SP.length )-1] + '，這個人對他來說之所以重要，是因為' + bg.SPW[Dice(bg.SPW.length )-1] + '。\n【意義非凡之地】：對他而言，最重要的地點是' + bg.ML[Dice(bg.ML.length )-1] + '。\n【寶貴之物】：他最寶貴的東西就是'+ bg.TP[Dice(bg.TP.length )-1] + '。\n【特徵】：總括來說，調查員是一個' + bg.T[Dice(bg.T.length)-1] + '。';

}


//這裡是cc指令，也就是CoC的主要擲骰控制位置。
//這邊的程式碼沒有那麼複雜，所以應該不會講得那麼詳細，可以自己慢慢研究，不難懂的。
function CoC7th(rplyToken, inputStr){

  //先判斷是不是要創角
  if (inputStr.toLowerCase().match('創角') != null||inputStr.toLowerCase().match('crt') != null)
    return ccCreate(inputStr);

  //隨機產生角色背景
  if (inputStr.toLowerCase().match('bg') != null) return ccbg();

  //接下來就是主要的擲骰部分啦！
  //如果不是正確的格式，直接跳出
  if(inputStr.match('<=') == null && inputStr.match('cc>') == null ) return undefined;

  //記錄檢定要求值，簡單來說就是取 = 後的「整數」部分，parseInt就是強制取整
  let chack = parseInt(inputStr.split('=',2)[1]) ;

  //設定回傳訊息
  let ReStr = 'CoC7th擲骰：\n(1D100<=' + chack + ') → ';

  //先骰兩次十面骰作為起始值。為什麼要這樣呢，因為獎懲骰的部分十面骰需要重骰，這樣到時候會簡單一點。
  let TenRoll = Dice(10) ;
  let OneRoll = Dice(10) - 1;

  //把剛剛的十面骰組合成百面
  let firstRoll = TenRoll*10 + OneRoll;
  if (firstRoll > 100) firstRoll = firstRoll - 100;


  //先設定最終結果等於第一次擲骰
  let finalRoll = firstRoll;


  //判斷是否為成長骰
  if(inputStr.match(/^cc>\d+/)!=null){
    chack = parseInt(inputStr.split('>',2)[1]) ;
    if (finalRoll>chack||finalRoll>95) {
      let plus =  Dice(10);
      ReStr = 'CoC7th擲骰【技能成長】：\n(1D100>' + chack + ') → ' + finalRoll + ' → 成功成長' + plus +'點\n最終值為：'+ chack + '+' + plus +'='+ (chack + plus);
      return ReStr;
    }
    else if (finalRoll<=chack) {
      ReStr = 'CoC7th擲骰【技能成長】：\n(1D100>' + chack + ') → ' + finalRoll + ' → 沒有成長';
      return ReStr;
    }
    else return undefined;
  }


  //判斷是否為獎懲骰
  let BPDice = null;

  //if(inputStr.match(/^cc\(-?[12]\)/)!=null) BPDice = parseInt(inputStr.split('(',2)[1]) ;
  if(inputStr.match(/^cc\(-?\d+\)/)!=null) BPDice = parseInt(inputStr.split('(',2)[1]);

  if(Math.abs(BPDice) != 1 && Math.abs(BPDice) != 2 && BPDice != null) return 'CoC7th的獎懲骰，允許的範圍是一到兩顆哦。';

  //如果是獎勵骰
  if(BPDice != null){
    let tempStr = firstRoll;
    for (let i = 1; i <= Math.abs(BPDice); i++ ){
      let OtherTenRoll = Dice(10);
      let OtherRoll = OtherTenRoll.toString() + OneRoll.toString();

      if (OtherRoll > 100) OtherRoll = parseInt(OtherRoll) - 100;

      tempStr = tempStr + '、' + OtherRoll;
    }
    let countArr = tempStr.split('、');
    if (BPDice>0) finalRoll = Math.min(...countArr),ReStr = 'CoC7th擲骰【獎勵骰取低】：\n(1D100<=' + chack + ') → ';
    if (BPDice<0) finalRoll = Math.max(...countArr),ReStr = 'CoC7th擲骰【懲罰骰取高】：\n(1D100<=' + chack + ') → ';

    ReStr = ReStr + tempStr + ' \n→ ';
  }

          //結果判定
          if (finalRoll == 1) ReStr = ReStr + finalRoll + ' → 才不是為了指揮官幫你骰大成功呢....哼';
          else
            if (finalRoll == 100) ReStr = ReStr + finalRoll + ' → 我本人都親自幫你骰了 大失敗?! 那種結果就別在意';
          else
            if (finalRoll <= 99 && finalRoll > 95 && chack < 50) ReStr = ReStr + finalRoll + ' → 我本人都親自幫你骰了 大失敗?! 那種結果就別在意';
          else
            if (finalRoll <= chack/5) ReStr = ReStr + finalRoll + ' → 極限成功';
          else
            if (finalRoll <= chack/2) ReStr = ReStr + finalRoll + ' → 困難成功';
          else
            if (finalRoll <= chack) ReStr = ReStr + finalRoll + ' → 通常成功';
          else
            if (finalRoll == 87) ReStr = ReStr + finalRoll + ' → 骰出這個可不是在暗示指揮官呢';
          else  ReStr = ReStr + finalRoll + ' → 失敗' ;

          //浮動大失敗運算
          if (finalRoll <= 99 && finalRoll > 95 && chack >= 50 ){
            if(chack/2 < 50) ReStr = ReStr + '\n（若要求困難成功則為大失敗）';
            else
              if(chack/5 < 50) ReStr = ReStr + '\n（若要求極限成功則為大失敗）';
          }


	//這是在骰出大成功或大失敗時附加圖片的程式碼，可以自己研究；不想要的話整個刪掉也不影響
	if (ReStr.match('我本人都親自幫你骰了 大失敗?! 那種結果就別在意')!= null){
	let fumbleImg = fumbleImgArr[Dice(fumbleImgArr.length)-1];
	let fumble = [
			{
			type: "text",
			text: ReStr
			},
			{
			type: "image",
			originalContentUrl: fumbleImg,
			previewImageUrl: fumbleImg
			}
		]
		SendMsg(rplyToken, fumble);
		return undefined;
	}

	if (ReStr.match('才不是為了指揮官幫你骰大成功呢....哼')!= null){
	let CriImg = CriImgArr[Dice(CriImgArr.length)-1];
	let Cri = [
			{
			type: "text",
			text: ReStr
			},
			{
			type: "image",
			originalContentUrl: CriImg,
			previewImageUrl: CriImg
			}
		]
		SendMsg(rplyToken, Cri);
		return undefined;
	}

          return ReStr;
}

function Byakhee(inputStr){
    let finalStr = '拜亞基能力值\n';
    let pow = DiceCal('3d6').eqStr;


    finalStr = finalStr +'\n' +  'STR:' + DiceCal('5d6').eqStr;
    finalStr = finalStr +'\n' +  'CON:' + DiceCal('3d6').eqStr;
    finalStr = finalStr +'\n' +  'SIZ:' + DiceCal('5d6').eqStr;
    finalStr = finalStr +'\n' +  'INT:' + DiceCal('3d6').eqStr;
    finalStr = finalStr +'\n' +  'POW:' + pow;
    finalStr = finalStr +'\n' +  'DEX:' + DiceCal('3d6+3').eqStr;
    finalStr = finalStr +'\nDEF:2';
    finalStr = finalStr +'\n 武器：\n 鉤爪（35%）1D6+DB \n 二次攻擊\n 噬咬（35%）1D6 \n 吸血 1D6力量／輪\n';
    finalStr = finalStr +'\n 若POW>=14 會' + DiceCal('1d4').eqStr + '種咒文';



    return finalStr;
  }

function DarkYoung(inputStr){
    let finalStr = '黑山羊幼仔能力值\n';


    finalStr = finalStr +'\n' +  'STR:' + DiceCal('4d3+30').eqStr;
    finalStr = finalStr +'\n' +  'CON:' + DiceCal('3d6+6').eqStr;
    finalStr = finalStr +'\n' +  'SIZ:' + DiceCal('4d6+30').eqStr;
    finalStr = finalStr +'\n' +  'INT:' + DiceCal('4d6').eqStr;
    finalStr = finalStr +'\n' +  'POW:' + DiceCal('5d6').eqStr;
    finalStr = finalStr +'\n' +  'DEX:' + DiceCal('3d6+6').eqStr;
    finalStr = finalStr +'\n 武器：\n  觸肢80% (DB，力量值吸取) (每轮1d3) \n  踐踏40% (2d6+DB)';
    finalStr = finalStr +'\n 黑山羊幼仔可使用的為INT的一半(小數點無條件進位)';



    return finalStr;
  }

function Shambler(inputStr){
    let finalStr = '空鬼能力值\n';

    finalStr = finalStr +'\n' +  'STR:' + DiceCal('2d6+12').eqStr;
    finalStr = finalStr +'\n' +  'CON:' + DiceCal('3d6+6').eqStr;
    finalStr = finalStr +'\n' +  'SIZ:' + DiceCal('2d6+12').eqStr;
    finalStr = finalStr +'\n' +  'INT:' + DiceCal('2d6').eqStr;
    finalStr = finalStr +'\n' +  'POW:' + DiceCal('3d6').eqStr;
    finalStr = finalStr +'\n' +  'DEX:' + DiceCal('3d6').eqStr;
    finalStr = finalStr +'\n DEF:3';
    finalStr = finalStr +'\n 武器：\n   鉤爪30% (1d8+DB)';
    finalStr = finalStr +'\n INT高於9 每高1點會多隻小1種咒文';



    return finalStr;
  }


function SendImg(rplyToken, inputStr) {
     let message = [
  {
	  message = {
	  "type": "video",
	  "originalContentUrl": "https://youtu.be/VruZ9sMl4Gc",
  }
  },
  {
    chack: ['我什麼都沒有'],
    img: ['https://i.imgur.com/k4QE5Py.png']
    //Pimg: ['https://i.imgur.com/k4QE5Py.png']
  },
  {
    chack: ['大家的小三','大家的小3'],
    img: ['https://i.imgur.com/dKW2EJb.png']
    //Pimg: ['https://i.imgur.com/dKW2EJb.png']
  },
  {
    chack: ['問號黑人','黑人問號','尼哥問號','問號尼哥','尼格問號','問號尼格'],
    img: ['https://i.imgur.com/cUR20OZ.png']
  },
  {
    chack: ['貴圈真亂'],
    img: ['https://i.imgur.com/PalRocR.png']
  },
  {
    chack: ['怕'],
    img: ['https://i.imgur.com/qXGsztE.png']
  },
  {
    chack: ['你要享受這個過程','妳要享受這個過程'],
    img: ['https://i.imgur.com/mt7NVzr.png','https://i.imgur.com/v094wOd.png','https://i.imgur.com/F5RfDW2.png','https://i.imgur.com/jWm6f6z.png']
  },
  {
    chack: ['我覺得不行'],
    img: ['https://i.imgur.com/zXvsvJf.png','https://i.imgur.com/U1AK4kL.png','https://i.imgur.com/4TClOgY.png']
  },
  {
    chack: ['我覺得可以','我覺得其實可以'],
    img: ['https://i.imgur.com/K5WsXso.png']
  },
  {
    chack: ['警察','就是這個人'],
    img: ['https://i.imgur.com/7BTPpPQ.png','https://i.imgur.com/nweWacp.png','https://i.imgur.com/j0hIscH.png','https://i.imgur.com/9BDCkJr.png','https://i.imgur.com/2ZiVw9g.png']
  },
  {
    chack: ['姆米','姆咪','母米'],
    img: ['https://i.imgur.com/j7bMpAO.png','https://i.imgur.com/0AatpWN.png','https://i.imgur.com/S69OoYS.png','https://i.imgur.com/kEGB0Vj.png']
  },
  {
    chack: ['take my money','shut up and'],
    img: ['https://i.imgur.com/UX0OUc0.png']
  },
  {
    chack: ['接受挑戰','challenge'],
    img: ['https://i.imgur.com/uUwcxtj.png']
  },
  {
    chack: ['成龍'],
    img: ['https://i.imgur.com/cq0WGxH.png']
  },
  {
    chack: ['true story','真實故事'],
    img: ['https://i.imgur.com/88MiBLA.png']
  },
  {
    chack: ['一槍'],
    img: ['https://i.imgur.com/FnmSMWq.png']
  }


  ]
  
  for ( i=0 ; i < message.length ; i ++){
    for ( j=0 ; j < message[i].chack.length ; j ++){
      if (inputStr.toLowerCase().match(message[i].chack[j]) != null) {
	 let tempImgUrl = message[i].img[Dice(message[i].img.length)-1];
         let rplyVal = [
           {
            type: "image", 
            originalContentUrl: tempImgUrl, 
            previewImageUrl: tempImgUrl
           }
         ]
         SendMsg(rplyToken, rplyVal);
         return undefined;
      }
    }
    
  }

  return undefined;
}



function YabasoReply(inputStr) {

  //選擇障礙
  if(inputStr.match('選') != null||inputStr.match('決定') != null||inputStr.match('挑') != null) {
    let rplyArr = inputStr.split(' ');

    if (rplyArr.length <= 2)
	    return '指揮官連格式都打不好嗎，你還是去死吧';

    let Answer = rplyArr[Dice(rplyArr.length)-1];
	let temp;
    if(Answer.match('選') != null||Answer.match('決定') != null||Answer.match('挑') != null||Answer.match('WA2000') != null) {
   
    
    temp = rplyArr[Dice(rplyArr.length)-1];
	    
	    while(temp.match('WA2000') != null || temp.match('選') != null || temp.match('挑') != null || temp.match('決定') != null){
		    temp = rplyArr[Dice(rplyArr.length)-1];
	    }
	Answer = temp;    
    }
    return '我想想喔……我覺得，' + Answer + '。';
  }


  //以下是運勢功能
  if(inputStr.match('運勢') != null){
    let rplyArr=['超大吉',
		 '大吉','大吉','大吉','大吉','大吉',
		 '中吉','中吉','中吉','中吉','中吉','中吉','中吉','中吉','中吉','中吉','中吉',
		 '小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉','小吉',
		 '末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉','末吉',
		 '凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶','凶',
		 '大凶','大凶','大凶','大凶','大凶','大凶','大凶','大凶','大凶','大凶','大凶','大凶',
		 '你還是，不要知道比較好',
		 '這應該不關我的事','這應該不關我的事','這應該不關我的事','這應該不關我的事','這應該不關我的事'];
	  
    return '今天指揮官的運勢應該是......，' + rplyArr[Dice(rplyArr.length)-1] + '吧。';
  }
 /*  
  if(inputStr.match('猜拳') != null){
	  actions.Add(new isRock.LineBot.MessageActon()
		      { label = "剪刀", text = "剪刀" });

	  actions.Add(new isRock.LineBot.MessageActon()
		      { label = "石頭", text = "石頭" });

          actions.Add(new isRock.LineBot.MessageActon()
		      { label = "布", text = "布" });
	  
	  let rplyArr = ['剪刀' , '石頭' , '布'];
	  
	  if(inputStr.match('剪刀') != null){
		  let temp;
		  
		  temp = rplyArr[Dice(rplyArr.length)-1];
		  
		  if(temp == ('剪刀'))
			  return '剪刀\n' + '居然平手嗎... 下次我會贏指揮官的';
		  
	          if(temp == ('石頭'))
			  return '石頭\n' + '看來指揮官也不過如此嗎 哼哼';
		  
		  if(temp == ('布'))
			  return '布\n'  + '哼 這次只是讓指揮官贏的';	  
	  
	  }

  
	  
	  }	  

	  if(inputStr.match('布') != null){
		  let temp;
		  
		  temp = rplyArr[Dice(rplyArr.length)-1];
		  
		  if(temp == ('布'))
			  return '布\n' + '居然平手嗎... 下次我會贏指揮官的';
		  
	          if(temp == ('剪刀'))
			  return '剪刀\n' + '看來指揮官也不過如此嗎 哼哼';
		  
		  if(temp == ('石頭'))
			  return '石頭\n'  + '哼 這次只是讓指揮官贏的';	  
	  
	  }	  
	  
  }
*/

  //沒有觸發關鍵字則是這個
  else{
    let rplyArr = [];
    return rplyArr[Dice(rplyArr.length)-1];
  }

}
