---
title: Cryptool
description: A cross-platform desktop app that simplifies encryption and decryption tasks across classic ciphers
category: Year 3
pubDate: 2025-03-01
cover: ../../assets/projects/cryptool/cover.png
team:
  - Julian Peter Gerona
  - John Robert Santos
  - Luis Gerard Tiongco
stack:
  - Python
  - JavaScript
  - Eel
tools:
  - Git
  - GitHub
  - PyInstaller
repo: https://github.com/jp-gerona/cryptool
draft: false
---

## The Brief

### Four classic ciphers behind one converter.

Cryptool is a desktop app that encrypts and decrypts text with four classic ciphers: Caesar, Kama Sutra, Vernam, and Morse. We built it as our IT129 requirement in a team of three, with a web interface in front and Python doing the cipher work behind it.

## A Deeper Look

### A web page posing as a desktop app.

The app runs on Eel, a small Python library that serves a local HTML page as a GUI and bridges the two languages: the JavaScript interface calls exposed Python functions directly. That split kept the project simple. All four cipher algorithms fit in one `ciphers.py` under a hundred lines, and the interface stays plain HTML, CSS, and JavaScript in a `web/` folder, no framework involved.

For distribution, PyInstaller packages the interpreter, the logic, and the web assets into a single executable, so the app runs on a machine with no Python installed.
