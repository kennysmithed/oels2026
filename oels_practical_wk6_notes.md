---
title: Week 6 practical, notes
description: Some notes on answers to the practical questions
---

### Run the code on the server once and look at the `wordlearning_data.csv` file to make sure it makes sense to you. If you have already run the code several times that file might be quite messy, in which case you can delete it and run the code again to get a cleaner view. 

This should be pretty easy! If you have edited the `save_data.php` file as instructed and are running the experiment on the server you should be getting a single CSV file in your `server_data` folder that contains the accumulated data, with reasonably-transparent header columns.

### Run the code several times and look at the `wordlearning_data.csv` file - you might have to refresh it on cyberduck to see the latest data. Make sure you understand what happens to this data file every time you run the code. If you had multiple participants doing this experiment, what would you *like* to happen (to make your life easy in dealing with your experiment data), and how would you achieve that? You don't have to write any code, just think about the outcome you would like to achieve and what it would require.

Hopefully you were able to figure out that every time the code runs it just appends new data to the end of the CSV file (including the header row). That's pretty messy, and not really what you want if you are collecting real data, for a couple of reasons. First, in our current set-up there's no way of telling which participant a given chunk of data comes from - minimally, we'd like to add another column with some kind of unique participant identifier. But even then, I don't like the idea of saving everyone's data to a single file - I am not confident what will happen if two participants complete at the same time (Will it write both sets of data? Neither?), plus imagine if that single file containing all my data got corrupted or deleted somehow! So what I usually do, and what we'll eventually show you how to do, is to create a separate CSV file for each participant (using a unique participant ID in the file name) - that's more robust, and clearer in that when you look in your `server_data` you can see how many participants you have.

### How would you add extra trials to this code, i.e. additional training and testing trials? You can hunt about in the `images` folder, in conjunction with a translation app or an English-Spanish dictionary, to get some inspiration for Spanish words to use in training and testing.

This should be easy enough, but a little laborious: we can copy, paste and edit one of our existing trials, editing the bits we want to be different, and then add the new trials we have created to the timeline.

### This code actually implements one condition of Experiment 4 of Chua & Pan (2026), where participants receive multiple-choice and cued-recall critical tests in blocks (all of one test type, then all of the other). How would you implement the version of the experiment where the critical test types are randomly intermingled?

This is actually really easy! At the moment our timeline looks like this:

```js
var full_timeline = [
  consent_screen,
  training_instruction_screen,
  guess_truck_camion,
  reading_ear_oreja,
  reading_ball_pelota,
  guess_key_llave,
  multiple_choice_instruction_screen,
  critical_test_mc_ear_oreja,
  critical_test_mc_truck_camion,
  critical_test_mc_key_llave,
  critical_test_mc_ball_pelota,
  cued_recall_instruction_screen,
  critical_test_cr_truck_camion,
  critical_test_cr_ear_oreja,
  critical_test_cr_key_llave,
  critical_test_cr_ball_pelota,
  final_screen,
];
```

Notice that the variables containing the multiple-choice critical test items (`critical_test_mc_ear_oreja`, `critical_test_mc_truck_camion` etc) all come one after another in the timeline, and the cued-recall test variables (`critical_test_cr_truck_camion` etc) are similarly all together. If we want to change the order to (for now, manually) randomly intersperse these, we can just change the order in the timeline.

```js
var full_timeline = [
  consent_screen,
  training_instruction_screen,
  guess_truck_camion,
  reading_ear_oreja,
  reading_ball_pelota,
  guess_key_llave,
  //problem with the way the instructions are currently written!
  multiple_choice_instruction_screen,
  cued_recall_instruction_screen,
  //"random" order of trials
  critical_test_mc_ear_oreja,
  critical_test_cr_truck_camion,
  critical_test_cr_ear_oreja,
  critical_test_mc_truck_camion,
  critical_test_cr_key_llave,
  critical_test_cr_ball_pelota,
  critical_test_mc_key_llave,
  critical_test_mc_ball_pelota,
  final_screen,
];
```

The only problem here is that our instructions (in `multiple_choice_instruction_screen` and `cued_recall_instruction_screen`) are currently written to introduce testing organised into blocks, so you'd have to rewrite those.

### In the guess part of our guess-and-feedback trials, participants have unlimited time to respond. How would you include a time-limit, e.g. 8 seconds as implemented by Chua & Pan? 

The feedback part of the guess-and-feedback trials already includes a time-limited trial, achieved using `trial_duration`:

```js
{
      //feedback trial - see the correct word, no response possible!
      prompt: "camion",
      choices: [],
      response_ends_trial: false,
      trial_duration: 5000,
      data: { exp_trial_type: "feedback" },
    }
```

So you can do the same for the guess part, and just add a duration - if the participant responds before then the trial ends, if they don't respond within the time-limit the trial ends.

```js
var guess_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", 
  timeline: [
    {
      //guessing trial - choose the word
      choices: ["camion", "le&oacute;n", "granja", "cepillar"],
      data: {
        exp_trial_type: "guess", 
        correct_word: "camion", 
      },
      trial_duraction: 8000, //new!
      save_trial_parameters: { choices: true }, 
      on_finish: function (data) {
        //at the end of the trial... 
        var button_number = data.response; 
        var word_selected = data.choices[button_number]; 
        data.response_word = word_selected; 
        if (word_selected == data.correct_word) {
          data.score = 1;
        } else {
          data.score = 0;
        }
      },
    },
    {
      //feedback trial - as before
      ...
    },
  ],
};
```

If the trial times out (i.e. the participant does not respond before the time limit) then `data.response` is `null` (rather than a number indicating which button they clicked on). I thought that might cause problems when it came to scoring the trial - if `data.response` is `null`, scoring the trial depends on looking up what is `data.choices[null]`, and I wasn't sure how that would work. In fact it seems like it works OK - `data.choices[null]` evaluates to `undefined`, and then `undefined` is not the same as the correcr word, so non-response trials are scored as incorrect (phew!). But if you find yourself in this position, and you think "I wonder what the `data` object for this trial looks like, theres a really we to find out - add a `console.log` to the trial's `on_finish`, like thisL

```js
var guess_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", 
  timeline: [
    {
      //guessing trial - choose the word
      choices: ["camion", "le&oacute;n", "granja", "cepillar"],
      ...
      on_finish: function (data) {
        //at the end of the trial... 
        console.log(data)
        //rest of the on_finish...
```

Then if you run the code and look in the javascript console, you will see a clickable object corresponding to this `console.log` of the trial data. 

### It's possible to *filter* the data before saving it, e.g. grabbing only the trials where we marked `{exp_trial_type: "guess"}` or `{exp_trial_type: "reading"}` etc - this is explained in Section 06 of Alisdair's tutorial, or you can look at [the jsPsych documentation on aggregating and manipulating data](https://www.jspsych.org/v8/overview/data/#aggregating-and-manipulating-jspsych-data). Can you figure out how to change the `on_finish` for `initJsPsych` so that it only saves the data from "interesting" trials to the server?

This involves changing the `on_finish` bit of `initJsPsych` (which is where the data-saving happens):

```js
var jsPsych = initJsPsych({
  on_finish: function () {
    //var all_data = jsPsych.data.get(); //get all data
    var all_data = jsPsych.data.get().filter([
      {exp_trial_type: 'guess'},
      {exp_trial_type: 'reading'},
      {exp_trial_type: 'critical_multiple_choice'}, 
      {exp_trial_type:'critical_cued_recall'}]);
      
    var all_data_as_csv = all_data.csv(); //convert to csv format
    save_data("wordlearning_data.csv", all_data_as_csv); //save it using save_data function defined in utilities.js
  },
});
```

This is really close to the example Alisdair gives in his tutorial - the only difference is that we want to save data with one opf several values in the `exp_trial_type` field, so we can do that by providing a list of options in the `filter`.

### How would you start to change this code to implement the word-to-image version of the experiment, rather than the image-to-word version? Think about what you would need to change conceptually to achieve this, and then [optional, challenging!] whether you can find a way using techniques you have seen today to achieve this - we'll come back to this next week!

Conceptually, for a word-to-image version of the experiment, I need to change the stimulus from an image to a word (easy) and change the buttons on guess-and-feedback trials from words to images (harder).

Getting the stimulus to be a word is easy - this is one of the very first things we did, and an `html-button-response` plugin will allow us to present a word as a stimulus. 

But how do we use images, rather than words, on the buttons? jsPsych actually provides a tool we can use for this kind of thing that we'll use repeatedly over the next couple of weeks - but you haven't seen it yet, so you might have come up with a different solution. One thing we *have* seen a couple of times is using `<img>` tags to smuggle in an image where you might otherwise expect text - this is how we included images in the prompt of `survey-text` trials. You can actually use this technique to produce a button-response trial where the button labels are images, like this:

```js
var guess_truck_camion_word_to_image = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "camion",
  timeline: [
    {
      //guessing trial - choose the image
      choices: [
        "<img src='images/PICTURE_535.jpg'>", //truck
      "<img src='images/PICTURE_15.jpg'>", //lion 
      "<img src='images/PICTURE_30.jpg'>", //farm
      "<img src='images/PICTURE_43.jpg'>" //hairbrush
      ],
    },
    {
      //feedback trial - see the correct word, no response possible!
      choices: ["<img src='images/PICTURE_535.jpg'>"],
      response_ends_trial: false,
      trial_duration: 5000,
    },
  ],
};
```

I thought the simplest way to do the feedback was just to stick with the `html-button-response` trial and use a single button to display the correct image, but keep `response_ends_trial: false` so that nothing happens if the participant clicks on it - a little messy but we will see a better way to do this next week, being able to make unclickable buttons is surprisingly useful!





## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
