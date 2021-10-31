export default class VoiceListener {
  constructor(settings) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    this.cheerings = settings.cheeringPhrases.filter((v, i, a) => a.indexOf(v) === i).map((c) => c.toLowerCase())

    this.settings = settings
    this.currentResultIndex = 0
    this.currentResultHitsCounts = {}
    this.fullSpeech = ''
    this.speechStarted = false

    this.setCurrentResultHitsCountsToDefault()

    var speechRecognitionList = new SpeechGrammarList();
    const grammar = '#JSGF V1.0; grammar phrase; public <cheering> = '+ this.cheerings.join(' | ') +';';
    speechRecognitionList.addFromString(grammar, 1);

    this.recognition = new SpeechRecognition();
    this.recognition.grammars = speechRecognitionList;
    this.recognition.lang = 'ru-RU';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.diagnosticPara = document.querySelector('.output');

    this.recognition.onresult = this.onResult.bind(this)
    this.recognition.onerror = this.onError.bind(this)
    this.recognition.onsoundstart = () => console.log('START')
    this.recognition.onsoundend = () => console.log('END')

    // this.recognition.onTap = this.settings.onTap.bind(this)
    // this.recognition.onspeechend = this.onSpeechEnd.bind(this)
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
    this.recognition.stop();
    this.diagnosticPara.textContent = 'Распознавание речи отключено!'
  }

  onError(event) {
    let errorText
    switch(event.error) {
      case 'not-allowed':
        errorText = 'Пожалуйста разреши доступ к микрофону'
        break

      case 'no-speech':
        errorText = 'Пожалуйста говори после нажатия на кнопку'
        break

      default:
        errorText = event.error
    }

    this.diagnosticPara.textContent = 'Ошибка: ' + errorText;

    this.settings.onError(errorText)
  }

  onResult(event) {
    const curResult = event.results[this.currentResultIndex]
    const result = curResult[0].transcript.toLowerCase()
    const newTotalHits = this.newTotalHitsCounts(result)
    const currentHits = {}

    this.cheerings.forEach((c) => {
      const newCount = newTotalHits[c]
      const oldCount = this.currentResultHitsCounts[c]

      if (newCount > oldCount) {
        currentHits[c] = newCount - oldCount
        this.currentResultHitsCounts[c] = newCount
      }
    })

    this.diagnosticPara.textContent = 'Получена речь: ' + this.fullSpeech + ' ' + result

    if (curResult.isFinal) {
      this.currentResultIndex +=1
      this.setCurrentResultHitsCountsToDefault()
      this.fullSpeech = this.fullSpeech + ' ' + result

      this.onSpeechEnd(currentHits)
    } else if (Object.keys(currentHits).length !== 0) {
      this.onSpeechEnd(currentHits)
    }

    // if (!this.speechStarted) this.onSpeechStart(currentHits)

    this.settings.onResult(currentHits)
  }

  onSpeechStart(currentHits) {
    this.speechStarted = true
    this.settings.onSpeechStart(currentHits)
  }

  onSpeechEnd(currentHits) {
    this.speechStarted = false
    this.settings.onSpeechEnd(currentHits)
  }

  newTotalHitsCounts(result) {
    const counts = {}
    this.cheerings.forEach((c) => {
      const reg = new RegExp(c, 'g');
      const count = (result.match(reg) || []).length

      counts[c] = count
    })

    return counts
  }

  setCurrentResultHitsCountsToDefault() {
    this.cheerings.forEach((c) => this.currentResultHitsCounts[c] = 0 )
  }
}
