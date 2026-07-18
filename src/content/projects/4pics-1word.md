---
title: 4 Pics 1 Word
description: A desktop clone of 4 Pics 1 Word built solo in Python and Tkinter, with 50 levels, a coin economy, hints, and saved progress
category: Year 1
pubDate: 2023-01-01
accent: "#24293E"
cover: ../../assets/projects/4pics-1word/cover.webp
role: Solo Developer
stack:
  - Python
  - Tkinter
repo: https://github.com/jp-gerona/python-4pics1word
draft: false
---

## The Brief

### A group project, population one.

4 Pics 1 Word is a desktop clone of the mobile word puzzle, built in Python with Tkinter for a first-year module exam. Four images share one word; the player spells it from a rack of jumbled letters. It was supposed to be a group project. I ended up building it alone, as a first year still inexperienced with programming and with Python itself.

## The Problem

### I did not know game loops existed.

Partway in, the build stopped dead. A game needs to reset itself after every guess, new picture, new answer, new letter rack, same window, and I hit a mental block on how that was supposed to happen, because the concept of a game loop was something I had never been taught. I did not even have the vocabulary to search for it.

The way out was naive logic that I reasoned from scratch: if I cannot update the board, I can destroy it and build a new one. Every widget of the finished level gets torn down, and the next level is constructed in its place:

```python
# Most Important Part of Code, It updates the state of the game.
def updateGameState(self):
    # Delete Previous Game State
    self.bg1.destroy()
    self.frameTwo.destroy()
    for widget in self.frameTwoButtons.grid_slaves():
        widget.destroy()
    for box in self.boxContainer:
        box.destroy()
    ...
    # Create New Game State and Update State
```

That comment is verbatim from the source, and it was accurate. Brute force by any measure, a real game engine would update state, not demolish the interface, but every feature in the game hangs off that one method, and it worked.

![Puzzle level showing four images, an install wizard, a cartoon wizard, a witch hat on a spellbook, and a wizard over an open book, for the word "wizard"](../../assets/projects/4pics-1word/screens/wizard-puzzle.webp)

## The Outcome

### Fifty levels, four rewrites, one file.

The finished game runs 50 levels from a bank of picture puzzles, each rack padded to 12 buttons with random letters and shuffled. A coin economy sits on top: 100 coins to start, 10 earned per solved level, 2 spent on a hint that reveals and locks the next correct letter, 10 to skip a puzzle into a queue it will return from later. Closing the window saves level, coins, and completed puzzles to a text file, and the game resumes from it on launch.

All of it lives in one 426-line Tkinter class. The original filename in the repo tells the rest of the story: `MP2-GeronaJulianPeterv4.py`. There were three versions before the one that worked.
