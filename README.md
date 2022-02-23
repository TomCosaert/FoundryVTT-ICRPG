# Index Card RPG System for Foundry VTT

[Foundry Virtual Tabletop](https://foundryvtt.com/) (**Foundry VTT**) is a standalone application built for experiencing multiplayer tabletop RPGs using a feature-rich and modern self-hosted application where your players connect directly through the browser.

[Index Card RPG](https://www.icrpg.com/) (**ICRPG**) by [Runehammer Games](https://www.runehammer.online/) takes classic tabletop mechanics for telling stories, making monsters and rolling dice, but throws out all the clunky parts that keep most folks from trying an adventure or two.

This **Game System** for Foundry VTT allows easy creation and management of ICRPG player characters, NPCs and items.

> Foundry VTT users now have no excuses anymore to not be playing ICRPG!

![screenshot|441x500](https://raw.githubusercontent.com/TomCosaert/FoundryVTT-ICRPG/master/screenshot.png)

## Features

To highlight some of its **features** that might not be obvious at first glance:
- Character sheet attributes are **roll-able** to the chat window by clicking the Stats, Effort, Dying, Revive labels in the Attributes tab, or the Loot label in the Gear tab. If applicable, any modifiers are automatically applied to the roll.
- The character sheet allows **adding new items** without having to first create them as stand-alone ones, by clicking the plus icon.
- Any owned item's **equipped state** is easily toggled using the star icon from the item list itself — no need to open the item window to change it.
- An excerpt of the **item's description** gets displayed underneath each item name in the item list. Click the item's name to open the item window and read the full description.

**Active Effects Integration:**
- Ability to modify actor and item features (e.g. stats, health, defense) though **Active Effects** 
- Ability to associate Active Effects with Actors and Items 
- Interface to add Active Effects 

**More item types:** 
-Weapons, Armor, Spell, Ability
   -Weapons have OPTIONAL Durability and Mastery scores.  When a weapon has 0 Durability, attempting to attack with it will produce an error message.  
   -Armor has a Defense value that modifies the actor’s Defense score when equipped. Armor also has OPTIONAL Durability and Mastery scores. When that durability hits 0, the armor provides no Defense benefit.
   -Item, Weapon, and Armor Durability are OPTIONAL rules (See below) and are manually updated in the individual item in the “Loot” tab for each character. 
   -Spells have the 3 BASIC spell types (Holy, Infernal, Arcane)   
   -Spells also have OPTIONAL spell mastery values that can be updated to track spell-level mastery.
   -Spell and Weapon Effort values can be customized inside each item (e.g. 1d8 instead of 1d6 for weapon effort, etc)
   -Abilities have OPTIONAL mastery values that can be updated to track skill/ability mastery. 

**Global Target:** 
- A global variable that holds a value from 1-99
- Skill checks, Attribute Checks, Spell Checks and Attack Rolls should all go against that Global Variable (Scene Target). 
- The ability to modify that value at any time
- A large, position-able d20 that reflects the Global Target 

**Basic Automation:**
- Players can now target NPCs or other Players
- Items, Abilities and Spells on the character sheet can now be automatically rolled by clicking the d20 to the left of the item’s name.
- The skill/item/spell roll will automatically check against the Global Target.
- If successful, an effort roll pop up will appear.  Rolling effort will automatically deduct the result from the target HP.
- If the “Use NPC Defense” option is enabled (see section 6) the attack will ignore the Global Target and use the NPC or Player’s Defense score.

**New Character Sheet:**
- New Locked and Unlocked versions of the Character Sheet.  Unlocked allows players to manually edit Base, Loot and other fields.  Locked uses Armor and Abilities to modify the Loot values (not modifiable directly)
- Added Stun Points for Core rules Spell Cost

**Optional System Rules (set in the System Features menu):** 
- Allow a DM to have Attack and Spell rolls use an NPCs Defense instead of the Global Target
- Disable OPTIONAL Item Durability
- Disable OPTIONAL Spell Mastery 
- Disable OPTIONAL Ability Mastery

The following languages are currently supported: **English**, **Spanish**, **German** and **Dutch**. Reach out if you feel like contributing!

## Installation

In Foundry VTT, on the Configuration and Setup's **Game Systems** sheet, click the **Install System** button at the bottom, scroll down to **Index Card RPG** and click **Install**.

Alternatively, use the following **Manifest URL** to install the game system:
```
https://github.com/jessev14/FoundryVTT-ICRPG/raw/master/system.json
```

## Attribution

Many thanks to Brandish Gilhelm (also known as Hankerin Ferinale) of [Runehammer Games](https://www.runehammer.online/) for designing Index Card RPG! Tom acquired his **permission** to make this game system available to the Foundry VTT community as-is, without including any source material content such as item loot tables as compendia.Many thanks to Brandish Gilhelm (also known as Hankerin Ferinale) of Runehammer Games for designing Index Card RPG! Tom acquired his permission to make this game system available to the Foundry VTT community as-is, without including any source material content such as item loot tables as compendia.

Many thanks to Tom for starting this whole thing moving along.

Countless thanks to Jesse (Enso) for the heavy lifting with the code.

Thanks to Diego Martinez for the Spanish localization!

## Links

For more information, visit the following pages:
* [Foundry VTT Package](https://foundryvtt.com/packages/icrpg/)
* [GitHub System Repository](https://github.com/jessev14/FoundryVTT-ICRPG/)

Enjoy!