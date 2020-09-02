echo "Generating file structure..."

mkdir -p "${HOME}/.lpath"

cd "${HOME}/.lpath"

mkdir -p "./paths"

printf "# This runs on startup\n@include ./paths/*.path\n\n\$DIR\$ # Adds lpath to path\n" > .global.path

printf "Downloading lpath...\n\n"

curl https://raw.githubusercontent.com/spasimir21/lpath/master/dist/lpath -o lpath

chmod 755 ./lpath

printf "\nAdd this to the end of your .bashrc, .{shell}rc or .profile file:\n\n"

printf "# Init lpath\nif [[ -z \"\${LPATH_DATA}\" ]]; then\n    ~/.lpath/lpath add ~/.lpath/.global.path --silent\nfi\n"