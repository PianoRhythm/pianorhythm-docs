# PianoRhythm Changelog

<!----------------------------------------------->
## 0.9.9 (2024-05-07)

#### :rocket: New Features
  - **VirtualPiano Sheet Music Player** ([PRFP-463]) Added a basic virtual piano sheet music player! Find out more here: [VirtualPiano Sheet Music Player](/guides/midi-player/vp-sequencer/)
  <img src="/img/guide/midi-player/461e41788b0be39c6df1407996ec3419.gif" style={{marginLeft: '30px'}} alt="vp-sequencer" width="500"/>

{/* truncate */}

  - **Guests Can View Sheet Music Repo** Guest can now view the sheet music repository. They can't upload sheet music, but they can view the list of sheet music available. You can find it at `Tools -> Open Sheet Music Repo` or the `Sheet Music` button on the bottom bar.
  <img src="/img/changelogs/7c8e3f01886679528e60312795b43ae7.gif" style={{marginLeft: '30px'}} alt="sheet music repo" width="500"/>

  - ([PRFP-1146]) Added more general analytics/stats about the app. You can find it on the bottom bar as `Leaderboards`.
  <img src="/img/changelogs/81cf7c44ab8153a44091733bafa62c00.gif" style={{marginLeft: '30px'}} alt="graph stats" width="500"/>

  - ([PRFP-1221]) Added icons to represent the main sources of midi input by users: `PC Keyboard`, `Midi Piano`, and `Mouse`.
  <img src="/img/changelogs/fda5e71948308019d98f4346ba11f732.gif" style={{marginLeft: '30px'}} alt="note icons" width="200"/>

  - ([PRFP-1219]) Added a cookie consent form. You can find it at the bottom of the page. This is to comply with the EU's GDPR regulations.
  <img src="/img/changelogs/017e67675e7a434f0e307959ba89f007.png" style={{marginLeft: '30px'}} alt="cookie consent form" width="500"/>

  - ([PRFP-1068]) Added a search bar in many of the settings. Now it should be easier to find what you're looking for.
  <img src="/img/changelogs/aa7b05f9a4989b1c6d0f04ffc0cdf83f.gif" style={{marginLeft: '30px'}} alt="search bar" width="500"/>

  - ([PRFP-1223]) Added support for an extended layout for VP. You can find it at `Settings -> Input -> MIDI to VP/QWERTY Layout`.
  <img src="/img/changelogs/midi_to_qwerty_piano.png" style={{marginLeft: '30px'}} alt="search bar"/>

  - ([PRFP-1097]) Added keyboard mapping overlays for 3D and 2D. You can toggle by pressing `F6` or going to the action widgets on the right and pressing `Show Input Mapping`.

  - ([PRFP-1192]) Added a button to export logs for the desktop app. You can find it at `Settings -> Application -> Export Logs`.

#### :smile: Enhancements
  - ([PRFP-936]) Reduced latency between keyboard input and sound output. The audio processing will use the main thread by default. The drawback is that it's more susceptible to instability spikes (may hear more static if there's too much load). You can toggle this in the settings by going to `Settings -> Soundfont -> Use AudioWorklet for audio processing`.
  - ([PRFP-1202]) The client has gone through a major refactor. This should help with performance and stability.
  - ([PRFP-1184]) Added a `Copy` button to the sheet music viewer.
  - ([PRFP-1207]) Added a progress bar when downloading soundfonts.
  - ([PRFP-1208]) Added a setting to toggle the audio equalizer.
  - ([PRFP-1213]) Added a new soundfount: `SGM-v2.01-NicePianosGuitarsBass-V1.2`
  - ([PRFP-1217]) Added a graphics setting for soft shadows.

#### :bug: Bug Fixes
  - ([PRFP-1209]) Fixed issue with the 2D piano sometimes getting clipped on the edge of the window.
  - ([PRFP-1203]) Fixed an issue with server banning.
  - ([PRFP-1161]) Fixed the padding/spacing in the user profile "About" section text.
  - ([PRFP-741]) Fixed an issue with youtube links with parameters not getting parsed correctly.
  - ([PRFP-1204]) Fixed emails not being saved properly for new registrations.
  - ([PRFP-1215]) Fixed an issue with urls not being parsed correctly in chat due to server censorship.

<!----------------------------------------------->
## 0.9.0 (2023-12-31)
You can find out more about this update here in the blog: [Server Upgrade](/blog/update_2023/)

{/* truncate */}

#### Versions
  - Notes:
    - If you're encountering any issues when creating a new room, try clicking the "Reset" button in the room creation settings. (Credit: @sun queen#61facd)

  - `Version: 0.9.8` (2024-01-10)
    - #### :rocket: New Features
      - ([PRFP-1197]) Added two new lobbies: Forest and Studio! [Forest Stage](https://i.gyazo.com/ec010869e6adfb956342cb8d18f31f2a.gif)
      - ([PRFP-1198]) Added volume slider for stage audio effects.
    - #### :smile: Enhancements
      - ([PRFP-1196]) Upgrade Tauri (Desktop client) to v1.5.4
    - #### :bug: Bug Fixes
      - ([PRFP-1199]) Fixed a potential issue with Discord login causing a failure to load on desktop.

  - `Version: 0.9.7` (2024-01-07)
    - #### :bug: Bug Fixes
      - ([PRFP-1193]) Fixed issue with chat history deletion in normal rooms.
      - ([PRFP-1195]) Fixed issue with clearing profile description not working.
      - ([PRFP-1191]) Fixed issue with new Discord users not automatically registering a new account.
      - ([PRFP-1190]) Fixed issue with input for `edit_badges` command.
      - ([PRFP-1194]) Fixed `/clear_chat` command for mods.
    - #### :smile: Enhancements
      - ([PRFP-1186]) All active instruments are shown in the mini user profile.


  - `Version: 0.9.6` (2024-01-07)
    - Note: _You have may have to fully clear your cookies and relogin, if you're having issues logging in with this update._
    - #### :bug: Bug Fixes
      - ([PRFP-1188]) Fixed certain commands not using the full username.
    - #### :smile: Enhancements
      - ([PRFP-1187]) Added a new role: Trial Moderator.

  - `Version: 0.9.5` (2024-01-06)
    - #### :bug: Bug Fixes
      - ([PRFP-1182]) Sheet music repo service should be back up now. Note: _You have may have to clear your cookies and relogin again if you get an error trying to access it._
      - ([PRFP-1183]) (Server) Lobby chat messages should now persist after deployments.

  - `Version: 0.9.3` (2024-01-02)
    - Minor bug fixes for the front and backend.

  - `Version: 0.9.1`
    - ([PRFP-1179]) Sound fx not working on initial load.
    - ([PRFP-1177]) Users can't join password protected rooms.


<!----------------------------------------------->
## 0.8.46 (2023-09-29)
#### :rocket: New Features
  - **Added Self Hosting Rooms!** ([PRFP-1149]) Added the ability to host your own rooms! Find out more here: [Self Hosting Rooms](/tutorials/tutorial-self-host-rooms/)

{/* truncate */}

#### :smile: Enhancements
  - ([PRFP-1158]) Room creation settings are now saved locally so you don't have to keep redoing the inputs when creating a room. So this means that when you reload the page and you were the room owner, then it'll be created with the same settings (including password). _(note: the room password is also saved as plain text in the object in the local storage so I don't recommend using a password you using for other accounts)_
  - ([PRFP-1166]) Gave good ol' @Near#80366e the `V2 OG MEMBER` badge that he's been waiting for, since forever. :)
  - ([PRFP-1155]) Added a lobby just for PRO subscribers.
  - To help with server bandwidth, if you're by yourself in a room, then no midi data will be emitted to the server (why didn't I think of this before?). Therefore, regardless of the room settings, note quota will not be a factor.

#### :bug: Bug Fixes
  - ([PRFP-1169]) Fixed issue with logging in by email.
  - ([PRFP-1159]) Fixed an issue with Orchestra mode rooms (such as the lobby) not showing other player pianos.
  - ([PRFP-1157]) Fixed a UI issues where the lock icon was not immediately shown when muting a user.
  - ([PRFP-1160]) Fixed user meta details (on the mini profile when you hover over a user) not immediately showing.
  - ([PRFP-1167]) Fixed an issue where the app would get "stuck" when trying to enter a room with password in a new session. An "enter room password" modal should now show up.

<!----------------------------------------------->
## 0.8.45 (2023-09-23)

No real enhancements mades to the client. Really just some minor things to accomodate some backend changes.

<!----------------------------------------------->
## 0.8.44 (2023-09-20)

#### :smile: Enhancements
  - Refactored the back end server by updating some dependencies and configurations. Should (hopefully) be less laggy now.

#### :bug: Bug Fixes
  - ([PRFP-1117]) For PC keyboard players, fixed issue with shift not keeping held notes.
  - ([PRFP-1132]) Fixed issue with account verification page not being found.
  - ([PRFP-1130]) Fixed issue with the wrong username showing when a new user joins chat.

#### :soon: Coming soon
  - ([PRFP-1137]) Fix whisper function.
  - ([PRFP-1125]) Add Midi Repo.
  - ([PRFP-1115]) Add "Achievements."
  - ([PRFP-1139]) Add the ability to record playing to midi tracks.
  - ([PRFP-1138]) Add the ability to "loop/auto-replay" midi tracks

<!----------------------------------------------->
## 0.8.43 (2023-09-12)

#### :smile: Enhancements
  - ([PRFP-1116]) Discord Bot _should_ show current players online in its status.
  - Added more general stats (total notes & chat messages sent). You can see them in the leaderboards. Note: These are new metrics that wasn't previously being tracked, so everyone is starting from 0. Also, these particular metrics are only _updated after you logout_. So, they're not real time.

#### :bug: Bug Fixes
  - Fixed an issue with users not being able to sign in with Discord.

<!----------------------------------------------->
## 0.8.42 (2023-09-11)

#### :smile: Enhancements
  - ([PRFP-1111]) Show user mini profile when hovering over usernames in the leaderboard.
  - ([PRFP-1109]) View your favorites list in the sheet music repo.
  - ([PRFP-1108]) Added the ability to unbind single keybinds from the custom keyboard layout mapping.

<!----------------------------------------------->
## 0.8.41 (2023-09-10)

#### :smile: Enhancements
  - ([PRFP-1106]) Added system status reports to client. PianoRhythm now has a [StatusPage](https://pianorhythm.statuspage.io/). You'll be able to find out the current state of the server.
  - ([PRFP-515]) You can now "favorite" sheet music in the repository. With that said, a leaderboard of the most favorited sheet music has also been added.

#### :bug: Bug Fixes
  - ([PRFP-1090]) Fixed issue midi sequencer not starting in web version due to suspended audio context.
  - Fixed `Orchestra Mode` not showing up in the room modes when creating a new room.

<!----------------------------------------------->
## 0.8.40 (2023-09-09)

#### :rocket: New Features
  - **Added Rusty Synth** ([PRFP-1101]) You can now change between different audio synthesizers. The default one has been called [OxiSynth](https://github.com/PolyMeilex/OxiSynth) and it's not perfect when it comes to how it handles certain soundfonts. [RustySynth](https://github.com/sinshu/rustysynth) seems to do it better. However, there are certain features (such as setting the max polyphony) that I haven't implemented within it, yet. <br/> To change the synthesizer, you can go to `Settings -> Soundfont -> Audio Synthesizer`.<br/>

{/* truncate */}

  - **Added Leaderboards** ([PRFP-1105]) Added leaderboards about general stats. More boards will be added over time. You can find it on the bottom bar as `Leaderboards`.

#### :smile: Enhancements
  - ([PRFP-913]) Emails will not be parsed (as mailto:*) in chat.
  - ([PRFP-1102]) Increased min/max supported transpose to -20/20, respectively.
  - Updated the 3D graphics engine [Babylon.js](https://www.babylonjs.com/) to version 6.20.1.
  - Some backend server refactoring.

<!----------------------------------------------->
## 0.8.39 (2023-09-05)

#### :rocket: New Features
  - **Added 2D Mode** ([PRFP-1082]) After much contemplation, I've decided to add support back for a 2D renderer of the piano. You can toggle between 2D/3D (without having to restart) by clicking on the button that says `Camera Mode` in the button groups at the top right. _Note: Certain features such as the Midi Player are not available in 2d mode, until further notice._

{/* truncate */}

#### :smile: Enhancements
  - ([PRFP-1094]) Added room option for enabling/disabling bots in the room.
  - Backend server refactoring.

#### :bug: Bug Fixes
  - ([PRFP-1099]) Fixed issue with feedback loop with midi i/o.
  - ([PRFP-1098]) Fixed volume icons not updating the user volume slider.
  - Minor bug fixes.

<!----------------------------------------------->
## 0.8.30 (2023-07-17)

#### :rocket: New Features
- `Version: 0.8.37`
  - **Added a help chat bot!** ([PRFP-1089]) The first draft of the PianoRhythm Help Bot is now here. This was just a fun little thing to work on. You can ask it general questions about PianoRhythm. It's primary source is from the documentation site but you can also ask it some questions about the real time state of the server, such as how many players are online or the total number of registered users. To interact with it, just type in `@helpbot (insert question here)` in the chat bar.

:::note
  You must at least be a registered member to use the help bot. So create an account, today!
:::

{/* truncate */}

- `Version: 0.8.34`
  -  **Added build pipelines for MacOS and Linux** ([PRFP-1079]) Added desktop builds for MacOS and Linux. *Will need extensive testing*.
  -  **Added customizable keyboard layout** ([PRFP-1080]) For those keyboard warriors out there, you can now
  individually map each key on your keyboard to a corresponding note on the piano. You can find this at: `Settings -> Input -> (Piano Keys Layout) Custom`. Once selected, click on the `Customize Layout Keys` button.

- `Version: 0.8.33`
  - **Midi Step Sequencer** ([PRFP-502]) Added a midi/drum step sequencer. Find out more here: [Midi Step Sequencer](/guides/sequencer/)

- `Version: 0.8.30`
  - **Orchestra Mode!** ([PRFP-1026]) Added the first draft of orchestra mode. Find out more here: [Orchestra Mode](/guides/orchestra-mode/)
  - **Piano Customization!** ([PRFP-1073]) Find out more here: [Piano Customization](/guides/customization/customization-piano)
  - **Channel Parameter Sliders** ([PRFP-1070]) Added functionality to individually set the volume and pan values for channels. Find out more here: [Channel Parameters](/guides/instrument-dock/channel-parameters)
  - **Increased Max Players Limit** ([PRFP-1072]) Increased max players to 20 for normal rooms and 30 for lobbies.
  - **Added setting to set max channels for Multi Mode** ([PRFP-1074]) You can now set the max number of channels to use during multi mode. You can find this setting by going to: `Settings -> Midi -> Max Multi Mode Channels`

#### :smile: Enhancements
- `Version: 0.8.34`
  - ([PRFP-1084]) Increase default room size room to 20 in UI.
  - ([PRFP-1081]) Add functionality for canvas to use main thread when offscreen canvas is not supported. You can also manually toggle this in the settings by going to: `Settings -> Graphics -> Enable Offscreen Canvas`
- `Version: 0.8.30`
  - ([PRFP-1071]) Volume button in the bottom bar is now highlighted when the global volume is muted or zero.
  - ([PRFP-1066]) Added the user slot mode to the meta details in the mini profile card.

#### :bug: Bug Fixes
- `Version: 0.8.38`
  - Simply fixed an issue with the desktop builds not loading properly.
- `Version: 0.8.35`
  - ([PRFP-1075]) Fixed: Audio engine doesn't work when logging out and relogging back in, without refreshing page
- `Version: 0.8.34`
  - ([PRFP-1083]) Fixed an issue where notes from other users were not being emitted to midi outputs.
  - ([PRFP-1085]) Fixed issue with MIDI player notes showing up behind the keys and going through the piano model.
- `Version: 0.8.32`
  - ([PRFP-1076]) PRFP-1076 Can't see other player notes playing on keys?
  - ([PRFP-1077]) Instruments list not updating when switching soundfonts.
  - ([PRFP-1078]) Keys with no sound not being represented properly.
- `Version: 0.8.30`
  - ([PRFP-1069]) Fixed an issue where turning on stage effects would remove the room's password.

### General Notes
- `Version: 0.8.30`
  - Avatars (and the piano bench) have been disabled temporarily while I rework a more optimal system.
  - Figured out how to use stereo audio (_it was apparently mono before_) for the web version.
  - ([PRFP-1075]) There is a known issue about the audio engine not working when relogging in. Working on it!

<!----------------------------------------------->
## 0.8.26 (2023-06-17)

#### :bug: Bug Fixes
- ([PRFP-1067]) Fixed an issue with crashes when playing certain midi notes/events.
- ([PRFP-1065]) Fixed the pageloader screen showing indefinitely.

### General Notes
- You may have noticed that there hasn't been a lot of updates lately. I've just been taking a general
  break from v3 and programming. But I've been slowly getting back into the groove of things.
  Thank you guys for all the support you've given so far. ❤
- Some things I'm currently going to or have been working on:
  - Ensuring that the reverb effect works across all soundfonts.
  - Volume scaling sliders for mixing instrument channels in MultiChannel mode.
  - Add a feature to loop/auto replay midi tracks.
  - Add some basic drum loops for when you're in 'Play Drums' mode.
  - Implementing a *Orchestra* like room/mode. You'll be able to customize your piano and also see everyone else's.
  - Increase max users count in rooms by double.
  - Improve logging and to better deal with crashes that lead to audio/sound issues.

<!----------------------------------------------->
## 0.8.24 (2023-05-27)

#### :ok_hand: Changes
- ([PRFP-1062]) Created a Telegram group! Join here: https://t.me/+hUJtV_QXVnU1NTIx
- ([PRFP-1059]) Added "Arco Strings" soundfont to default list.
- ([PRFP-1063]) Updated the default reverb settings.
- ([PRFP-1020]) Added a reset functionality for soundfont settings.

#### :bug: Bug Fixes
- ([PRFP-1061]) Fixed a note-off issue for instruments in multi-channel mode.
- ([PRFP-1060]) Fixed an issue with users being able to add instruments to disabled channels.

<!----------------------------------------------->

## 0.8.0 (2023-05-04)

#### :rocket: New Features

- **Added plugins!** ([PRFP-629]) Added the first draft of a plugin system to allow users
to build local plugins to extend PianoRhythm. Find out more here: [Plugins Guide](/advanced-guides/plugins)

{/* truncate */}

- **Added Changelog Modal** ([PRFP-1022]) A modal of the latest changes will now show up after a new version update.

- **Added User Velocity Percentage Slider** ([PRFP-1045]) Added a global slider alongside individual sliders for controlling the total percentage value of other users' velocity inputs. You can find the global setting in `Settings -> Midi` and find individual sliders by clicking on user profiles in the sidebar.

#### :ok_hand: Changes
- **Updated Desktop App (Tauri -> v1.3.0)** If you would like to know the technical details, you
can check out their blog post: [Tauri 1.3.0](https://tauri.app/blog/2023/05/03/tauri-1-3)
- **Updated Graphics Engine (Bablyon.js -> v6.0)** ([PRFP-1024]) Find out more here [Babylon.js v6.0](https://babylonjs.medium.com/announcing-babylon-js-6-0-dcb5f1662e3a)
- ([PRFP-1035]) (Development) Updated Vite to 4.
- ([PRFP-1033]) (Development) Added some more much needed unit tests.
- ([PRFP-1033]) (Development) Added some much needed E2E (Cypress) tests.
- ([PRFP-1055]) Added an option to experiment with WebGPU rendering.
- ([PRFP-1043]) Added a visual indication when a user has a different soundfont loaded than you do.
- (Development) Minor internal refactors.

#### :bug: Bug Fixes
- ([PRFP-1021]) Fixed an issue with other players not being able to hear your drums.
- ([PRFP-1029]) Fixed a glitch with the room owner's crown display.
- ([PRFP-1034]) Fixed issue with executing unit tests.
- ([PRFP-1030]) Fixed issue with the reverb modal and other related modals, due to the UI sliders (noUiSlider) being broken.
- ([PRFP-1032]) Fixed glitch with the `New Messages` button sometimes showing up inappropriately.
- ([PRFP-1036]) Fixed an issue with trying to display the latest changelog from the docs page.
- ([PRFP-1039]) Fixed multi channel slot mode not emitting properly in the desktop app.
- Minor internal bug fixes.

<!----------------------------------------------->

## 0.7.230 (2023-03-18)

#### :rocket: New Features

- **Added sound effects** ([PRFP-137]) Implemented the first draft of having sound effects with UI Elements! You can find more settings at `Settings -> Audio Effects`

<!----------------------------------------------->

## 0.7.222 (2023-03-13)
#### :rocket: New Features

- **Added initial draft of World** PianoRhythm World is a feature that I've always wanted to implement. It's an environment where you can create your own avatars and engage in a 3D world with others while playing music.

- **Added support for displaying images in chat** ([PRFP-956]) For certain links that contain images, there'll be a preview displayed in chat

- **Added Reporting** ([PRFP-225]) Still in the initial stages but you can now report certain chat messages and users for inappropriate content/behaviours. You can right click a chat message or user to see the context of being able to report.

<!----------------------------------------------->

## 0.7.152 (2023-01-09)
#### :rocket: New Features

- **Added Audio Equalizer** ([PRFP-918]) Added an audio equalizer to allow for better fine tuning of the audio output. You can find it `Tools -> Audio Equalizer`

<!----------------------------------------------->

## 0.7.146 (2022-12-26)
#### :rocket: New Features
- **Added V2 Piano Soundfont** ([PRFP-900]) I did my best to convert the default piano from v2 into a soundfont. For now, I set it as the default soundfont. You can go to `Settings -> Soundfont -> Load Default Soundfont.`

  In the list, there's the `PR_V2_SF.sf2` which is just the piano itself and `PR_GM2.sf2` which has the v2 piano mixed with the previous GM2_Map sf.

<!----------------------------------------------->

## 0.7.143 (2022-12-26)
#### :rocket: New Features
- **Improved Soundfont Support** If you previously had certain custom soundfonts that would not load, try loading them again. I updated to code to be a bit more friendlier. There are still going to be some exceptions.

<!----------------------------------------------->

## 0.7.123 (2022-12-20)
#### :rocket: New Features

- **Sheet Music Repo** ([PRFP-851]) Added a repository for uploading sheet music! To check it out, click on `Tools -> Open Sheet Music Repo`. This feature is not available for guests, so sign up and create an account today!

<!----------------------------------------------->

## 0.7.119 (2022-12-18)
#### :rocket: New Features

- **Graphics Optimization** Optimized the default scene so some you guys should experience a decent boost to frame rate. Also add more graphical settings that you can mess with to see what improves your framerate. You can check it out at `Settings > General (Graphics)`.

<!----------------------------------------------->

## 0.7.91 (2022-12-07)

#### :rocket: New Features
- **UI Themes** Added themes! This is just the first draft of this feature so there are certain color issues on some themes. They'll be eventually fixed in the coming updates. To change a theme, go to `Settings -> (Graphics) UI -> Theme`

- **Reverb Settings** ([PRFP-988]) Added customizable reverb settings. To adjust them, go to `Settings -> Soundfont -> Advanced`

- **New stage models!** You can try the new stages by going to `New Room -> Room Stage`.

- **Ear Training Games** These exercises will improve your musical ability by developing a more intuitive understanding of what you hear. Two exercises were added: `Perfect Pitch` and `Scales`. To try them out, go to `New Room -> Room Mode -> SoloGame`.

- **Midi Player** Added a built-in midi player that renders like Synthesia's waterfall notes. You can test it out by dragging a midi file in the main window or by going to `Instrument Dock -> Tools -> Open Midi File`.

#### :bug: Bug Fixes
- ([PRFP-807]) Fixed issue with Touhou soundfont only emitting sound to one speaker from the lower notes.