---
slug: welcome
title: Welcome
authors: [oak]
tags: [welcome, oak, pianorhythm, history, v2, v2 history, v3]
---

Welcome to PianoRhythm's first blog post!

Yes, it is I, Oak! I am the creator and main developer of PianoRhythm.

If you're looking to create a blog post pertaining to PianoRhythm, piano, or just anything music related, then feel free to contact me!

- Email: oak@pianorhythm.io
- Discord: Oak#9806

You can find the PianoRhythm app's url [here](https://pianorhythm.io).

### Why did I create PianoRhythm in the first place?
Well, like many of you, I was an avid user of MPP and loved it. At the time, I just got into learning the piano and actual programming. I thought MPP had so much potential and the lack of updates kind of pushed me into envisioning my own thing. PianoRhythm is just a passion product. I didn't create it for the profit or for the masses.

It's something I've been putting my own time and money cause I just really enjoy creating and didn't mind sharing the platform with other people. I'm not trying to compete with MPP. I wanted to PianoRhythm to be its own thing with a unique world. I'm still striving for that. So far, I've been the sole developer with some help from BopIt on the Discord stuff in the backend. I can only do so much as a working professional.

### What happened to v2?
So v2 was created back in 2016 when I just started learning programming in college. I definitely used MPP as the basis for the idea but used that as an opportunity to try different things. v2 was generally stable because it was simpler and less demanding. And that's because I was initially following MPP's footsteps. But for those OG members who may remember, that I did have a 3D mode in v2. However, what was the common complaint? That it was too laggy for lower performing machines.

So, I scrapped that idea in the mean time to focus. But, I really really preferred the aesthetics of 3D. The way I justify it is that if you really want 2d, then you have MPP for that. May not be ideal but there's nothing stopping you from using both (free) services.

I wanted PR to be different. What's the point of creating a clone of MPP with just a different skin? The features that were in v2 were ideas I just wanted to play around with that I thought people would use. So, like being able to record, have multiple instruments, have a personal representation with avatars (blobs), and other stuff. I also wanted to make PR more game like because I've always been interested in making games as well. v2 was always in early alpha state since there was a lot of active development. But the ideas that I had in mind were still limited by certain technological limits that I'll talk about later.

Anyhoo, I was in college back then and my time was limited. Since I was still learning of heck of a lot of stuff about development, there was a lot of sphaghetti code and probably bad practices. Add also that here were plenty of hiatuses that occurred and over time, things became unmaintable.
Once I got an internship at my current workplace, I learned a lot of new stuff and decided to create the project from scratch with my new knowledge.
Thus came v3. The eventual plan was to get v3 to decent enough state with similar features to v2 and have it replace it. Before I officially replaced v2, I did have message that would show in v2's lobby about me working on v3 so hopefully it wasn't that much of a surprise. And that was there for at least a few months.

### What's up with v3?
v3 has an interesting history because I've probably rewritten it from scratch like a dozen times. But before I get to some of the history, I'll first answer a few common things people have said:

#### Why is V3 like forced 3D? It's so laggy!
Like I mentioned above, that is the direction I've wanted to take and I knew it was going to outcast some users. It's impossible to please everyone so I'm not trying to. I'm still learning so I will keep trying to optimizing the app as best as I can but there's only so much old hardware can deal with. My machine is not a beast (GTX 1080 GPU and i7 CPU) but it runs perfectly smooth so far. Unfortunately, it's not like I have a bunch of old laptops sitting around where I can do performance tests. Keep in mind that v3 is in open beta and in active development. This where you guys come in and provide feedback so I can best try and deal with these issues. In general, v3 has a totally different tech stack from v2. Why? Cause I want to learn and try different things. If you've created any software, you would know how rapid frameworks, libraries, and other tech can get.

Honestly, I would've like to use a proper 3D game engine to make PianoRhythm but for now, web developing is relatively easier and has better cross platform compatibility. I'm primarily limited to web technology. The desktop app (and no, it's actually not using Electron but actually using a product called Tauri (https://tauri.app/) that renders using the machine's native webview), was an attempt to at least provide more stability and a better desktop app experience.

#### What's up v3's audio engine? It's terrible.
Hmm, that's primarily subjective in my opinion. So, I'll cite some sources and the reasoning behind certain things with the audio engine.
I knew people were going to probably bash v3's audio since they were most likely used to v2's audio. **A lot of people don't like change**. Sure, there's probably a distinctive difference in audio fidelity but I imagine if you never used v2 in the first place and came to v3, then you would've probably had a different view.

Luckily, if you don't like v3's audio, you can always use the midi output to play audio on your preferred synthesizer of choice. And once again, this is in active development where there's always room for improvement. If you're a developer that can build a better audio engine, then please let me know. I'm just one person working on the front and back end.

First, I wanted PR to be able to use multiple instruments and thus allowing other users to hear such instruments to have a band/orchestra like experience. MPO (multiplayer orchestra) pretty much tackled that.

v2's audio engine was using an existing tech that converted audio samples to a base64 encoded javascript object and allowed to process those encoded samples through WebAudio (https://github.com/gleitz/midi-js-soundfonts).
So an example would like look:

```js
MIDI.Soundfont.high_quality_acoustic_grand_piano = {
    "A0": "data:audio/ogg;base64,SUQzAwAAAAAAOlRYWFgAAAAW..."
}
```

Was it the best choice back then? Who knows? I was still learning
and it was relatively easy to use. However, these objects were per instrument and took a bit of computer memory. So, each instrument had to manually be loaded into the browser to be able to be played. Okay so what's the issue? Well, if I was going to provide a feature to allow using different instruments, most people would expect to able to hear other users' instruments. That would be fine and dandy if it was just a few instruments but these audio js objects were converted from .sf2 soundfonts. These are files that are sample based audio files that can contain multiple instruments and sound effects. These have been standardized and a GM (General Midi) usually contain at least 100+ instruments.

I recall that I experimented trying to load every single JavaScript audio object and quickly ran into memory limitation issues (like 2GB used for the audio) with Chrome. Often times, the browsers limits what an active site can do. So from a design aspect, I couldn't really justify users kind of forcing other users to load these audio objects with how much it cost.

I had to think of an alternative and that's where using soundfont files (.sf2) came to mind. Theoretically, the tech behind them seem to be effecient and really what I was looking for. A 10mb soundfont file could potentially have all the GM instruments loaded without costing a lot in RAM. Also, there would be added benefit of people using their own custom soundfonts if they didn't like the default ones that PR might have. Win/Win, right? At the time of v2, I don't recall of any stable libraries that supported loading sf2 files.

I'm no audio engineer so I definitely was going to try and build one from scratch since it was way out of my scope. But, I didn't give up. That's why with v3, I did so many rewrites trying a lot of different things. Developing is hard. I'm not a genius. Just an average programmer that's trying his best.

Once better technology came about, I finally decided to go the Web WASM route and found a SF2 parsing library written in Rust called OxiSynth (https://github.com/PolyMeilex/OxiSynth). This was also an opportunity to learn a new programming language (developers like shiny new stuff).

So far, I like this library. Since I didn't write it from scratch, I don't know the ins and outs, yet. There's a lot of low level audio programming that I have to get familiar with and that will take time.  Now if users have the same soundfont, you can load any instrument and have it heard by anyone without any additional cost.

Users also now have an option to use higher quality soundfonts without any major real drawback (their machine is the only limitation, I suppose). I still have to figure out how to allow users to hear a custom soundfont that someone else loaded (I do not want to force someone to have to download a 2gb soundfont for example). And speaking of size, choosing a default soundfont was a compromise. Sure, I could have a high quality one as the default but the default but that would incur a large download. So, I initially settled on a standard GM soundfont that was around 50-60mb that sounded decent (at least to me). However, it was recently pushed to like 100ish since people really wanted the old v2 default piano (which is about 50+ mb decoded in audio samples). So, I learned to created soundfonts and replaced the first piano in the default with v2's.

I recently added a first draft of an equalizer for those who want to try and fine tune the audio. The point is that I'm trying my best but I can't please everyone. So, if you have supported me thus far, I really appreciate it. There's been plenty of times where I've wanted to quit and just completely abandon the project. As a creator, open criticism is expected and I can deal with. But I can definitely do without people who are just extremely negative with nothing to offer.