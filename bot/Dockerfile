# 1. This tells docker to use the Rust official image
FROM rustlang/rust:nightly as build

# create a new empty shell project
RUN USER=root cargo new --bin pianorhythm-docs-bot
WORKDIR /pianorhythm-docs-bot

# copy over your manifests
COPY ./bot/Cargo.lock ./Cargo.lock
COPY ./bot/Cargo.toml ./Cargo.toml

RUN cargo fetch

# this build step will cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# copy your source tree
COPY ./bot/src ./src

# build for release
RUN cargo build --release

# our final base
FROM rustlang/rust:nightly

RUN apt-get update && apt-get install -y pandoc

# copy the build artifact from the build stage
COPY --from=build /pianorhythm-docs-bot/target/release/pianorhythm-docs-bot .
COPY ./changelog ./pianorhythm-docs-bot-sources/changelog
COPY ./docs ./pianorhythm-docs-bot-sources/docs
COPY ./blog ./pianorhythm-docs-bot-sources/blog

ENV DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 80

# set the startup command to run your binary
CMD ["./pianorhythm-docs-bot"]