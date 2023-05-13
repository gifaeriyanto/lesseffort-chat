#!/bin/bash

# Clone repository and its submodule
git clone --recurse-submodules https://github.com/f/awesome-chatgpt-prompts.git

# Copy prompts.csv to ./src/store/db directory
cp -f awesome-chatgpt-prompts/prompts.csv ./scripts/files/

# Remove submodule repository
rm -rf ./awesome-chatgpt-prompts

# Convert CSV to JSON
node ./scripts/node/convertCSVtoJSON.js