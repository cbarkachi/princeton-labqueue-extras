# LQSound
For use with labqueue.io - allows the user to choose a sound that will play each time a student is added to the queue, either when they first log on or are added through a "reopen." Also allows enabling browser notifications that navigate back to the queue. Configuration options appear below the queue table.

## @labTA's
Feel free to modify the source code, especially if you know Javascript! I just learned JS/CSS this week to write this so I'm positive there are more efficient ways of doing things. Notably, because I only have access to the HTML breakdown of the site, I chose to run the main alg by just doing a simple text search of the table for the number of "CLAIM" substrings.

# INSTRUCTIONS TO USE
## Chrome:
Download lqsound.user.zip, navigate to chrome://extensions/, turn on "Developer Mode" (top right corner) and drop the zip file anywhere onto the page. Feel free to turn developer mode off again.
### Edit:
I've been told this doesn't work for some people. If this is the case for you, try unzipping lqsound.user.zip file and uploading it with the "Load unpacked" button.
## Firefox
Download Greasemonkey and use lqsound.user.js script as the source file.
## Other browsers
Similar solution to Firefox except with different extensions to handle running the script. On Chrome and Microsoft Edge, there's an extension called Tampermonkey that basically does the same thing. On Safari, there's SIMBL/GreaseKit (not sure how these work).
