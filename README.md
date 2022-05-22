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
- bots are considered to have a virtually unlimited bankroll, and they reinvest every penny in their parcel
- bots are given a single parcel to build on - this is currently a spacious parcel but this is configurable in the simulation

In addition to the rules above, the following strategies are examined in the simulation. The code that runs the bot strategies is contained in the `/strategies` folder of the project.

### Horizontal Expansion (aka the "expandooor")
The expandooor bot (player 0 in the simulation), seeks to maximize the expansion of new low level harvesters before upgrading any existing harvesters.

### Vertical Expansion (aka the "upgradooor")
The upgradooor bot (player 1 in the simulation), seeks to upgrade existing harvesters to their maximum level before crafting new harvesters.

## Rulesets
Rulesets are contained in the `/rulesets` folder of the project. This is where game rules can be modified to examine their impact on the simulation output. The `current.js` ruleset file contains the rules as they currently exist as of bible chapter 4.

## Results
Results are output to a .csv file in the same folder as the simulation

**Note**: The reservoir spillover rates have not yet been announced, the simulation uses the same spillover rates as altars.

# Installing the Script
I am assuming you already have [Node.js](https://nodejs.org/en/) installed. The script was developed and tested with v17.4.0. To install, run the following from the root directory of the project: `npm install`

To run the script, run the `app.js` script in the project root, or use `npm start`.