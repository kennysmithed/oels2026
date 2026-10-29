---
title: Week 7 practical
description: Randomisation of choices, using trial data for contingent trials, functions that create trials, repeating and randomising trials 
---

# The plan for week 7 practical

This week we are going to look at code for a simple word learning / frequency learning experiment based on the Ferdinand et al. (2019) paper. Our implementation of this experiment builds on the previous couple of practicals in that it uses nested timelines and accesses / adds to trial data. But we'll add a few new tricks. A major new addition is using functions to construct trials which have a fairly complex structure (although you could implement it more simply than that), which makes creating a large experiment with many complex trials much more efficient. This experiment also requires randomisation within trials, repeating trials in random order, and contingent trials (what the participant sees on one trial depends on what they did at the previous trial), so we will introduce the tools to do that. 

There is quite a lot of new technical content this week, and an important conceptual leap to thinking about writing functions to build trials - next week will be a little less intense! If you can't remember what a *function* is then please refresh your memory by looking at [the relevant part of Section 05 of the Online Experiments with jsPsych tutorial](https://softdev.ppls.ed.ac.uk/online_experiments/05_javascript.html#functions). Remember, the idea is that you can work through these practicals in the lab classes and, if necessary, in your own time (e.g. if you want to make a start before the lab class, or if you don't complete the practical in the lab class) - the lab class provides dedicated time each week to focus on doing the practicals with on-tap support from the teaching team, but you may need more than the 2 hours to get these practicals done. We are happy to help with the previous week's class if you tried to finish it off in your own time and need some help.

# A frequency learning experiment

## First: you build it!

As with last week, we'd like to give you an opportunity to try to build (parts of) this frequency learning experiment yourself. As with last week, to help you get started, we are going to provide you with a couple of templates to fill in - an html file that loads some of the plugins you will need (but once you decide what additional plugins you need you will have to load them too, e.g. by copying the appropriate script line from the plugin documentation), then a javascript file where you can put your own code. That javascript file includes some extra stuff (instructions, saving data to the server) that we pre-built for you so you can focus on the more interesting parts of the experiment. 

You are actually going to need a bunch of files for this experiment - the html and javascript templates for your attempt (which we are calling `my_frequency_learning.html` and `my_frequency_learning.js`), the html and js file for our implementation (`frequency_learning.html` and `frequency_learning.js`), and a folder containing a bunch of images. Rather than downloading these separately, download the following zip file and then uncompress it into your usual jsPsych folder, in a folder called something like `frequency_learning`, alongside your other folders containing your other practical exercises. 

- <a href="code/frequency_learning.zip" download> Download frequency_learning.zip</a>

**Once you have created this folder and put the downloaded code in it, you should copy in your `utilities.js` and `save_data.js` files from the last practical** - we are using the same code to save data at the end of the experiment, so you can copy exactly those files.

This code should run on your local computer, but you should upload the whole `frequency_learning` folder to the `public_html` folder on the jspsychlearning server and play with it there; the code that saves the data to the server will only work if your code is actually running on the jspsychlearning server.

If you want to see what the finished experiment will look like, you can run the `frequency_learning.html` file which includes our final implementation, or [you can run my copy on jspsychlearning](https://jspsychlearning.ppls.ed.ac.uk/~ksmith7/online_experiments_practicals/frequency_learning/frequency_learning.html). Remember that if you look at the data saved at the end that will include spoilers on how to write the code yourself, so depending on how much you want to challenge yourself you might want to avoid looking at the data for now! 

If you run through our implementation of the experiment you'll see that, in addition to the usual instructions, the experiment consists of two stages: *observation* and *production*.  Observation trials involve presentation of an object plus a label; production trials prompt the participant to select a label for an object. In a little more detail:

- Each observation trial consists of 2 steps: display the object for 1 second, then display the object plus a label for 2 seconds.

- Each production trial consists of 2 steps: display the object plus two labels and have the participant select a label, then have the participant confirm their label choice with a further click (which serves to centre their cursor, to prevent them mashing through the experiment too fast by clicking continually on one side). *When you implement production trials yourself, you can skip this second confirmatory step* - it involves some additional technical machinery that is relatively hard to figure out yourself (although if you really want to have a go, you can look at the jsPsych documentation on [dynamic parameters](https://www.jspsych.org/v8/overview/dynamic-parameters/)).

(NB. Ferdinand et al. have a 3rd stage at the end of each production trial where you then see the object plus the selected label for 2 further seconds - I have not included that in the code here, I don't think it's crucial and I couldn't make it look nice in jsPsych without making everything else much more complicated!).

To implement your own observation and (simplified) production trials, you need to figure out what plugin(s) you need for observation and production trials (think about the stimulus and the response), then look at [the documentation](https://www.jspsych.org/v8/plugins/list-of-plugins/) for that plugin to see how to use it and/or edit previous bits of code you have written that do something similar. The novel-object images you need are in the folder `images`. Your code should go in `my_frequency_learning.html` and `my_frequency_learning.js`.

Remember, it's OK to implement this in a very simple way, with a long manually-constructed trial list (which is probably a good way to start) - but if you want to use some of the ideas that were introduced in the last few weeks (e.g. nested timelines) that's great too. Give it a go, see how you get on, and ask for help if/when you get stuck!

## Walk-through of our implementation

As you hopefully figured out when you were trying to build it yourself, the main part of the experiment uses the same `image-button-response` plugin as last week. We are going to add some extra machinery to randomise the order of choices on-screen, and to allow the choices on one trial to depend on choices made at the previous trial (to get the click-to-confirm behaviour in production trials). 

Like in the self-paced reading and word-learning experiments from the past couple of weeks, individual trials in this frequency-learning experiment are somewhat complex - they involve a couple of steps - and we are going to use the same tool to simplify our code a bit, by using nested timelines. 

### Observation trials

OK, let's get started with the code. Remember that each observation trial consists of 2 steps: display the object (an image) for 1 second, then display the object plus a label (some text) for 2 seconds. There are several ways you could do this in jsPsych, most obviously using the `image-keyboard-response` or `image-button-response` plugins - since we will need buttons later, I am going to use the `image-button-response` plugin.

Again, the simplest way to do this would be to construct each sub-part of each observation trial as a stand-alone trial, and then stick them together into a simple flat timeline. For instance, if I want to show `object4` (a shiny cylinder thing) paired with the labels 'buv' and 'cal' several times I could do something like this:

```js
var observation_object4_only = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [],
  trial_duration: 1000,
};

var observation_object4_buv = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [],
  prompt: "buv",
  trial_duration: 2000,
};

var observation_object4_cal = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [],
  prompt: "cal",
  trial_duration: 2000,
};

```
Then if we slot those trials into our timeline in the correct order we will get the trial sequence we want, something like:

```js
var full_timeline = [
  consent_screen,
  instruction_screen_observation,
  observation_object4_only,
  observation_object4_buv,
  observation_object4_only,
  observation_object4_cal,
  observation_object4_only,
  observation_object4_buv,
  observation_object4_only,
  observation_object4_buv,
  observation_object4_only,
  observation_object4_cal,
  ...
];
```

A couple of things to note here.
- My `choices` are set to `[]` (an empty array), which means the participant cannot provide a response (there are no buttons shown on screen) - that's fine, since we just want them to watch and learn on these observation trials. I could also additionally set `response_ends_trial: false`, just to make it super clear in my code that I am not expecting a response. 
- Since participants can't provide a response, `trial_duration` determines how long each presentation lasts. 
- The `stimulus` parameter points to a particular image file, in the `images` folder, which you will see matches the directory structure I am using. Keeping your stimuli separate from your code keeps things nice and neat and is essential if you are building an experiment with hundreds or thousands of stimuli - you don't want to be scrolling through all of those hunting for a single javascript file every time you need to edit your code.
- I am using the `prompt` to show the label beneath the object. The Ferdinand paper shows the label *above* the object, but there is no built-in jsPsych plugin that does that, so rather than hacking about with the plugin code I am just showing the label underneath - editing the plugin to reposition the prompt is easy, but it surely doesn't matter whether the label is above or below the image so we'll stick with the jsPsych default!

This approach would work OK, but it has a couple of drawbacks. Firstly, the fact that the `observation_object4_only` trial doesn't have a `prompt` means that things will jump about a bit on the screen - the image will move up when the experiment reaches the trials with labels, to make space for the prompt, then drop down again when we are showing the object with no label, and all that movement is quite unpleasant to look at for the participant. This is actually easily fixed by including some *dummy text* as a prompt on the trials where we don't want any text in the prompt - then every trial has a prompt, and so things don't jump around on-screen so much. We could do that like this, using `&nbsp;` which is a special whitespace character in HTML that will give us a blank prompt:

```js
var observation_object4_only = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [],
  prompt: "&nbsp;", //dummy text
  trial_duration: 1000,
};
```
Note that just including `prompt: " "` doesn't work, we have to include some content there. 

The more important problem with this simple approach, as I have mentioned before, is that building this flat timeline is going to be very laborious and redundant for an experiment involving more than a few observation trials, and quite error prone (even just writing out this little example I forgot to change the `prompt` for the second trial from "buv" to "cal", which would be an important mistake in a frequency-learning experiment), and there is no easy way to randomise the trial list without hopelessly scrambling everything.

We can improve this a bit by using nested timelines to tie together the sub-parts of a single trial, like so:

```js
var observation_object4_buv= {
    type: jsPsychImageButtonResponse,
    stimulus: "images/object4.jpg",
    choices: [],
    timeline: [
      {
        prompt: "&nbsp;", //dummy text
        trial_duration: 1000,
      },
      { prompt: "buv", 
        trial_duration: 2000, 
        data: { block: "observation" ,
                label_observed: "buv"
        } },
    ],
};
```

For the second sub-trial I have also specified something for the `data` parameter - I am adding an extra `block` parameter and marking this trial as belonging to the `"observation"` block, so our observation trials will be easy to spot in the CSV data generated by the experiment. I am also adding a column called `label_observed` storing the actual label the participant saw, so that if necessary we can reconstruct their training data from their data file. We have used this same technique to annotate data in previous weeks.

That's conceptually neater, and I could create more trials (e.g. for the same object using the "cal" label) by copying this code, using it like a template, and changing the image filename and label each time. But everything else would stay the same. Creating a **function** lets us reuse that template. We give it an image filename and a label, and it creates a trial using those values. Here’s how we define the function:

```js
function make_observation_trial(object_filename, label) {
  var observation_trial = {
    type: jsPsychImageButtonResponse,
    stimulus: object_filename,
    choices: [],
    timeline: [
      {
        prompt: "&nbsp;", //dummy text
        trial_duration: 1000,
      },
      { prompt: label, 
        trial_duration: 2000, 
        data: { block: "observation" , 
                label_observed: label },
      },
    ],
  };
  return observation_trial;
};
```

This bit of code defines a function called `make_observation_trial`. Its two **parameters**, `object_filename` and `label`, are names for the values we will supply when we use it. Inside the function, we create a trial using those values. The line `return observation_trial;` gives the completed trial back to the code that called the function.

Defining the function doesn’t create any trials yet. To create one, we **call** the function: 

```js
var observation_trial_object4_buv = make_observation_trial("images/object4.jpg", "buv");

```

In this call, `object_filename` gets the value "images/object4.jpg" and `label` gets the value "cal". The function creates a trial using those values, returns it, and we store it in `observation_trial_object4_buv`. We can call the same function again with different values to create another trial.

```js
var observation_trial_object4_cal = make_observation_trial("images/object4.jpg", "cal");
```

Defining the function tells JavaScript how to make a trial. Calling the function asks it to make one. 

We are going to need several of these trials in training - let's say I want 3 buvs and 2 cals. I could just do this manually, by including `observation_trial_object4_buv` and `observation_trial_object4_cal` repeatedly in the experiment timeline, like this:

```js
var full_timeline = [
  consent_screen,
  instruction_screen_observation,
  observation_trial_object4_buv,
  observation_trial_object4_cal,
  observation_trial_object4_buv,
  observation_trial_object4_buv,
  observation_trial_object4_cal,
  ...
];
```

But it's easier and less error-prone to use the built-in function that jsPsych provides for repeating trials, `jsPsych.randomization.repeat`. This is another function that comes as part of the jsPsych package, and it takes two parameters: a list of trials that we want repeated, and a second list telling it how many repetitions we want of each of those trials (3 of the first one, 2 of the second), and then it generates and returns a list with those trials repeated the specified number of times in random order:

```js
var observation_trials = jsPsych.randomization.repeat(
  [observation_trial_object4_buv, observation_trial_object4_cal],
  [3, 2]
);
```
[The documentation for that repeat function is here](https://www.jspsych.org/v8/reference/jspsych-randomization/#jspsychrandomizationrepeat) if you are curious.

And that's our observation timeline built, with a quite compact and efficient bit of code. Now we need to build the production trials.

### Production trials

We will use some of the same tricks (a function that creates a trial with a nested timeline, adding a `block` property to the `data` so we can spot the production trials easily later), but also some new stuff to handle contingent trials.

Remember that each production trial consists of two steps: display the object plus two labels and have the participant select a label, then have the participant confirm their label choice with a further click in the middle. Step 1 is fairly straightforward, except that we want to copy Ferdinand et al. and randomise the left-right order in which the labels appear on each trial (this would also have been useful in the last couple of practicals, for the optional maze task exercise and for the word learning experiment). But step 2 is tricky - the label shown at the 2nd step of the trial needs to depend on what button the participant clicks on the 1st step.

Rather than dumping the final code in here I am going to talk you through it in the same way as for the observation phase, starting out with imagining how you'd do a single production trial as a sequence of two separate trials, then going from that to a single trial with a nested timeline.

Here's a simple way to implement the 1st step of a production trial - show the object plus two labelled buttons. Let's say we want to show object4 with the options buv and cal, to follow on from our observation phase above.

```js
var production_step1 = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: ["buv", "cal"],
  save_trial_parameters: {choices: true}
};
```

Note that we are using `save_trial_parameters` so that we can easily interpret `data.response` later - by default jsPsych tells us the index of the button the participant clicked, but not the button labels. 

That is very simple code for a production trial, but the labels will always appear in the same order - buv on the left, cal on the right. That might be a problem - maybe people will be biased to click on one side, or maybe this will encourage them to always click on the same side and given very self-consistent responses just because they are being lazy. So we want to randomise the order of the buttons, and we want to do this *independently* for every trial, so that sometimes buv is on the left and sometimes it's on the right.

There are a couple of ways you could do this in jsPsych. I am going to do it using the `on_start` property of trials. This allows us to specify some code to run when the trial starts but before anything is displayed on screen, and importantly the stuff that happens in `on_start` can alter the other trial properties. Specifically, initially we'll start off with empty `choices` (it will complain if we try to leave `choices` unspecified, so we have to set it to *something*) and then generate a random ordering of the labels in the `on_start`.

```js
var production_step1 = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [], //dummy choices initially
  save_trial_parameters: {choices: true},
  on_start: function (trial) {
    var shuffled_labels = jsPsych.randomization.shuffle(["buv", "cal"]);
    trial.choices = shuffled_labels;
  },
};
```

`on_start` expects a function with a single parameter, which is the trial specification. Inside `on_start` we shuffle the two labels, using another randomisation function provided by jsPsych, [jsPsych.randomization.shuffle](https://www.jspsych.org/v8/reference/jspsych-randomization/#jspsychrandomizationshuffle), which will randomise the order of items in a list we give it. We can then set the trial's `choices` parameter to that shuffled ordering (overwriting the dummy choices we started with) with the code 

```js
trial.choices = shuffled_labels;
```

So by the time the participant actually sees the choices on the screen, `on_start` will already have done its work and the two buttons will appear in a randomised order, and we will know what that order is because we are saving the choices using `save_trial_parameters`.

That will work, but we still haven't addressed the trickiest problem - how do we build the 2nd step of a production trial, where the label I select at step 1 is shown to me again for confirmation / to center my mouse? This is a pretty common thing to want to do - there are many experimental designs where you want to make behaviour at later trials depend on the participant's response, for example you might want to provide corrective feedback, repeat trials that a participant gets wrong, or (as in our case) show something that relates to their earlier response.

The way to do this is to store the info you need from one trial in its `data` property, then later on you can use some built-in jsPsych functions to look back at the earlier trial and read the information you need from the relevant bit of that `data`. We already know that button response trials automatically record the index of the button the participant pressed, in `data.response`, and we are saving the order of the button labels in `choices` using `save_trial_parameters`, so `data.choices` will contain the ordering of the labels. Then after the participant has made their selection (in `on_finish`), we'll use our knowledge of the order the buttons appeared and the info on which button they pressed to work out which *label* they selected, and record that in `data` too - we did the same thing last week in the word-learnign experiment for scoring trials. Then in step 2 we can just retrieve that information. So our step 1 trial would look like this:

```js
var production_step1 = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [], 
  save_trial_parameters: {choices: true},
  on_start: function (trial) {
    var shuffled_labels = jsPsych.randomization.shuffle(["buv", "cal"]);
    trial.choices = shuffled_labels;
  },
  on_finish: function (data) {
    var button_number = data.response;
    data.label_selected = data.choices[button_number];
  },
};
```

As per last week, we have added an `on_finish` function, which takes the trial `data`, looks up which button the participant pressed (`data.response`) and  combines that with the `data.choices` info to work out what label they selected (`data.choices[button_number]` will return the 0th label in `choices` if they clicked button 0, the 1st label if they clicked button 1, etc) and save *that* info in the trial `data` too, as `data.label_selected`.

Then the second step of the trial is fairly straightforward - when that trial starts (i.e. using `on_start` again) we can use a built-in jsPsych function to retrieve the `data` from the previous trial, then just read off the `label_selected` info we saved. That looks like this:

```js
var production_step2 = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/object4.jpg",
  choices: [], //dummy choices initially
  on_start: function (trial) {
    var last_trial_data = jsPsych.data.get().last(1).values()[0];
    var last_trial_label = last_trial_data.label_selected;
    trial.choices = [last_trial_label];
  },
};
```

The only slightly intimidating part of that is the first line of the `on_start` where we use `jsPsych.data.get().last(1).values()[0]` to access the last trial. `jsPsych.data.get()` is a jsPsych function that returns *all* the data from all trials so far, so we have to dig into it to get the last trial; that's what `last(1)` does - if you wanted to get the last 5 trials you could do that with e.g. `last(5)`. So that gives us the last trial, but that contains *a lot* of info we don't need so we dig out what we want using the `values()` function (I have no idea what all the other stuff saved there is to be honest), then that gives us a list of which we take the first item (which is what the `[0]` does), and at last we have our `data` from the last trial. In case you are wondering how I figured all that out: I didn't, it's in the [Dynamic parameters section](https://www.jspsych.org/v8/overview/dynamic-parameters/) of the jsPsych overview, I just copied it and worked from there. Anyway, once we have our last trial data we just retrieve the info we want (which we saved under `label_selected`), then we set the choices for *this* trial to that label and we are done. Phew.

Or nearly done. Of course doing every production trial as a sequence of 2 trials would be a pain, for all the usual reasons, so instead what we are going to do is wrap those two component trials up in a function that creates a complex trial with a nested timeline. But all the logic and the details are the same - we give the function the image and the label choices, and it builds us a complex trial. That's what is in the code below. I have made one tiny addition, which is to add some `block` information to the trial data for the crucial click-a-button part of this trial, just like I added `block` information to the observation trials above - this time I note that this is a production trial rather than an observation trial.

```js
function make_production_trial(object_filename, labels) {
  var production_trial = {
    type: jsPsychImageButtonResponse,
    stimulus: object_filename,
    timeline: [
      //subtrial 1: show the two labelled buttons and have the participant select
      {
        choices: [], //dummy choices to be over-written on_start
        data: { block: "production" }, //add a note that this is a production trial
        save_trial_parameters: {choices: true}, //and we want to save the trial choices
        //at the start of the trial, randomise the left-right order of the labels
        on_start: function (trial) {
          var shuffled_labels =
            jsPsych.randomization.shuffle(labels);
          trial.choices = shuffled_labels;
        },
        //at the end of the trial, use data.response to figure out
        //which label they selected, and add that to data
        on_finish: function (trial_data) {
          //console.log(trial_data) //if you want to see what the data looks like, uncomment this!
          var button_number = trial_data.response;
          trial_data.label_selected = trial_data.choices[button_number];
        },
      },
      //subtrial 2: show the image plus selected label, make the participant click that label
      //(to re-center their mouse)
      {
        choices: [], //dummy choices to be over-written on_start
        on_start: function (trial) {
          //get the last trial response (the data generated by the button-click)
          var last_trial_data = jsPsych.data.get().last(1).values()[0];
          //look up the label_selected on that last trial
          var last_trial_label = last_trial_data.label_selected;
          trial.choices = [last_trial_label]; //this is your only choice
        },
      },
    ],
  };
  return production_trial;
};
```

That is a fairly scary-looking bit of code, but hopefully you understand how the two sub-trials fit together now you have seen it built from scratch. If not, ask in labs!

At long last we can build our list of production trials using this function - I'll make 5 trials, to test participants 5 times on the label for object 4, which I can also do with `jsPsych.randomization.repeat`.

```js
var production_trial_object4 = make_production_trial('object4',['buv','cal']);
var production_trials = jsPsych.randomization.repeat([production_trial_object4], 5);
```

### Building a timeline using concat

The next bit of the code is the usual stuff with placeholders for consent and instructions, so I'll skip over that. The very final few lines of the code then build and run our timeline.

For this experiment, when we build the timeline we use a javascript function called `concat`, which will generate a nice flat timeline of the sort jsPsych expects. 

```js
var full_timeline = [].concat(
  consent_screen,
  instruction_screen_observation,
  observation_trials,
  instruction_screen_production,
  production_trials,
  final_screen
);
```

What that essentially says is "take an empty array (`[]`) and then concatenate (add) to it whatever is in the variables `consent_screen` `instruction_screen_observation`, `observation_trials`, etc.

You might be wondering why we can't do something like this, which has worked in the past:

```js
var full_timeline = 
[
  consent_screen,
  instruction_screen_observation,
  observation_trials,
  instruction_screen_production,
  production_trials,
  final_screen
];
```
The problem is that our variables we are sticking together includes a mix of individual trials (e.g. `consent_screen`) and *lists* of trials (e.g. `observation_trials`). So our trial timeline would in fact look like this:

```js
var full_timeline = 
[
  consent_screen,
  instruction_screen_observation,
  [observation1, observation2,...],
  instruction_screen_production,
  [production1, production2,...],
  final_screen
];
```
That is going to confuse jsPsych - it wants everything in the experiment timeline to be trial, so it can consult its `type` property and know what to do, and it doesn't know what to do when it gets to a *list* of trials - that list has no `type` parameter - so it throws an error complaining that it can't figure out the `type` of items in the timeline and breaks. We can get round this by using concat, which allows us to glue together a mix of individual trials and lists of trials in a way that makes our life easy but keeps jsPsych happy.

### Saving data

As per last week, when we finish (so using the `on_finish` parameter of `initJsPsych`, right at the top of the code) we are going to save the data to a csv file on the server. 

```js
var jsPsych = initJsPsych({
  on_finish: function () {
    var all_data = jsPsych.data.get(); //get all data
    var all_data_as_csv = all_data.csv(); //convert to csv format
    save_data("wordlearning_data.csv", all_data_as_csv); //save it
  },
});
```


## Exercises with the frequency learning experiment code

Attempt these problems. After the practical you will be able to consult [some notes on the answers](oels_practical_wk7_notes.md)

- It's possible to *filter* the data before saving it, e.g. grabbing only the trials where we marked `{block: "observation"}` or `{block: "production"}` - this is explained in Section 06 of Alisdair's tutorial, or you can look at [the jsPsych documentation on aggregating and manipulating data](https://www.jspsych.org/v8/overview/data/#aggregating-and-manipulating-jspsych-data). Can you figure out how to change the `on_finish` for `initJsPsych` so that it only saves the observation and production trial data to the server? You may have tried this last week too.
- How would you change the number of observation and/or production trials that participants receive?
- The code here is for the low-load linguistic version of the Ferdinand et al. (2019) experiment, with 1 object. How would you modify the code to do something with higher load, e.g. 2 or 3 objects, each with 2 labels? You could either do a blocked design (participants see several objects but the observation or production trials are organised such that all the trials for one object are together, then all the trials for the next object are together), or a fully-randomised presentation (i.e. you do all the observation trials, then all the production trials, but all the objects are interspersed randomly within each phase).
- Ferdinand et al. (2019) also have a *non-linguistic* version of the same experiment, where rather than words labelling objects participants observed coloured marbles being drawn from a bag (there were no fancy animations, it was just a picture of a marble above a picture of a bag), then produced some more marble draws themselves by clicking on buttons labelled with images of coloured marbles. You don't have to implement it unless you want to, but think about what sorts of changes would you need to make to the frequency learning code to implement this non-linguistic version - and if you want to implement it, you will find some marble and container images in the `images` folder. If you decide to try to implement it, you could look at the notes from last week's practical about how to get images on buttons; we'll see sother tools to achieve the same effect in next week's practical.
- [Optional, hard] Can you figure out how to use the `jsPsych.randomization.shuffleNoRepeats` function [documented here](https://www.jspsych.org/v8/reference/jspsych-randomization/#jspsychrandomizationshufflenorepeats) to do a version where observation and test trials for multiple objects are interspersed, but you never see the same object twice in a row? NB this will only work if you have 3+ different objects in the experiment - it's too hard for the code to find randomisations with no repeats if you have a small number of objects, and impossible if you only have one object, so the code will hang while  endlessly searching! Once you have attempted this, you can look at [my thoughts on how it could be done](oels_practical_wk7_norepeat.md).

## References

[Ferdinand, V., Kirby, S., & Smith, K. (2019). The cognitive roots of regularization in language.
*Cognition, 184,* 53-68.](https://doi.org/10.1016/j.cognition.2018.12.002)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
