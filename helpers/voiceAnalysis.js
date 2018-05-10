const router = require('express').Router();
const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
// var SoxCommand = require('sox-audio');
// var command = SoxCommand();

// sets up tone analyzer credentials
let toneAnalyzer = new ToneAnalyzerV3({
  username: '1813adc9-1239-402c-9adb-7c5bfdb95664',
  password: 'pOt86kbRyD6A',
  version: '2017-09-21'
});

router.post('/audio', function(req, res) {
  // Creates a client
  const client = new speech.SpeechClient();

  // configuration needed for sync speech recognize
  const filename = './assets/test.flac';
  const encoding = 'FLAC';
  const sampleRateHertz = 44100;
  const languageCode = 'en-US';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    enableAutomaticPunctuation: true
  };
  const audio = {
    content: fs.readFileSync(filename).toString('base64')
  };

  const request = {
    config: config,
    audio: audio
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      return response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    })
    .then(transcription => {
      //Set up tone analyzer params
      let params = {
        tone_input: { text: transcription },
        content_type: 'application/json'
      };

      //Do tone analysis
      toneAnalyzer.tone(params, function(error, response) {
        if (error) {
          console.log('error:', error);
        } else {
          res.status(201).send({
            transcription: transcription,
            analysis: JSON.stringify(response)
          });
        }
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});

//CONVERT TO FLAC FILE
// const convertAudio = inputStream => {
//   // use sox to convert blob of .wav files to .flac file

//   command
//     .input(inputStream)
//     .inputSampleRate(1600)
//     .inputEncoding('signed')
//     .inputBits(16)
//     .inputChannels(2)
//     .inputFileType('wav');

//   command
//     .output('./assets/converted.flac')
//     .outputSampleRate(44100)
//     .outputEncoding('FLAC')
//     .outputBits(16)
//     .outputChannels(1)
//     .outputFileType('flac');
//   command.on('prepare', function(args) {
//     console.log('Preparing sox command with args ' + args.join(' '));
//   });

//   command.on('start', function(commandLine) {
//     console.log('Spawned sox with command ' + commandLine);
//   });

//   command.on('progress', function(progress) {
//     console.log('Processing progress: ', progress);
//   });

//   command.on('error', function(err, stdout, stderr) {
//     console.log('Cannot process audio: ' + err.message);
//     console.log('Sox Command Stdout: ', stdout);
//     console.log('Sox Command Stderr: ', stderr);
//   });

//   command.on('end', function() {
//     console.log('Sox command succeeded!');
//   });

//   command.run();
// };

module.exports = router;
