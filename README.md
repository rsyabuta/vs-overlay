# vs-overlay

## Overview

`vs-overlay` is a web service that helps manage xsplit and OBS overlays for displaying player names and score counts specifically for fighting games.

Features:
* Web based controls for updating player names and score counts.
* Player names can be saved in a list and assigned to player 1 and player 2 locations for quick updating.
* Player names can be imported from start.gg or challonge brackets.

Feature demonstration:

[![Features](https://img.youtube.com/vi/E0Te4srMtGc/0.jpg)](https://www.youtube.com/watch?v=E0Te4srMtGc)

Hosted version: https://overlay.blastcity.net

## Usage

### Requirements

You must have nodejs installed in the environment that is running `vs-overlay`. This project has been tested to work in version `v15.3.0` but other versions should also work.

### Running the server

1. Install all dependencies by running `npm install`

1. Run the server using `node index.js`. The server should be running on port `3000`. You can access it at http://localhost:3000
