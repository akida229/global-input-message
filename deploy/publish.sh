projectversion=`grep -A 1 -B 2 '"name": "global-input-message",' package.json | grep '"version":' | sed 's,"version": ",,g' | sed 's-",--g'`
echo $projectversion
lastdigit="${projectversion##*.}"
maninVersion="${projectversion%.*}"
nextDigit=$((lastdigit+1))
nextVersion="$maninVersion.$nextDigit"
echo $nextVersion

git add .
git commit -m "update"
git push origin
git checkout master
git merge develop
git push origin
npm version $nextVersion
npm publish
git checkout develop







webversion=`grep -A 0 -B 0 '"global-input-message":' ../global-input-web/package.json |  sed 's/"global-input-message": "^//g'  | sed 's/",//g' `
mobileversion=`grep -A 0 -B 0 '"global-input-message":' ../globalInputMobile/package.json |  sed 's/"global-input-message": "^//g'  | sed 's/",//g' `

echo $nextVersion
echo $webversion
echo $mobileversion

nextVersion=$(echo "$nextVersion" | sed -e "s/ //g")
webversion=$(echo "$webversion" | sed -e "s/ //g")


oldstring='\"global-input-message\": \"^'$webversion'\"'
newstring='\"global-input-message\": \"^'$nextVersion'\"'


comandtoexecute='sed -i -e "s/'$oldstring'/'$newstring'/g" ../global-input-web/package.json'
eval $comandtoexecute

comandtoexecute='sed -i -e "s/'$oldstring'/'$newstring'/g" ../globalInputMobile/package.json'
eval $comandtoexecute

sleep 1

cd ../global-input-web/
yarn install

cd ../globalInputMobile/
yarn install
