#!/bin/sh

# experimental-sepcifier-resolution:
#    allows not having to put a file extansion on imports
#    which in a ts project would have to be .js which I find
#    mildly annoying.
node  --experimental-specifier-resolution=node ./dist/index.js "$@"
