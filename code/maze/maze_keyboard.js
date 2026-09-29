/******************************************************************************/
/*** L-maze, keyboard response version ************************************************/
/******************************************************************************/

var jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData("csv");
  },
});

var maze_trial_1 = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ["z","m"], 
  prompt: "<em>Press z for the left choice, m for the right choice",
  timeline: [
    { stimulus: "The x-x-x" },
    { stimulus: "dog thon" },
    { stimulus: "pirths chased" },
    { stimulus: "swax the" },
    { stimulus: "cat. yits." },
  ]
};

var maze_trial_2 = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ["z","m"], 
  prompt: "<em>Press z for the left choice, m for the right choice",
  timeline: [
    { stimulus: "This x-x-x" },
    { stimulus: "si is" },
    { stimulus: "a u" },
    { stimulus: "tensnece sentence" },
  ]
};

/******************************************************************************/
/*** Instruction trials *******************************************************/
/******************************************************************************/

/*
I'll just put in a consent screen and final screen.
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

var final_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<h3>Finished!</h3>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  Experiments often end with a final screen, e.g. that contains a completion \
  code so the participant can claim their payment.</p>\
  <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
  This is a placeholder for that information.</p>",
  choices: ["Click to finish the experiment and see your raw data"],
};

/******************************************************************************/
/*** Build the timeline and run ***********************************************/
/******************************************************************************/

var full_timeline = [
  consent_screen, 
  maze_trial_1, 
  maze_trial_2, 
  final_screen];

jsPsych.run(full_timeline);
