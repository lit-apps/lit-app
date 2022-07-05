#!/usr/bin/env bash
repository="git@github.com:lit-shape/starter.git"

echo -n "name of new directory: "
read repo

echo -n "name of new app: "
read app

camel=$(echo $app | sed -E "s/(^|-)([a-z])/\u\2/g")

# Cloning
git clone "$repository" "$repo"

## rename files
printf "renaming files\n"
find "$repo/src/" -type f -exec rename "s/my-element/$app/" "{}" \;
find "$repo/test/" -type f -exec rename "s/my-element/$app/" "{}" \;

printf "renaming variables\n"
grep -rl MyElement $repo/ | xargs sed -i "s/MyElement/$camel/g"
grep -rl my-element $repo/ | xargs sed -i "s/my-element/$app/g"
sed -i "s/starter/$app/g" "$repo/package.json"

printf "removing .git repo\n"
rm -rf "$repo/.git"
rm -rf "$repo/.vscode"
rm -rf "$repo/.pnpm-lock.yaml"





