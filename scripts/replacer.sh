#!/bin/bash


replacer() {
    local directory="$1"

    for item in "$directory"/*; do
        if [ -d "$item" ]; then
            echo "Dir: $item"
            replacer "$item"
        else
            echo "File: $item"
            mv -- "$item" "${item%.js.js}.js"
        fi
    done
}

replacer_path=./mobile/src

replacer "$replacer_path"