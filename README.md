# About This Project
This script simulates the harvesting mechanics of the [Aavegotchi](https://aavegotchi.com) Gotchiverse based on a given set of rules governing the game. This script is provided for educational purposes only for others to learn how certain harveseting play styles might perform in the Gotchiverse.

# How it Works

Each simulation contains a single set of harvesting mechanics rules. These include rules like build costs, limits on harvester count, crafting prerequisites, as well as limits on leveling up- like having to level up your altar or maker first.

The simulation is played by "bots" that utilize a strategy that governs how they play. It is currently configured with two bots- the expandooor and the upgradooor, as described below.

Different simulation configurations (with different rulesets and bot assignments), are contained in the `/simulations` folder.

## Bots

All bots play according to the following rules.
- craft an altar, only upgrade the altar as needed to allow upgrading of other installations
- craft a harvester - choose the most abundant alchemica token in the parcel (relative to the overall token supply)
- craft and upgrade a single reservoir per alchemica type as needed to ensure a reservoir emptying frequency of 8 hours or less
- craft and upgrade a maker as needed to allow upgrading of other installations - once a maker has been crafted, the bots' goal is to keep the maker one level ahead of their current simultaneous upgrades so that it never limits their progress
- bots are considered to have a virtually unlimited bankroll (though it is possible to limit it in the simulation settings), and they reinvest every penny in their parcel
- bots are given a single parcel to build on - this is currently a spacious parcel but this is configurable in the simulation - the parcel is assumed to get an average VRF roll for its alchemica supply, and does not have any boosts (both of these variables are configurable, however)
- bots do not spend any GLTR to speed up installation crafting - since the value of GLTR vs alchemica is dynamic, its cost is not able to be assumed it a meaningful way in the simulation
- bots do not collect any spillover - all spillover from reservoirs is assumed lost
- bots stop crafting and upgrading harvesters if they exceed their desired maximum harvest rate. This rate is calculated by taking the total amount of alchemica they expect to receive for the remaining distribution rounds in Act I and dividing that by the total days remaining in Act I. In other words, they try to exhaust their alchemica supplies by the end of Act 1, and not sooner (doing so sooner would only lower their overall returns as they would be building excess harvesting capacity that would go to waste).

In addition to the rules above, the following strategies are examined in the simulation. The code that runs the bot strategies is contained in the `/strategies` folder of the project.

### Horizontal Expansion (aka the "expandooor")
The expandooor bot (player 0 in the simulation), seeks to maximize the expansion of new low level harvesters before upgrading any existing harvesters.

### Vertical Expansion (aka the "upgradooor")
The upgradooor bot (player 1 in the simulation), seeks to upgrade existing harvesters to their maximum level before crafting new harvesters.

### Horizontal to L1 (aka the "low levelooor")
The low levelooor is a humble farmer who does not upgrade any of their harvesters past level 1.

### Build Only L1 FUD Harvesters (aka the "low level fud maxi")
This bot is like the low levelooor, except they focus only on harvesting a single resource (in this case, FUD).

## Rulesets
Rulesets are contained in the `/rulesets` folder of the project. This is where game rules can be modified to examine their impact on the simulation output. The `current.js` ruleset file contains the rules as they currently exist as of bible chapter 4.

### Recipe A
This is a modified version of the harvester recipe which somewhat improves the ROI of higher level harvesters and diminishes the ROI of lower level harvesters compared to the original (current) ruleset.

### Recipe B
This is a modified version of the harvester recipe which greatly improves the ROI of higher level harvesters and greatly diminishes the ROI of lower level harvesters compared to the original (current) ruleset.

## Results
Results are output to a timestamped .csv file in the `results` folder named similarly to the simulation script name that generated them. Charting and further aggregation and analysis of the data has been conducted and can be found in this [Google Drive folder](https://drive.google.com/drive/folders/1WB8L6aEPEdGnEgxcRUD3ysRwko2fjzMU).

**Note**: As of the time this simulation was created, the reservoir spillover rates have not yet been announced, the simulation uses the same spillover rates as altars.

# Installing the Script
I am assuming you already have [Node.js](https://nodejs.org/en/) installed. The script was developed and tested with v17.4.0. To install, run the following from the root directory of the project: `npm install`

To run the script, run the `app.js` script in the project root, or use `npm start`. This will run the default simulation, with the current ruleset. To run another simulation use `node app.js <simulation name>` where the simulation name is the name of the file in the `simulations` project folder without the .js extension. (ie: currentRules)