# lpath

A simple linux utility to handle path.

# Build

The build in the dist folder is for x64 only.  
If you want to use x86, you can build it using nexe (Tested with Node v12.9.1).  
The command I used (Node v12.9.1):
```bash
nexe cli.js -o ./dist/lpath 
```

# Install

Recommended process:  
1. Create a .lpath folder in your home directory.
2. Move the lpath executable into that folder.
3. Create a paths folder in that folder where you will put all your startup path scripts.
4. Create a .global.path file in that folder which will run on startup (Scroll down to see contents of this file).
5. Add the content of add-to-bashrc.sh to the end of your .bashrc or .{shell}rc file.
6. That's it! 🥳
   
.global.path:
```
# This runs on startup.

@include ./paths/*.path # Includes everything in the paths folder

$DIR$ # Adds lpath to the path
```

# Docs

See a quick documented example of the .path file format from example.path.  
For help with the cli run (Make sure lpath is properly installed):
```bash
lpath --help
```
