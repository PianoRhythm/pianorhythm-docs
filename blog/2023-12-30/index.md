---
slug: update_2023
title: Server Upgrade
authors: [oak]
tags: [oak, pianorhythm, server upgrade]
---

Whew, it's been a while since I've posted here. I've been busy with life and other things, but I've finally gotten around to upgrading the server. Version `0.9.0` has now been released! I've also added a few new features to the app. Let's dive in, shall we?

### Server Upgrade
I've been on quite an adventure with the development of the server. Initially, it was built using F# and the Akka.NET framework. However, as the complexity grew, I found the backend becoming a bit too challenging to maintain. Also, the server didn't seem to be as performant as I would have liked. So I hope many of the weird bugs that you've encountered in the past, due to the server, are now gone with this new update.

So, I decided to give Rust a try. Rust, with the Actix framework, offered a fresh start and a chance to streamline the codebase. I've been diving deep into Rust lately, and I've been enjoying every minute of it. The decision to rewrite the backend in Rust was a significant one, but it's a decision I'm glad I made.

However, it's not a complete rewrite. There are still certain prior features that I need to rewrite. For example, the backend for the sheet music repo service needs to be ported into Rust. I hope to get that done in the following weeks.

The transition to Rust has not only made the backend easier to maintain but also more efficient at processing web requests. Plus, it's opened up a whole new world of possibilities for adding new features. I'm excited about the improvements I've made and even more excited about what's to come.

Stay tuned for more updates as I continue to enhance the app with new features!

### New Features

In the recent development cycle, I was also able to add/improve some features.

- Added two new stages: "Music Studio" and "Arena."
- Added stage sound effects. You can now play background music while playing the piano.
  - Rain, Wind, and Bird audio effects.
- Moderators are now able to add/remove badges to/from users. With that being said, I would like to add more moderators to the team. If you're interested, please send me a message or you can fill out this form: [Application Form](https://form.jotform.com/240056814147150).
-  I've implemented a system to create a new lobby when a user is attempting to join a lobby that is full.

### Future Plans

With the release of version `0.9.0`, we're reaching the near end of the beta phase. If all goes well with this new server upgradeg, then I plan on releasing version `1.0.0` in the coming months.

The major focuses for the next few months will be:
- Improving the UI/UX.
- Add a Midi Music repository.
- Adding more social features.
- Adding more exclusive features for the PRO subscription plan.
- Stabilize the self-hosting process.
- Improving mobile support.
- Improving localization support _(Send me a message if you would like to contribute. You'll get a translator badge as recognizition for your efforts)_.
- Add more DAW like features.
- Bring back and improve Avatars.