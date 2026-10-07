/******************************************************************************/
/*** Initialise jspsych *******************************************************/
/******************************************************************************/

var jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData("csv");
  },
});

/******************************************************************************/
/*** Judgment trials **********************************************************/
/******************************************************************************/
//using the survey-text plugin, we can ask participants to provide a numerical score for each sentence.
var survey_text_judgment_trial = {
  type: jsPsychSurveyText,
  preamble:
    "<p style='text-align:left'>Give each sentence a numerical value.\
    This example sentence would receive a score of 100:</p>\
  <p><em>Who said my brother was kept tabs on by the FBI?</em></p>\
  <p style='text-align:left'>Now provide ratings for the sentences below.</p>",
  questions: [
    { prompt: "Where did Blake buy the hat?" },
    { prompt: "What did you claim that Blake bought?" },
    { prompt: "What did you make the claim that Blake bought?" },
    { prompt: "Did where Blake buy the hat?" },
  ],
};

/******************************************************************************/
/*** Instruction trials *******************************************************/
/******************************************************************************/

var consent_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Welcome to the experiment</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Experiments begin with an information sheet that explains to the participant\
  what they will be doing, how their data will be used, and how they will be remunerated.</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  This is a placeholder for that information, which is normally reviewed\
  as part of the ethical review process.</p>",
  choices: ["Yes, I consent to participate"]
};

//More html-button-response trials, just like the consent screen.
var instruction_screen_1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Instructions</h3> \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  In this experiment you will read English sentences, and determine if they sound\
  grammatical to you. By grammatical, we mean whether you think a native speaker of\
  English could say this sentence in a conversation. In other words, do you think it\
  would sound odd for your friends to say this to you, as if they don't speak English natively?</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  We are <b>not</b> concerned with whether the sentence would be graded highly\
  by a writing teacher: we do not care about points of style or clarity, and we do\
  not care about the grammar rules that you learned in school (who versus whom,\
  ending a sentence with a preposition, etc). Instead, we are interested in whether\
  these sentences could be said by a native speaker of English in normal daily speech.</p>",
  choices: ["Click to proceed to the next page"],
};

var instruction_screen_2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Instructions, continued</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  For each sentence, simply press the <b>y</b> key (for yes) if you think the sentence\
  could be spoken by a native speaker, or the <b>n</b> key (for no) if you think that\
  the sentence could not be spoken by a native speaker.</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Here are two examples: the first is a <b>no</b> for most speakers, and the\
  second is a <b>yes</b> for most speakers.</p>\
  <p> <span style='color:red'>The was insulted waitress frequently</span> <b>(no)</b></p>\
  <p> <span style='color:green'>This is a pen</span> <b>(yes)</b></p>",
  choices: ["Click when you are ready to begin"],
};

var final_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Finished!</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Experiments often end with a final screen, e.g. that contains a completion\
  code so the participant can claim their payment.</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  This is a placeholder for that information.</p>",
  choices: ["Click to finish the experiment and see your raw data"],
};

/******************************************************************************/
/*** Build the timeline *******************************************************/
/******************************************************************************/

var full_timeline = [
  consent_screen,
  instruction_screen_1,
  instruction_screen_2,
  survey_text_judgment_trial,
  final_screen,
];

/*
Finally we call jsPsych.run to run the timeline we have created.
*/

jsPsych.run(full_timeline);
