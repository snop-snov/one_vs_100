export default class VoiceListener {
  constructor(settings) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' +';';
    this.recognition = new SpeechRecognition();
    this.speechRecognitionList = new SpeechGrammarList();
    this.speechRecognitionList.addFromString(grammar, 1);
    this.recognition.grammars = this.speechRecognitionList;
    this.recognition.lang = 'ru-RU';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.diagnosticPara = document.querySelector('.output');

    // this.recognition.onTap = this.settings.onTap.bind(this)
    // this.recognition.onresult = this.settings.onresult.bind(this)
    // this.recognition.onspeechend = this.settings.onspeechend.bind(this)
    this.recognition.onerror = this.onError.bind(this)
    // this.recognition.onaudiostart = this.settings.onaudiostart.bind(this)
    // this.recognition.onaudioend = this.settings.onaudioend.bind(this)
    // this.recognition.onend = this.settings.onend.bind(this)
    // this.recognition.onnomatch = this.settings.onnomatch.bind(this)
    // this.recognition.onsoundstart = this.settings.onsoundstart.bind(this)
    // this.recognition.onsoundend = this.settings.onsoundend.bind(this)
    // this.recognition.onspeechstart = this.settings.onspeechstart.bind(this)
    // this.recognition.onstart = this.settings.onstart.bind(this)
  }

  startListen() {
    this.recognition.start();
  }

  stopListen() {
    this.recognition.start();
  }

  onError(event) {
    const errorText = event.error === 'not-allowed' ? 'Пожалуйста разрешите доступ к микрофону в вашем браузере. Мы не будем никуда отправлять то, что услышим :)' : event.error
    this.diagnosticPara.textContent = 'Ошибка: ' + errorText;
  }
}




const handleOnLoad = function() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  var phrases = [
    'I love to sing because it\'s fun',
    'where are you going',
    'can I call you tomorrow',
    'why did you talk while I was talking',
    'she enjoys reading books and playing games',
    'where are you going',
    'have a great day',
    'she sells seashells on the seashore'
  ];

  var phrasePara = document.querySelector('.phrase');
  // var resultPara = document.querySelector('.result');
  var diagnosticPara = document.querySelector('.output');

  var testBtn = document.querySelector('button');

  function randomPhrase() {
    var number = Math.floor(Math.random() * phrases.length);
    return number;
  }

  function testSpeech() {
    testBtn.disabled = true;
    testBtn.textContent = 'Test in progress';

    var phrase = phrases[randomPhrase()];
    // To ensure case consistency while checking with the returned output text
    phrase = phrase.toLowerCase();
    // phrasePara.textContent = phrase;
    // resultPara.textContent = 'Your speech';
    // resultPara.style.background = 'rgba(0,0,0,0.2)';
    diagnosticPara.textContent = '...отладочная информация';

    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at position 0.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object
      var speechResult = event.results[0][0].transcript.toLowerCase();
      diagnosticPara.textContent = 'Получена речь: ' + speechResult + '.';
      // if(speechResult === phrase) {
      //   resultPara.textContent = 'I heard the correct phrase!';
      //   resultPara.style.background = 'lime';
      // } else {
      //   resultPara.textContent = 'That didn\'t sound right.';
      //   resultPara.style.background = 'red';
      // }
      //
      // console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function() {
      recognition.stop();
      testBtn.disabled = false;
      testBtn.textContent = 'Начать новый тест';
    }

    recognition.onerror = function(event) {
      testBtn.disabled = false;
      testBtn.textContent = 'Начать тест речи';

      const errorText = event.error === 'not-allowed' ? 'Пожалуйста разрешите доступ к микрофону в вашем браузере. Мы не будем никуда отправлять то, что услышим :)' : event.error
      diagnosticPara.textContent = 'Ошибка: ' + errorText;
    }

    recognition.onaudiostart = function(event) {
        //Fired when the user agent has started to capture audio.
        console.log('SpeechRecognition.onaudiostart');
    }

    recognition.onaudioend = function(event) {
        //Fired when the user agent has finished capturing audio.
        console.log('SpeechRecognition.onaudioend');
    }

    recognition.onend = function(event) {
        //Fired when the speech recognition service has disconnected.
        console.log('SpeechRecognition.onend');
    }

    recognition.onnomatch = function(event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        console.log('SpeechRecognition.onnomatch');
    }

    recognition.onsoundstart = function(event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        console.log('SpeechRecognition.onsoundstart');
    }

    recognition.onsoundend = function(event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        console.log('SpeechRecognition.onsoundend');
    }

    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        console.log('SpeechRecognition.onspeechstart');
    }
    recognition.onstart = function(event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        console.log('SpeechRecognition.onstart');
    }
  }

  if (testBtn) testBtn.addEventListener('click', testSpeech);
}

document.addEventListener("turbolinks:load", handleOnLoad);
