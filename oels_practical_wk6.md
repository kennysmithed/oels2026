---
title: Week 6 practical
description: Nested timelines again, accessing trial data again, saving data
---

# The plan for week 6 practical

This week we are going to look at a bit more of the [Online Experiments with jsPsych tutorial](https://softdev.ppls.ed.ac.uk/online_experiments/index.html), then work on code for a simple implementation of the image-to-word condition from Chua & Pan (2026). We are going to use some techniques we covered last week, including nested timelines and accessing / adding to trial data to annotate our data and score participants on their accuracy; we will also save participant data at the end of the experiment, rather than just dumping it to the screen. **Note that saving the data at the end of the experiment is not the best way to do it and we do not recommend this for projects involving real data collection, e.g. your dissertation!** See the note on that below.

Remember, the idea is that you can work through these practicals in the lab classes and, if necessary, in your own time (e.g. if you want to make a start before the lab class, or if you don't complete the practical in the lab class) - the lab class provides dedicated time each week to focus on doing the practicals with on-tap support from the teaching team, but you may need more than the 2 hours to get these practicals done. We are happy to help with the previous week's class if you tried to finish it off in your own time and need some help.

Note that we are using the real stimuli from Chua & Pan (2026), which they very kindly made available online, via [https://osf.io/s8gvp/overview](https://osf.io/s8gvp/overview) - I have combined the images from their Target Word Images and Distractor Word Images into a single folder. 

# Tutorial content

Read through [section 06 of the Online Experiments with jsPsych tutorial](https://softdev.ppls.ed.ac.uk/online_experiments/06_data.html) - you will see the technique in the "Sending the data line by line" section in a few weeks, but no harm reading about it now. **You don't need to do the exercises dotted through that tutorial**, since we will see the same bits of code in the word learning experiment. The key things you need to take away from the tutorial are:
- You don't have to understand the details of how the POST and PHP stuff works to save the data, just that it's possible and it works.
- You can save data to the server either at the end of the experiment, which is what I have implemented in the word learning code, or after every trial (which we cover soon). **Saving data trial-by-trial is better**, so if you need to write code where you actually care about reliably getting the data (e.g. for a dissertation project) we recommend you use that method once we have shown it to you. Waiting to the end of the experiment to save the data can be risky, because if there's a technical glitch you might not get any data at all (and those glitches can happen frequently - e.g. we have had students who have had problems with this on Prolific, due to the method by which participants get redirected to Prolific after they complete your study, which interferes with saving the data). Plus if you save data trial-by-trial, then if a participant contacts you to tell you they got part-way through the experiment then their computer died you can actually verify this, pay them accordingly and also have some of their data. So the save-at-the-end method we are showing you today is inferior, but it's slightly simpler, and we are trying to introduce the complexity incrementally. 
- The `data` property of jsPsych trials. As you already saw last week, each trial has a `data` parameter which is populated by the code automatically depending on what the participant does during the trial - e.g. on an `html-button-response` trial it records the index of the button the participant pressed (0 for the first choice, 1 for the second choice, etc) in `data.response`. But we can also add to the `data` parameter ourselves - we can add information about the participant to every trial (e.g. their ID number), or we can add specific bits of data to certain trials (in the tutorial Alisdair gives the example of marking up trial type to allow you to separate 'boring' trials from important ones). In the word learning experiment we'll use the same technique to mark up important trials for later data filtering, but we'll also use the `data` property to record which label the participant clicked on (rather than just the button index, which is recorded automatically under `data.response`).

# A word-learning experiment

## First: you build it!

Following the same plan as last week, we want you to have a go at building a simple version of this experiment yourself - try that, ask us for help if necessary, then after 30-40 minutes we'll bring everyone together, see how you got on, and move on to the rest of the practical.

Once again, are going to provide you with a couple of templates to fill in - an html file that loads some of the plugins you will need (but once you decide what additional plugins you need you will have to figure out how to load them too), then a javascript file where you can put your own code. That javascript file includes some extra stuff (basic instructions) that we pre-built for you so you can focus on the more interesting parts of the experiment. 

You are actually going to need a bunch of files for this experiment - the html and javascript templates for your attempt (which we are calling `my_word_learning.html` and `my_word_learning.js`), the html and js file for my implementation (`word_learning.html` and `word_learning.js`), but also a folder of images to use as stimuli, a  `utilities.js` file (which includes the `save_data` function), a php file (for saving data), which we will use to save data. Rather than downloading these separately, download the following zip file and then uncompress it into your usual jsPsych folder, in a folder called something like `word_learning`, alongside your `grammaticality_judgments` and `self_paced_reading` folders. :
- <a href="code/word_learning.zip" download> Download word_learning.zip</a>

This code will run on your local computer, but you should upload the whole `word_learning` folder to the `public_html` folder on the jspsychlearning server and play with it there: the code that saves the data to the server will only work if your code is actually running on the jspsychlearning server, if you are running it on your own computer the data will not save anywhere. So if you haven't already got to grips with putting your code on the server, try it now and get help in the lab if you need it. 

If your directory structure is as we are suggesting the url for your experiment will be https://jspsychlearning.ppls.ed.ac.uk/~UUN/online_experiments_practicals/word_learning/my_word_learning.html where UUN is your UUN. 

If you want to see what the finished experiment will look like, you can run the `word_learning.html` file which includes our final implementation - the URL will be https://jspsychlearning.ppls.ed.ac.uk/~UUN/online_experiments_practicals/word_learning/word_learning.html, or [you can run my copy on jspsychlearning](https://jspsychlearning.ppls.ed.ac.uk/~ksmith7/online_experiments_practicals/word_learning/word_learning.html). 

If you run through my implementation of the experiment you'll see that, in addition to the usual instructions, the experiment consists of three stages: *training*, *multiple choice testing*, and *cued recall testing*. Training involves presenting words either through the guess-with-feedback method (where the participant sees a image, guesses the Spanish word and then receives feedback), or the simpler reading method (where they just see the image and its Spanish label). Multiple choice testing looks like the original "guess" step of the guess-with-feedback training trials - the participant sees an image and clicks on the matching label. Finally, cued recall testing involves seeing an image and free-typing the Spanish word.

I would suggest you start by trying to implement some training trials and multiple choice testing trials, and leave the cued recall for now (you can see how we do it below, it's slightly less obvious). You need to figure out what plugin(s) you need for observation and production trials (think about the stimulus and the response, if there is one), then look at [the documentation](https://www.jspsych.org/v8/plugins/list-of-plugins/) for that plugin to see how to use it and/or edit previous bits of code you have written that do something similar. The object images you need are in the folder `images`. Your code should go in `my_word_learning.html` and `my_word_learning.js`.

Remember, it's OK to implement this in a very simple way, with a long manually-constructed trial list if that's what you find easiest. Give it a go, see how you get on, and ask for help if/when you get stuck!

## Walk-through of our implementation

As you hopefully figured out when you were trying to build it yourself, the main part of the experiment uses a plugin you may not have used before (`image-button-response`), but you have used other `image` plugins (e.g. in the "hello world" exercise you used `image-keyboard-response` to display an image), and you have seen lots of `button-response` plugins (e.g. `html-button-response` for instruction screens).

The experiment features 4 main trial types:

- Guess-and-feedback trials: the participant sees an image and guesses the label, from a set of 4 options. 
They then see feedback showing the image and the correct label. *This looks like a reading trial.*
- Reading trials: the participant sees an image and the correct label, but they don't have to respond. *This looks like the feedback part of a guess-and-feedback trial.*
- Multiple choice critical test trials: the participant sees an image and guesses the label, from a set of 4 options. There is no feedback. *This looks like the guess part of a guess-and-feedback trial.*
- Cued recall critical test trials: the participant sees an image and a cue (e.g. "?-bridge") and types in the label. *This is quite different from the other trial types.*

For the last time, we are going to implement these trial types in a fairly redundant way, as a long-ish list of trials with quite a lot of duplication - then next week we'll show you my preferred way to make this more compact and less error prone, which is to write a function which provides a re-usable procedure for generating trials.

### Implementing guess-and-feedback trials

Each guess-and-feedback trial consists of two parts - the guess, where the participant sees the image and 4 possible labels, then the feedback, where they see the image and the correct label. Both of these involve showing an image, so we want a plugin designed to do that. The guess trials also involve buttons, so we want to use the `image-button-response` plugin for those. The feedback trials actually don't require a response, so we have a couple of options there (e.g. `image-keyboard-response` could work), but to make life easier we'll use `image-button-response` for those too. 

A simple implementation of a guess trial would look like this:

```js
var guess_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", //this is the picture of the truck
  choices: ["camion", "le&oacute;n", "granja", "cepillar"] //the 4 Spanish words to choose from
};
```

Hopefully nothing too mysterious happening here - the `stimulus` is an image from our `images` folder (generally I'd prefer more transparent image names!), the `choices` are the correct Spanish word plus three foils (incorrect response options - note that one of them involves a character with an accent, which is quite ugly to produce in HTML). Next week we'll see how to randomise the order of response choices automatically, but here they are in a hard-wired order.

The feedback trial is actually a little more complex to code, despite looking simpler on screen, because we have to set up a no-response, fixed-duration trial. We will use the same plugin as for the guess trial, and use the `prompt` parameter to present the correct label. We can make a no-response button-response trial (!) by just setting `choices` to an empty list of options, like this:

```js
var infinite_feedback_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", //this is the picture of the truck again
  prompt: "camion", //the correct label
  choices: [] //no response possible!
};
```

However, that trial has no way of ending - it waits forever for a response that cannot be given! So additionally we add a set `trial_duration`. Slightly superstitiously, I also use the `response_ends_trial` parameter to ensure that the participant can't end the trial - there are no choices they could click on, so this may not be necessary, but it also makes it nice and clear in the code that I am not expecting a response.

```js
var feedback_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", //this is the picture of the truck again
  prompt: "camion", //the correct label
  choices: [], //no response possible!
  response_ends_trial: false,
  trial_duration: 5000
};
```

That will do the job, and if I inserted these two trials one after the other in my experiment timeline, I would get the desired effect. But as per last week, we can use a *nested timeline* to reduce the redundancy a little bit, and tie a guess trial and its associated feedback into a single timeline unit - in the main trial we specify the repeating features of the two trials (they use the same plugin type and present the same image stimulus), then in the nested timeline we specify the things that differ across trials.

```js
var guess_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", //this stimulus will be shown for every trial in the nested timeline
  timeline: [
    {
      //guessing trial - choose the word
      choices: ["camion", "le&oacute;n", "granja", "cepillar"],
    },
    {
      //feedback trial - see the correct word, no response possible!
      prompt: "camion",
      choices: [],
      response_ends_trial: false,
      trial_duration: 5000
    },
  ],
};
```

We are going to return to this implementation later, to add some data annotation and automatic scoring of trials, but first we'll show you how to implement the other trial types. 

### Implementing reading trials

Implementing the guess-and-feedback trials actually solves several other problems for us, because the sub-parts of the guess-and-feedback trials look like the multiple-choice critical test and reading trials respectively. So for the reading trials (the "other" kind of passive training trial), all we need to do is show the image and Spanish word for a fixed duration, and our feedback trial above does exactly that. So we can just reuse that code!

```js
var reading_ear_oreja = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_35.jpg", //this is the name of the file containing the ear image!
  prompt: "oreja",
  choices: [],
  response_ends_trial: false,
  trial_duration: 5000
};
```

Now we can create a training phase that involves a mix of guess-and-feedback and reading trials by just putting these trials together in the desired order - next week we'll show you how to automatically randomise trial order, but for now we are hard-wiring in the trial order in the experiment timeline:

```js
var full_timeline = [
  consent_screen,
  training_instruction_screen,
  guess_truck_camion,
  reading_ear_oreja,
  ...
];

jsPsych.run(full_timeline);
```

### Implementing multiple-choice critical test trials

After the training phase, the participants go through two tests to assess what they have learned: a multiple-choice test, and a cued recall test. The multiple choice test involves showing them an image and having them select the appropriate Spanish word from 4 options - and again, we have already implemented this for the guess part of guess-and-feedback trials, so we can just re-use that implementation.

```js
var critical_test_mc_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg",
  choices: ["dedos", "camion", "altavoz", "arana"],
};

var critical_test_mc_ear_oreja = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_35.jpg",
  choices: ["oreja", "iceberg", "hada", "le&oacute;n"],
};
```

And we create the multiple-choice portion of our timeline by sticking together several of these trials:

```js
var full_timeline = [
  ...
  multiple_choice_instruction_screen,
  critical_test_mc_ear_oreja,
  critical_test_mc_truck_camion,
  ...
];
```

### Implementing cued recall critical test trials

The cued recall tests are a bit trickier to implement, because there's not a perfectly-matching jsPsych plugin (as far as I can see) - but we can get the effect we want with a little bit of trickery. The key thing here is the response - we want a text-box response where the participant types the correct label, which means we will end up using some kind of survey plugin, which is the easiest way to achieve this. The `survey-text` plugin we used last week for simple demographic questions actually provides this functionality. But then the other parts of the trial pose a bit of a problem - if I consult Figure 2 in Chua & Pan (2026) it looks like I want an image plus some text (including the English word) above the text box. How to achieve this using the `survey-text` plugin?

A quick look at [the plugin documentation](https://www.jspsych.org/v8/plugins/survey-text/) and the associated demo provides some inspiration. As we saw last week, the `survey-text` plugin allows us to present a list of questions, and for each question we can specify a `prompt` which will appear above the text box. So we could easily stick our English label in there. But how do we include the image too? The examples in the plugin documentation show a case where an image is included in the `preamble` (a bit of HTML that appears before the list of questions) using an `<img>` tag, so we could just copy that:

```js
var critical_test_cr_truck_camion = {
  type: jsPsychSurveyText,
  preamble: "<img src='images/PICTURE_535.jpg'>",
  questions: [
    {
      prompt:"?-truck",
    },
  ]
};
```

That is what I tried first when I was implementing this myself and it actually works, but it looks a little weird, because there's a big gap between the `preamble` and the single question `prompt`. So I experimented with just sticking the image in the `prompt`, which also works and looks a little better, so that's what I went with - the only extra trick is to add a `<p>` pargrapg tag around the text so that it appears on a seperate line below the image.

```js
var critical_test_cr_truck_camion = {
  type: jsPsychSurveyText,
  questions: [
    {
      //complex prompt - image and text cue
      prompt:
        "<img src='images/PICTURE_535.jpg'>\
      <p>?-truck</p>",
    },
  ]
};

var critical_test_cr_ear_oreja = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt:
        "<img src='images/PICTURE_35.jpg'>\
      <p>?-ear</p>",
    },
  ]
};

var full_timeline = [
  ...
  cued_recall_instruction_screen,
  critical_test_cr_truck_camion,
  critical_test_cr_ear_oreja,
  ...
];
```

### Annotating data and scoring trials automatically

As per last week, we are actually going to add some code to each of the trial types laid out above, to tag the important trial types, automatically score the participants' response, and add this information to trial `data`. To refresh your memory: last week we did this by adding `exp_trial_type` and `score` fields to the trial `data`, like this:

```js
var spr_trial_1 = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  timeline: [
    //...same as before for self-paced reading trials
    {
      stimulus: "Did the reporter see what happened?",
      prompt: "<p><em>Answer y or n</em></p>",
      choices: ["y", "n"],
      data: { exp_trial_type: "comprehension" },
      on_finish: function (data) {
        if (data.response == "n") { 
          data.score = 1;
        } else {
          data.score = 0;
        }
      }
    },
  ],
};
```

We'll do something similar here, but it's a little more complex because we are using button-response or text-box responses, which require a little more work to score neatly. Let's start with the multiple-choice guess-and-feedback training trials - I'll show you how we handle these, and the multiple choice critical test items work in the same way (you can consult the code directly).

Prior to adding code to mess with `data`, our code for one of these trials looks like this:
```js
var guess_truck_camion = {
  type: jsPsychImageButtonResponse,
  stimulus: "images/PICTURE_535.jpg", //this stimulus will be shown for every trial in the nested timeline
  timeline: [
    {
      //guessing trial - choose the word
      choices: ["camion", "le&oacute;n", "granja", "cepillar"],
    },
    {
      //feedback trial - see the correct word, no response possible!
      prompt: "camion",
      choices: [],
      response_ends_trial: false,
      trial_duration: 5000
    },
  ],
};
```

This code will produce a `data` object, but it's not very helpful - it includes the stimulus, and `data.response` includes a number giving the *index* of the button the participant clicked - 0 for the 1st button, 1 for the second button, and so on (javascript counts from 0 rather than 1!). Slightly weirdly in my opinion, jsPsych doesn't automatically record the `choices` parameter to `data`, so we would have to do some extra work to interpret `data.response` and score the trial. One option would be to just hard-wire in the correct response - here I can see that the correct response is the first button, so if `data.response` is 0 then they have clicked the correct button. But this approach is quite limited and will break when we want to *randomise* the button order, which we will do next week, so we'll do something more complex - we will save the `choices` to `data`, and a note of what the correct label on this trial is, then we'll score based on the choices, the response, and the information on the correct label.

The first step is to add some information to the trial `data`, which we do by initialising the trial data with an `exp_trial_type` and a note of the `correct_word`. We also use a built-in option provided by jsPsych to tell it to save the trial choices - the code that does this is `save_trial_parameters: { choices: true }` which tells it to save the choices parameter (and if there was another parameter you wanted to save, you could use the same method). Here's how those bits slot into our code.

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
      ...
    },
    {
      //feedback trial - see the correct word, no response possible!
      ...
    },
  ],
};
```

Now when the participant finished the trial, the `data` object will include `data.response` (the index of the button the clicked), but also `data.choices` (the button labels, in the order the participants saw them) and `data.correct_label (the correct label obviously). Now we can score the trial, using `on_finish` in the same way as we did last week. Here's the code, I'll talk you through it below.

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
        var button_number = data.response; //this is the *index* of the button they clicked
        var word_selected = data.choices[button_number]; //look up that button in choices to see what word they clicked
        data.response_word = word_selected; //record the word they clicked in the trial data
        //then score the trial by comparing the word they selected with the correct word
        if (word_selected == data.correct_word) {
          data.score = 1;
        } else {
          data.score = 0;
        }
      },
    },
    {
      //feedback trial - see the correct word, no response possible!
      ...
    },
  ],
};
```

In the `on_finish` we work through the following steps:
- we look at `data.response` which gives us the button index of the response. We store this in a new variable called `button_number` for convenience.
- we can now use `data.choices` and `button_number` to work out the label on the button the participant clicked - `data.choices[button_number]` is the javascript code to retrieve the item at `button_number` from the list `data.choices`. We store this in a new variable called `word_selected` for convenience.
- We store that `word_selected` in the trial data, with the line `data.response_word = word_selected;` - now there will be a column in our data frame called `response_word` that includes the word the participant selected, much more useful than just the button index!
- Finally we use an `if ... then` conditional to score the trial: if `word_selected` is the same as `data.correct_word` we score the trial as correct, and add `score=1` to the trial data.

That's it for scoring these multiple-choice trials - and we can do the same in the multiple choice critical test trials.

Scoring the free-test cued recall test trials works in a similar way. We don't have to save the order of the buttons, because there are none, but we do have to dig a little bit into the trial `data` to get out the participant's resopnse - `survey-text` trials might potentially have multiple questions, so the `response` data they generate includes a list of responses rather than a single response. Here's the code:

```js
var critical_test_cr_truck_camion = {
  type: jsPsychSurveyText,
  questions: [
    {
      //complex prompt - image and text cue
      prompt:
        "<img src='images/PICTURE_535.jpg'>\
      <p>?-truck</p>",
    },
  ],
  data: {
    exp_trial_type: "critical_cued_recall", //mark this as a "critical_cued_recall" trial
    correct_word: "camion",
  },
  on_finish: function (data) {
    var word_typed = data.response.Q0; //dig out the participant's response 
    data.response_word =  word_typed; //add it to trial data
    //then score the trial by comparing the word they typed with the correct word, as before
    if (word_typed == data.correct_word) {
      data.score = 1;
    } else {
      data.score = 0;
    }
  },
};
```

As before, we add some stuff to the `data` parameter (`exp_trial_type` and `correct_word`), but the real action is in the `on_finish`. Here we do the same thing, creating a new variable (called `word_typed`) to store the participant's response and then scoring the trial by checking if that response matches `data.correct_label`. The only different is in how we access the response. The code is:

```js
var word_typed = data.response.Q0;
```

That's actually 2 steps to get the response. For `survey-text` trials, `data.response` returns a *list* of responses, one per question in the survey - our survey only has a single question, so this isn't necessary here, but it would be if our survey was more complex, and the plugin code is written to handle the more general case. So in order to access the response to the first question specifically, we dig deeper - `data.response.Q0` says "go into `data`, get the `response`; go into the `response`, get the thing labelled `Q0`" which is where our response is. If the survey had 3 questions, `data.response` would include `Q0`, `Q1` and `Q2`. Now we have retrieved our participant response, we store it in our variable `word_typed`, add it to the trial's `data` (so it appears in our data frame at the end), and score the trial as before.


### Saving data at the end of the experiment

When our participant finishes the experiment we want to save their data, so we are now going to add some infrastructure for doing that. You will notice that the bundle of code you downloaded includes a file called `utilities.js`, which is loaded in `word_learning.html`:

```html
        <script src="utilities.js"></script>
        <script src="word_learning.js"></script>
```

That `utilities.js` file includes a function called `save_data` (copied directly from section 06 of Alisdair's tutorial code) that we will use to save data - since it's a function we use with every experiment and it's basically always the same it makes sense to me to separate it off and save it in a file I can treat as a black box and forget about. The `save_data` function in turn relies of some other (very complicated!) code to safely save the data on the server, and avoid naughty people on the internet writing other kinds of unwanted information on the server - this code is written in another different language called PHP, and is in the file `save_data.php`. You definitely don't need to worry about the details of the code in this file but you do need to make one tiny edit, so that it save data in *your* `server_data` directory. So open `save_data.php` in your usual code-editor, jump to line 9:

```php
$dataDir = '/home/ksmith7/server_data'; //replace with your own UUN!
```

and swap my UUN (ksmith7) for yours. Save that, close the file, and you are done. 

Now we have the infrastructure in place, we can tell our experiment code to save the data. For now we are going to save the data at the end of the experiment - it's better to save data trial-by-trial, and we'll cover that eventually, but this is a simpler place to start. So using the `on_finish` parameter of `initJsPsych`, right at the top of the code, we are going to save the data generated by the experiment to a csv file on the server. There are three new lines of code to do that.

```js
var jsPsych = initJsPsych({
  on_finish: function () {
    var all_data = jsPsych.data.get(); //get all data
    var all_data_as_csv = all_data.csv(); //convert to csv format
    save_data("wordlearning_data.csv", all_data_as_csv); //save it
  },
});
```

That uses two jsPsych functions to get the trial data, concert it to CSV format, then finally we use the `save_data` function to save that data to the server in a file called  `wordlearning_data.csv` - if you run the code on the jspsychlearning server you should see there is a file called `wordlearning_data.csv` in the folder called `server_data`, which is at quite a high level in your directory structure (you might have to jump up a few levels in the directory structure to find that folder). Note also that cyberduck doesn't automatically refresh the list of files when a new file is added, so you may have to click the "Refresh" button to see your data file. Every time you run the code it will append more data to that file, so if you have run the code a few times it might look quite messy! 



## Exercises with the word learning experiment code

Attempt these problems. After the practical you will be able to consult [some notes on the answers](oels_practical_wk6_notes.md), but this link won't function until after the class - as usual, we want you to try this stuff yourself!

- Run the code on the server once and look at the `wordlearning_data.csv` file to make sure it makes sense to you. If you have already run the code several times that file might be quite messy, in which case you can delete it and run the code again to get a cleaner view. 
- Run the code several times and look at the `wordlearning_data.csv` file - you might have to refresh it on cyberduck to see the latest data. Make sure you understand what happens to this data file every time you run the code. If you had multiple participants doing this experiment, what would you *like* to happen (to make your life easy in deadling with your experiment data), and how would you achieve that? You don't have to write any code, just think about the outcome you would like to achieve and what it would require.
- How would you add extra trials to this code, i.e. additional training and testing trials? You can hunt about in the `images` folder, in conjunction with a translation app or an English-Spanish dictionary, to get some inspiration for Spanish words to use in training and testing.
- This code actually implements Experiment 2 of Chua & Pan (2026), where participants receive multiple-choice and cued-recall critical tests in blocks (all of one test type, then all of the other). How would you implement the version of the experiment where the critical test types are randomly intermingled?
- It's possible to *filter* the data before saving it, e.g. grabbing only the trials where we marked `{exp_trial_type: "guess"}` or `{exp_trial_type: "reading"}` etc - this is explained in Section 06 of Alisdair's tutorial, or you can look at [the jsPsych documentation on aggregating and manipulating data](https://www.jspsych.org/v8/overview/data/#aggregating-and-manipulating-jspsych-data). Can you figure out how to change the `on_finish` for `initJsPsych` so that it only saves the data from "interesting" trials to the server?
- How would you start to change this code to implement the word-to-image version of the experiment, rather than the image-to-word version? Think about what you would need to change conceptually to achieve this, and then [optional, challenging!] whether you can find a way using techniques you have seen today to achieve this - we'll come back to this next week!




## References

[Chua, T. J. E., & Pan, S. C. (2026). Duolingo-inspired pretesting with words and pictures improves vocabulary learning. *Cognitive Research, 11,* 20.](https://doi.org/10.1186/s41235-026-00708-y)

## Re-use

All aspects of this work are licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
