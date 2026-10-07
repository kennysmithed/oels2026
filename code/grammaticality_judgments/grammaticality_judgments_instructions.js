/*
This is a javascript block comment - the interpreter ignores this stuff, it's for
you to read, although note that anyone looking at the source code of your experiment
will see these comments, including any curious participants!
*/

// Individual lines can be commented out like this.

/******************************************************************************/
/*** Initialise jspsych *******************************************************/
/******************************************************************************/

/* 
Nothing fancy going on in here, except that on_finish (so after the final trial 
in the experiment) we use a built-in function to dump the raw data on the screen. 
Obviously you wouldn't do this with a real experiment, and we will show you how 
to save data in a subsequent example, but this at least allows you to see what 
the data looks like behind the scenes.
*/

var jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData("csv");
  },
});

/******************************************************************************/
/*** Judgment trials **********************************************************/
/******************************************************************************/

/*
Next we lay out the critical trials.
These are type: jsPsychHtmlKeyboardResponse, because we are going to show the participant
some text on screen and then ask them to press a button.
stimulus is the sentence they will see.
choices are the keyboard responses that will be accepted - only the y or n keys
The prompt reminds them what to do on each trial. We use a little bit of html
formatting in the prompt so it appears in italics (that's what the <em> and </em>
tags do) and vertically separated (in its own paragraph, using the <p> tags),
so make it stand out from the stimulus sentence.

We just have 4 judgment trials here, obviously a real experiment would typically have more!
*/

//Filler sentence, grammatical
var judgment_trial_1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Where did Blake buy the hat?",
  prompt:
    "<p><em>Could this sentence be spoken by a native speaker of English? Press y or n</em></p>",
  choices: ["y", "n"],
};

//Complex NP Island Effect, control
var judgment_trial_2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "What did you claim that Blake bought?",
  prompt:
    "<p><em>Could this sentence be spoken by a native speaker of English? Press y or n</em></p>",
  choices: ["y", "n"],
};

//Complex NP Island Effect, violation
var judgment_trial_3 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "What did you make the claim that Blake bought?",
  prompt:
    "<p><em>Could this sentence be spoken by a native speaker of English? Press y or n</em></p>",
  choices: ["y", "n"],
};

//Filler sentence, ungrammatical
var judgment_trial_4 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Did where Blake buy the hat?",
  prompt:
    "<p><em>Could this sentence be spoken by a native speaker of English? Press y or n</em></p>",
  choices: ["y", "n"],
};

/******************************************************************************/
/*** Instruction trials *******************************************************/
/******************************************************************************/

/*
This is the new code, using the jsPsychInstructions plugin. The pages parameter
is a list (array) of hjtml strings, where each string is a single instructions page. 
I just copied these from the `grammaticality_judgments.js` code, so each one is 
quite long and has a bunch of formatting.
*/
var all_instructions = {
    type: jsPsychInstructions,
    pages: [
    //the first page is the consent screen
    "<h3>Welcome to the experiment</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Experiments begin with an information sheet that explains to the participant\
  what they will be doing, how their data will be used, and how they will be remunerated.</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  This is a placeholder for that information, which is normally reviewed\
  as part of the ethical review process.</p>", 
  //the second page
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
  //the third page
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
  <p> <span style='color:green'>This is a pen</span> <b>(yes)</b></p>"
  ],
  show_clickable_nav: true //this makes the buttons for navigating through the instructions visible
}

//The final screen still uses jsPsychHtmlButtonResponse
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
  all_instructions, //slot the new all_instructions trial into the timeline
  judgment_trial_1,
  judgment_trial_2,
  judgment_trial_3,
  judgment_trial_4,
  final_screen,
];

/*
Call jsPsych.run to run the timeline we have created.
*/

jsPsych.run(full_timeline);
