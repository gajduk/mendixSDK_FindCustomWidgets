# Find Custom Widgets with Mendix SDK
Lets you keep track of the number and places in your mendix app were custom widgets are used.

Installation instructions.
-----------------

Requirements: 
  1. Node.js
  2. Meteor

After cloning or downloading the repository you need to install the additional dependencies.
Move to the root directory of the project and run:
```
meteor npm install
meteor add themeteorchef:jquery-validation
```
You can then run the app simply by typying

``meteor``

Usage
----------------
In order for the Mendix SDK to access your project you need to specify three things:
  1. Your email adress, which you use to log in to the Mendix platform
  2. An API key which you can generate from the Settings page for your Mendix profile. If you are worried about security you can revoke API keys after they are used.
  3. The Project ID which you will find in the Settings page for the project. Obviosly you have to have access rights to that project.

Then simply click on Connect, and wait for the magic to happen. 
Note that the main limit on the speed is the Mendix SDK API itself which creates a local working copy of the project before exposing it for access. 
There is very little actual processing by this app.

Implementation and nomenclature
------------------

The Meteor APP scans all *Units* in your project where a *Unit* is  by Mendix SDK definition

> A model unit is a leaf (not a node) in the project tree and the root containing model elements.

In English, a *Unit* is everything inside your project that is not a container-like (e.g. Folder or a Module).
By traversing individual *Units* you can find all elements within a Page or a Microflow, for example. Custom widgets are, not suprisingly, recognized by their type ``CustomWidget``.
Everytime a Custom Widget is found in a Unit, this is counted as a *Direct Usage*.

When a custom widget is found inside a Snippet or a Layout Unit, this app also then resolves on how many (and which) pages these elements are used.
This count + the number of direct usage, constitutes the column *Indirect Usage*.

Note that the app will resolve multilevel snippets, e.g., a CustomWidget within a Snippet within another Snippet within a Page, and also a CustomWidget within a Snipet within a Layout.

Mendix SDK
------------------

You can see from the packages.json file that this app uses the following version of Mendix SDK.

```
"mendixmodelsdk": "~2.9.1",
"mendixplatformsdk": "~2.0.0",
```

If you are interested in Mendix SDK you can read more at https://developers.mendix.com/sdk/

Meteor
-------------

Meteor is a great framework to develop Node.js based apps with a nice UI quickly https://www.meteor.com/
