---
title: Week 7 practical, notes
description: Some notes on answers to the practical questions
---


### It's possible to *filter* the data before saving it, e.g. grabbing only the trials where we marked `{block: "observation"}` or `{block: "production"}` - this is explained in the notes for last week's practical, or you can look at Section 06 of Alisdair's tutorial, or you can look at [the jsPsych documentation on aggregating and manipulating data](https://www.jspsych.org/v8/overview/data/#aggregating-and-manipulating-jspsych-data). Can you figure out how to change the `on_finish` for `initJsPsych` so that it only saves the observation and production trial data to the server? You may have tried this last week too.

This involves changing the `on_finish` bit of `initJsPsych` (which is where the data-saving happens):

```js
var jsPsych = initJsPsych({
  on_finish: function () {
    //use data.get and filter to select the trials we want
      var relevant_data = jsPsych.data.get().filter([{block: 'observation'}, {block:'production'}]);
      var relevant_data_as_csv = relevant_data.csv(); //convert that to a csv file
      save_data("wordlearning_data.csv", relevant_data_as_csv); //save it
      jsPsych.data.displayData('csv'); //and also dump *all* the data to screen
  }
});
```

This is really close to the example from [last week's notes](oels_practical_wk6_notes.md) - the only difference is that we are filtering on the `block` column, because that's the label we used for this particular piece of data.

### How would you change the number of observation and/or production trials that participants receive?

Thanks to the way we are constructing the observation and production timelines, this is now quite easy!

Remember that in both cases we create some variables to store our basic observation or production trials, then we use the jsPsych `repeat` function to create a timeline that repeats these. So for observation, if we want 3 instances of buv and two of cal:

```js
var observation_trial_object4_buv = make_observation_trial("images/object4.jpg", "buv");
var observation_trial_object4_cal = make_observation_trial("images/object4.jpg", "cal");

var observation_trials = jsPsych.randomization.repeat(
  [observation_trial_object4_buv, observation_trial_object4_cal],
  [3, 2]
);
```

If you changed the numbers in the `repeat` call you can change the number of times the participant will see the two labels. E.g. if we want to change this to 4 buv and 6 cal:

```js
var observation_trials = jsPsych.randomization.repeat(
  [observation_trial_object4_buv, observation_trial_object4_cal],
  [4, 6]
);
```

Similarly in the production trials, the repetition is achieved with

```js
var production_trials = jsPsych.randomization.repeat([production_trial_object4], 5);
```

so increasing to e.g. 10 test trials for this object is easy:

```js
var production_trials = jsPsych.randomization.repeat([production_trial_object4], 10);
```


### The code here is for the low-load linguistic version of the Ferdinand et al. (2019) experiment, with 1 object. How would you modify the code to do something with higher load, e.g. 2 or 3 objects, each with 2 labels? You could either do a blocked design (participants see several objects but the observation or production trials are organised such that all the trials for one object are together, then all the trials for the next object are together), or a fully-randomised presentation (i.e. you do all the observation trials, then all the production trials, but all the objects are interspersed randomly within each phase).

Creating observation trials for a second object should be pretty easy now that we have defined a function for creating observation trials, e.g. 

```js
//the old object plus labels
var observation_trial_object4_buv = make_observation_trial("images/object4.jpg", "buv");
var observation_trial_object4_cal = make_observation_trial("images/object4.jpg", "cal");

//new object + labels
var observation_trial_object5_seb = make_observation_trial("images/object5.jpg", "seb");
var observation_trial_object5_nuk = make_observation_trial("images/object5.jpg", "nuk");

var observation_trials = jsPsych.randomization.repeat(
  [observation_trial_object4_buv, observation_trial_object4_cal,
  observation_trial_object5_seb, observation_trial_object5_nuk],
  [3, 2, 4, 1]
);
```

Notice that I can create the entire list of `observation_trials` with a single use of
`jsPsych.randomization.repeat` - here I am asking for 3 occurrences of object4+buv, 2 of object4+cal, 4 of object5+seb, 1 of object5+nuk.

We can do the same for the production trials - if we also want to test on object 5, we can extend our existing code to:

```js
//the old production trial for object4
var production_trial_object4 = make_production_trial("images/object4.jpg", ["buv", "cal"]);

//new production trial
var production_trial_object5 = make_production_trial("images/object5.jpg",["seb","nuk"]);

//repeat both 5 times
var production_trials = jsPsych.randomization.repeat(
  [production_trial_object4, production_trial_object5],
  5
);
```

Notice that `jsPsych.randomization.repeat` can be used in two slightly different ways - if we give it a *list* of numbers for the number of repetitions, that allows us to have different numbers of repetitions for each thing in the trial list we are repeating; if we give it a *single* number then it repeats everything in the trial list that many times (which is what we do here - we want 5 repetitions of the production trials for both objects). 

If you want to do blocked presentation (e.g. all the presentations of object4 then all the presentations of object5), you can create separate sets of trials for each, then combine them in the order you want when you create the full timeline. E.g. for observation trials, if we want all the presentations of object4 then all the presentations of object5 we could create separate trial lists like this:

```js
var observation_trial_object4_buv = make_observation_trial("images/object4.jpg", "buv");
var observation_trial_object4_cal = make_observation_trial("images/object4.jpg", "cal");

var observation_trial_object5_seb = make_observation_trial("images/object5.jpg", "seb");
var observation_trial_object5_nuk = make_observation_trial("images/object5.jpg", "nuk");

var observation_trials_object4 = jsPsych.randomization.repeat(
  [observation_trial_object4_buv, observation_trial_object4_cal],
  [3, 2]
);

var observation_trials_object5 = jsPsych.randomization.repeat(
  [observation_trial_object5_seb, observation_trial_object5_nuk],
  [4, 1]
);
```

Then when we build the full timeline we can include these in the order we want:

```js
var full_timeline = [].concat(
  consent_screen,
  instruction_screen_observation,
  observation_trials_object4,
  observation_trials_object5,
  ...
);
```

### Ferdinand et al. (2019) also have a *non-linguistic* version of the same experiment, where rather than words labelling objects participants observed coloured marbles being drawn from a bag (there were no fancy animations, it was just a picture of a marble above a picture of a bag), then produced some more marble draws themselves by clicking on buttons labelled with images of coloured marbles. You don't have to implement it, but think about what sorts of changes would you need to make to the word learning code to implement this non-linguistic version? We'll see some of these tools in next week's practical.

The trickiest thing here will be having choices in a button-response trial that are images (of marbles) rather than just text buttons. We'll see how to do that elegantly next week, but I provided a simple technique in [the notes for last week's practical](oels_practical_wk6.md): the items in `choices` can be html, so we can use the html `<img>` tag to make an image appear. 

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

So for our production trials for instance, we could use the same trick - in fact, we can use *exactly the same code as for the text labels* and just pass different labelsincluding an `<img>` tag when we call the function:

```js
//marble production trial!
var production_trial_marbles = make_production_trial("images/container_1.jpg",
              ["<img src='images/marble_blue.jpg'>",
              "<img src='images/marble_orange.jpg'>"]);

var production_trials_marbles = jsPsych.randomization.repeat(
  [production_trial_marbles],
  5
);
```

This works - our `make_production_trial` function will just use whatever list of button labels we pass in when we call it.

Arranging the observation trials is slightly trickier, because we now want to display two images (container plus marble above it), rather than a single image plus a text label (which the `image-button-response` plugin is designed for). But it is possible - the `html-button-response` plugin is extremely flexible and can show any HTMl string as the stimulus, so we can achieve the desired effect.

```js
function make_observation_trial_marble(container_filename, marble_filename) {
  var observation_trial = {
    type: jsPsychHtmlButtonResponse,
    choices: [],
    timeline: [
      {
        stimulus: 
        "<p><img src='"+marble_filename+"' style='visibility: hidden;'></p>" + 
        "<p><img src='"+container_filename+"'></p>",
        trial_duration: 1000,
        on_start: function (t) {console.log(t.stimulus)}
      },
      { 
        stimulus: 
        "<p><img src='"+marble_filename+"'></p>" + 
        "<p><img src='"+container_filename+"'></p>",
        trial_duration: 2000, 
        data: { block: "observation", 
                marble_observed: marble_filename
         } },
    ],
  };
  return observation_trial;
};
```

The `stimulus` parameter is a bit complicated, and it's easiest to explain starting with the stimulus for the second sub-trial:

```js
stimulus: 
        "<p><img src='"+marble_filename+"'></p>" + 
        "<p><img src='"+container_filename+"'></p>",
```

This is a string composed of several parts, stuck together with the `+` operator (which adds numbers but joins strings - a nice feature of javascript). Both parts feature some HTML code for images, contained within two separate paragraphs, so that the marble (upper image) and the container (lower image) appear one on top of the other. There is some very careful use of single quotes to get the `<img>' tag to work as it should - when the filenames are slotted in, this string will look like this, with the path to the image file contained in quotes:

```js
"<p><img src='images/marble_blue.jpg'></p> <p><img src='images/container_1.jpg'></p>"
```

 The first sub-trial looks exactly the same, but using an additional feature of the `<img>` tag, to make the marble image hidden. It's a bit odd to have the image there but hidden, but if there's no image the container will move vertically when the marble appears, to make space for the extra image, which looks horrible; having the image there but hidden avoids this.

We can now call this function and use `repeat` to generate the observation timeline, e.g. like this: 
 ```js
var observation_trial_container1_blue = make_observation_trial_marble("images/container_1.jpg", "images/marble_blue.jpg");
var observation_trial_container1_orange = make_observation_trial_marble("images/container_1.jpg", "images/marble_orange.jpg");
var observation_trials_marbles = jsPsych.randomization.repeat(
  [observation_trial_container1_blue, observation_trial_container1_orange],
  [3, 2]
);
 ```

### [Optional, hard] Can you figure out how to use the `jsPsych.randomization.shuffleNoRepeats` function [documented here](https://www.jspsych.org/v8/reference/jspsych-randomization/#jspsychrandomizationshufflenorepeats) to do a version where observation and test trials for multiple objects are interspersed, but you never see the same object twice in a row? NB this will only work if you have 3+ different objects in the experiment - it's too hard for the code to find randomisations with no repeats if you have a small number of objects, and impossible if you only have one object, so the code will hang while  endlessly searching! 

[We already provided a detailed model answer for this](oels_practical_wk7_norepeat.md).


## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
