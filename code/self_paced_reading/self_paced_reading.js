/******************************************************************************/
/*** Initialise jspsych *******************************************************/
/******************************************************************************/

/* 
Nothing fancy going on in here - once again we we use a built-in function to dump 
the raw data on the screen. 
*/

var jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData("csv");
  },
});

/******************************************************************************/
/*** Self-paced reading trials ************************************************/
/******************************************************************************/

/*
First we lay out the critical trials.

Each individual self-paced reading trial is actually rather complex: it involves 
word-by-word presentation of a sentence, followed by a comprehension question 
(the comprehension questions are there to prevent participants just rattling 
through the sentence without actually reading it).

The way we are going to do this is by using nested timelines. Each trial is an
'html-keyboard-response' with a default choices parameter of " " (i.e. a spacebar
press) and a nested timeline that specifies the word-by-word reading trials and 
the comprehension question. For the word-by-word presentation we just need to 
specify the stimulus, and those trials use the default choices (" "). For the 
comprehension question we need a different stimulus, a prompt telling the participant
what to do, and also we override the default choices (so choices become ["y", "n"], 
i.e. we accept a y or n keypress, just like in the grammaticality judgments code).
*/

var spr_trial_1 = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "], //default choices will be inherited by all trials in the nested timeline
  timeline: [
    // The nested timeline contains the word-by-word presentation and the comprehension question
    // The first 9 trials in the nested timeline are for the word-by-word presentation;
    // for these we just need to specify the stimulus
    { stimulus: "Which" },
    { stimulus: "events" },
    { stimulus: "was" },
    { stimulus: "the" },
    { stimulus: "reporter" },
    { stimulus: "describing" },
    { stimulus: "with" },
    { stimulus: "great" },
    { stimulus: "haste?" },

    // The final trial in the nested timeline is the comprehension question, which overrides the top-level choices parameter
    // This trial also has a prompt, we mark it as a comprehension trial in the trial data, and we score it as correct or incorrect based on the participant's response
    {
      stimulus: "Did the reporter describe the events slowly?",
      prompt: "<p><em>Answer y or n</em></p>",
      choices: ["y", "n"],
      data: { exp_trial_type: "comprehension" },
      on_finish: function (data) {
        // Here we can add some code to check the participant's response and mark it as correct or incorrect
        if (data.response == "n") { //here the correct response is "n" (no), so we check if the participant pressed "n"
          data.score = 1;
        } else {
          data.score = 0;
        }
      }
    },
  ],
};

var spr_trial_2 = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  timeline: [
    { stimulus: "Which" },
    { stimulus: "building" },
    { stimulus: "were" },
    { stimulus: "the" },
    { stimulus: "architects" },
    { stimulus: "featuring" },
    { stimulus: "in" },
    { stimulus: "the" },
    { stimulus: "portfolio?" },
    {
      stimulus: "Did the architects have a portfolio?",
      prompt: "<p><em>Answer y or n</em></p>",
      choices: ["y", "n"],
      data: { exp_trial_type: "comprehension" },
      on_finish: function (data) {
        if (data.response == "y") { //here the correct response is "y" (yes)
          data.score = 1;
        } else {
          data.score = 0;
        }
      }
    },
  ],
};

/******************************************************************************/
/*** Instruction trials *******************************************************/
/******************************************************************************/

/*
As usual, your experiment will need a consent screen and some instruction screens. 
I am using a button response, as per last week - I like a button response because 
I think it makes it less likely that people will keypress through before they realise 
what they are supposed to be doing. Note that jsPsych provides an instructions 
plugin (https://www.jspsych.org/v8/plugins/instructions/)
which would be better if you were providing many many pages of instructions.
*/

var consent_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Welcome to the experiment</h3> \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Experiments begin with an information sheet that explains to the participant \
  what they will be doing, how their data will be used, and how they will be \
  remunerated.</p> \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  This is a placeholder for that information, which is normally reviewed \
  as part of the ethical review process.</p>",
  choices: ["Yes, I consent to participate"],
};

// These instructions are taken from the code for the original experiment , which is
// not written in jsPsych but is available at https://code.google.com/archive/p/enochson-amt/
var instruction_screen_1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Instructions</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Read the following sentences, one word at a time, \
  pressing SPACE after each word to move on to the next word.</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  After each word-by-word sentence, you will see a yes/no question. \
  For yes/no questions, press y for yes and n for no.</p>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Try to read at a natural pace; quickly, but with comprehension.</p>",
  choices: ["Continue"],
};

var final_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Finished!</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Experiments often end with a final screen, e.g. that contains a completion \
  code so the participant can claim their payment.</p>\
  \
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  This is a placeholder for that information.",
  choices: ["Click to finish the experiment and see your raw data"],
};

/******************************************************************************/
/*** Collect demographics *******************************************************/
/******************************************************************************/

/*
Sometimes you want to collect demographic information from your participants - e.g.
age, gender, whether they are a native speaker of some language - and also give
them the opportunity to provide free-text comments (e.g. in case there is a problem
with your experiment that they have noticed). The survey-text plugin provides
a simple way to collect free-text responses to multiple questions on a single page. 
*/

var demographics_form = {
  type: jsPsychSurveyText,
  preamble:
    "<p style='text-align:left'> Please answer a few final questions about yourself and our experiment.</p>",
  questions: [
    {
      prompt: "Are you a native speaker of English?",
      placeholder: "Answer yes or no",
      required: true,
    },
    {
      prompt: "What is your age?",
      placeholder: "Age in years",
      required: true,
    },
    {
      prompt:
        "Is there anything we should know about the experiment or how you completed it? Did everything work smoothly?",
    },
  ],
};

/******************************************************************************/
/*** Build the timeline *******************************************************/
/******************************************************************************/

/*
This experiment is very simple, and our timeline is just a list of the trials we
created above. There's no randomisation, so our trials will always play in the same
order every time we run through the experiment - later we'll see how to do
randomisation.
*/
var full_timeline = [
  consent_screen,
  instruction_screen_1,
  spr_trial_1,
  spr_trial_2,
  demographics_form,
  final_screen,
];

/*
Finally we call jsPsych.run to run the timeline we have created.
*/
jsPsych.run(full_timeline);
