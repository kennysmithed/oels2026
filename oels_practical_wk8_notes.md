---
title: Week 8 practical, notes
description: Some notes on answers to the practical questions
---

### Run the code once and look at the `perceptuallearning_data.csv` file to make sure it makes sense to you. You can also compare the data saved in the server with the data dumped in the browser window at the end. Run the code again and see what happens to that file, and think about how you might want to save your data for a real experiment.

Because we are saving the data trial-by-trial, and only saving the critical trials (and not e.g. the instruction screens), the data saved on the server is a bit more compact and neat than the data dumped in the browser window at the end. But even though we are saving the data trial-by-trial, we are still just appending new data to the end of the CSV file (including the header row). As I said last week, that's pretty messy, and not really what you want if you are collecting real data, so next week we'll show you how to create a separate CSV file for each participant (using a unique participant ID in the file name).

### Check you can add a few more picture selection trials with other images and sound files (you might need to consult the `perceptual_learning_stims.csv` file to see the full list of stimuli).

This just involves adding some more lines using the `make_picture_selection_trial` and `make_categorization_trial` functions to make trials. So our current code for creating a list of picture selection trials is:

```js
var selection_trials_unshuffled = [
  make_picture_selection_trial("fresh_dill_man", "fresh_dill", "dry_dill"),
  make_picture_selection_trial("orange_telephone","orange_telephone","black_telephone"),
  make_picture_selection_trial("angel_wing", "angel_wing", "airplane_wing"),
  make_picture_selection_trial("animal_ear", "animal_ear", "animal_nose"),
];

var selection_trials = jsPsych.randomization.shuffle(
  selection_trials_unshuffled
);

```
 (Then the list is shuffled and eventually added to the timeline). So we can just add more trials, like this:

 ```js
var selection_trials_unshuffled = [
  //same 4 trials as before
  var selection_trials_unshuffled = [
  make_picture_selection_trial("fresh_dill_man", "fresh_dill", "dry_dill"),
  make_picture_selection_trial("orange_telephone","orange_telephone","black_telephone"),
  make_picture_selection_trial("angel_wing", "angel_wing", "airplane_wing"),
  make_picture_selection_trial("animal_ear", "animal_ear", "animal_nose"),
  //2 new trials
  make_picture_selection_trial("falling_dominoes_man","falling_dominoes","standing_dominoes"),
  make_picture_selection_trial("eiffel_tower","eiffel_tower","pisa_tower"),
];
 ```

 That's the first /d/ and /t/ trial from the `perceptual_learning_stims.csv`, and I set it so that the dominoes trial will get a manipulated /d/ (as indicated by `\_man` at the end of the sound file name) but the tower trial gets a normal /t/ (no `\_man` at the end).

Similarly, here's our code for the categorization trials:

```js
var categorization_trials_unshuffled = [
  make_categorization_trial("samespeaker_VOT5"),
  make_categorization_trial("samespeaker_VOT10"),
  make_categorization_trial("samespeaker_VOT15"),
  make_categorization_trial("samespeaker_VOT20"),
  make_categorization_trial("samespeaker_VOT25"),
  make_categorization_trial("samespeaker_VOT30"),
  make_categorization_trial("samespeaker_VOT50"),
  make_categorization_trial("samespeaker_VOT80"),
];


var categorization_trials = jsPsych.randomization.shuffle(
  categorization_trials_unshuffled
);
```

I could just copy and paste some extra lines featuring `make_categorization_trial` in there (yawn), or I could use `jsPsych.randomization.repeat` to repeat that list a few times, to test people on each dean/teen decision a few times, e.g. 

```js
var categorization_trials = jsPsych.randomization.repeat(
  categorization_trials_unshuffled,
  2
);
```

Note that `jsPsych.randomization.repeat` repeats *and* shuffles, so that will give me 2 copies of all the categorization trials.

### How would you add a simple text-line question to the final survey? E.g. one of the later questions in Lev-Ari's survey is "Please state the age range of the people with whom you regularly converse in a typical week from the youngest person to the oldest person (e.g. 21-60 years). Only include those above the age of 12."

This is easy, and just invovles adding another question to the `html` parameter of our survey trial.

```js
var social_network_questionnaire = {
  type: jsPsychSurveyHtmlForm,
  preamble: ...,//as before
  html: "<p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
            How old are you? <br> \
            <input required name='age' type='number'></p> \
            [other questions]\
            <p style='text-align:left; padding-left: 40px; padding-right: 40px'>\
            Please state the age range of the people with whom you regularly converse \
            in a typical week from the youngest person to the oldest person (e.g. 21-60 years). \
            Only include those above the age of 12.<br>\
            <input required name='age_range' type='text'></p>",
};
```

The only change here is that I have set `type` to text, to acceopt text responses.

### There are 4 conditions in the experiment - all combinations of manipulated /d/ or manipulated /t/, same speaker or new speaker in the categorisation test. How would you build stimulus lists for these different conditions, i.e. what would you need to change in the code to change the condition a participant experiences? You don't have to do anything fancy here - ideally we'd like to have the code assign participants to a random condition every time the experiment starts, and we'll cover that soon, but at this point just figure out what bits of the stimulus list you need to manually edit to run these different conditions.

To do this manually is pretty simple. Remember that in the manipulated /d/ condition, all instances of /d/ in the picture selection trials are manipulated - that's actually what I have in the trial list above, you'll notice that whenever the trial involves a /d/ (dill, dominoes) the file name ends in "_man", so they hear the manipulated audio.

To flip this to manipulated /t/ I just need to remove the "_man" for the /d/ trials and add it for the /t/ trials so that they hear normal /d/ and manipulated /t/: 
```js
var selection_trials_unshuffled = [
  //same 4 trials as before
  var selection_trials_unshuffled = [
  make_picture_selection_trial("fresh_dill", "fresh_dill", "dry_dill"),
  make_picture_selection_trial("orange_telephone_man","orange_telephone","black_telephone"),
  make_picture_selection_trial("angel_wing", "angel_wing", "airplane_wing"),
  make_picture_selection_trial("animal_ear", "animal_ear", "animal_nose"),
  //2 new trials
  make_picture_selection_trial("falling_dominoes","falling_dominoes","standing_dominoes"),
  make_picture_selection_trial("eiffel_tower_man","eiffel_tower","pisa_tower"),
];
```

How about switching from the same-speaker condition to the new speaker condition? Remember, the same- vs new-speaker manipulation affects the sound files you hear in the categorization test - thanks to the sensible and clear names of the sound files, I can just change the names of the sound files there to play the new (male) voice:

```js
var categorization_trials_unshuffled = [
  make_categorization_trial("newspeaker_VOT5"),
  make_categorization_trial("newspeaker_VOT10"),
  make_categorization_trial("newspeaker_VOT15"),
  make_categorization_trial("newspeaker_VOT20"),
  make_categorization_trial("newspeaker_VOT25"),
  make_categorization_trial("newspeaker_VOT30"),
  make_categorization_trial("newspeaker_VOT50"),
  make_categorization_trial("newspeaker_VOT80"),
];
```

### How would you modify this code so that the phoneme categorisation trials are all repeated several times? Note that there is a manual way to do this and a fast way, using some built-in jsPsych functions for repeating things that we have seen before!

I actually did this above, using `jsPsych.randomization.repeat`.

### At the moment the dean-teen buttons always appear in the same order. Can you randomise their left-right position and still keep track of which option the participant clicked?

This should be pretty easy, since we are doing this for the picture selection trials - so we can just use the same trick, randomising the trial choices in `on_start`:

```js
function make_categorization_trial(sound) {
  //add the path and file extension
  var sound_file = "phoneme_categorization_sounds/" + sound + ".mp3";
  var trial = {
    type: jsPsychAudioButtonResponse,
    stimulus: sound_file,
    choices: ["dean", "teen"], //placeholder choices
    data: {block: "phoneme_categorization"},
    save_trial_parameters: {choices: true},
    post_trial_gap: 500,
    on_start: function (trial) {
      var shuffled_choices = jsPsych.randomization.shuffle(trial.choices); //shuffle
      trial.choices = shuffled_choices; //set trial.choices to shuffled choices
    },
    on_finish: function (data) {
      var button_number = data.response;
      data.button_selected = data.choices[button_number];
      save_perceptual_learning_data_line(data);
    },
  };
  return trial;
}
```

### At the moment the audio we present using the `audio-button-response` plugin is interruptible - if you click part-way through the audio it will register your response and move to the next trial. Can you fix it to produce a non-interruptible audio, i.e. you can't click until the audio is done? Hint: the trick here is going to look at [the documentation](https://www.jspsych.org/v8/plugins/audio-button-response/)) for the `audio-button-response` plugin.

jsPsych makes it pretty easy - we can just set the `response_allowed_while_playing` parameter for `audio-button-response` trials to false. E.g. adding that to my `make_categorization_trial` function:

```js
function make_categorization_trial(sound) {
  //add the path and file extension
  var sound_file = "phoneme_categorization_sounds/" + sound + ".mp3";
  var trial = {
    type: jsPsychAudioButtonResponse,
    stimulus: sound_file,
    choices: ["dean", "teen"], 
    data: {block: "phoneme_categorization"},
    save_trial_parameters: {choices: true},
    post_trial_gap: 500,
    response_allowed_while_playing: false, //new!
    on_start: function (trial) {
      var shuffled_choices = jsPsych.randomization.shuffle(trial.choices); 
      trial.choices = shuffled_choices; 
    },
    on_finish: function (data) {
      var button_number = data.response;
      data.button_selected = data.choices[button_number];
      save_perceptual_learning_data_line(data);
    },
  };
  return trial;
}
```

### Following the guidance in the notes above on preloading, add code to automatically preload the images used as buttons in the picture selection phase. The easy way to do this is to manually specify a list of images (including their path names!) to preload - generating this list automatically is a harder question below!

All we are looking for at this point is a manual preload list - I can look through my trials (e.g. using the expanded list above), and note that I am using the following images: "fresh_dill", "dry_dill", "orange_telephone", "black_telephone", "angel_wing", "airplane_wing", "animal_ear", "animal_nose", "falling_dominoes", "standing_dominoes", "eiffel_tower", "pisa_tower". I need to put those in a list, but I also need to add the information on the path (they are all in `picture_selection_images/`) and the extension (they are all `.jpg`). So my preload image will look like this:

```js
var preload_image_list = 
[ 
  "picture_selection_images/fresh_dill.jpg", 
  "picture_selection_images/dry_dill.jpg", 
  "picture_selection_images/orange_telephone.jpg", 
  "picture_selection_images/black_telephone.jpg", 
  //etc
];
```

Then I can just use this in the preloading trial:

```js
var preload = {
  type: jsPsychPreload,
  auto_preload: true,
  images: preload_image_list
};
```

### [Optional] Can you add code to automatically score the picture-selection trials as correct or incorrect, using methods we have seen in previous weeks (e.g. in the word-learning experiment)?

Here's a reminder of how we did it in the word learning experiment - we store `correct_word` in data then compare the participant's response to that in `on_finish`.

```js
var guess_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", //this stimulus will be shown for every trial in the nested timeline
  timeline: [
    {
      //guessing trial - choose the word
      choices: ["camion", "le&oacute;n", "granja", "cepillar"],
      data: {
        //add some information to the data for this trial
        exp_trial_type: "guess", //mark this as a "guess" trial
        correct_word: "camion", //and record the correct word (for comparison with what the participant selects)
      },
      save_trial_parameters: { choices: true }, //we need to save the trial choices so we can score the trial 
      on_finish: function (data) {
        //at the end of the trial...
        //this is the *index* of the button they clicked
        var button_number = data.response; 
        //look up that button in choices to see what word they clicked
        var word_selected = data.choices[button_number];
        //record the word they clicked in the trial data
        data.response_word = word_selected; 
        //then score the trial by comparing 
        //the word they selected with the correct word
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

It's quite straightforward to copy the scoring part of the `on_finish` into our `make_picture_selection_trial` function, with a little adjustment to account for slighty different variable names - we are already specifying the `target_picture` as one of the function parameters, which makes life very easy. Here's the `on_finish` that will do the job: 

```js
function make_picture_selection_trial(sound, target_image, foil_image) {
  var sound_file = "picture_selection_sounds/" + sound + ".mp3";
  var trial = {
    type: jsPsychAudioButtonResponse,
    ...
    on_finish: function (data) {
          var button_number = data.response;
          data.button_selected = data.choices[button_number];
          //scoring - this is new
          if (data.button_selected == target_image) {
              data.score = 1;
            } else {
              data.score = 0;
            }
          save_perceptual_learning_data_line(data); 
        },
    ...
  };
  return trial;
}    
```

If you make this change and run the code you should see a `score` column in the data displayed in the browser - but if we want it in the line-by-line data (and we do!) we will also have to update `save_perceptual_learning_data_line` so that it retrieves `data.score` and adds it to the data that is saved.

```js
function save_perceptual_learning_data_line(data) {
  console.log(data);
  // choose the data we want to save - adding data.score to this!
  var data_to_save = [
    data.block,
    data.trial_index,
    data.time_elapsed,
    data.stimulus,
    data.choices,
    data.button_selected,
    data.response,
    data.score, //this is new!
    data.rt,
  ];
  var line = data_to_save.join(",") + "\n";
  save_data("perceptuallearning_data.csv", line);
}
```

Similarly, to make sure the column names line up, we have to update `write_headers`:

```js
var write_headers = {
  type: jsPsychCallFunction,
  func: function () {
    //write column headers to perceptuallearning_data.csv
    //adding "score" right before rt!
    save_data(
      "perceptuallearning_data.csv",
      "block,trial_index,time_elapsed,stimulus,button_choice_1,button_choice_2,button_selected,response,score,rt\n",
    );
  },
};
```


### [Harder, optional] The code doesn't currently save the social network questionnaire data. Can you add a new function, `save_questionnaire_data`, which runs at the end of the questionnaire trial and saves that data to a file on the server? You can just dump it into a file as an undigested string (i.e. with various curly brackets etc in there), or if you are feeling ambitious you can try to save some more nicely formatted data using the same tricks we use in `save_perceptual_learning_data`, in which case the first thing you are probably going to want to do is use `console.log` to get a look at the data generated by the questionnaire trial and take it from there. 

[You can already access our answers for the harder questions here](oels_practical_wk6_extended.md) - this covers this question and the next.

### [Harder, optional] Add code to automatically preload all the images used as buttons in the picture selection phase, without having to manually specify the image list. You could extract this automatically from `selection_trials`, e.g. using a for-loop to work through the trials in `selection_trials`, extract the image names from the `choices` of each trial, and add them to a preload list. 

[You can already access our answers for the harder questions here](oels_practical_wk6_extended.md).



## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
