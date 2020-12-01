NEW_UUID1=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
NEW_UUID2=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
git add .
git commit -m "$NEW_UUID1"
git push
git add .
git commit -m "$NEW_UUID2"
git push