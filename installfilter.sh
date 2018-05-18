#!/bin/bash
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m"

CMDSUFFIX=""

unameOut="$(uname -s)"
case "${unameOut}" in
    CYGWIN* | MINGW*)
        CMDSUFFIX=".cmd"
        ;;
esac

read -p "This will install the no-secrets smudge and clean filter. Press enter to continue or any other key cancel:" -n1 AREYOUSURE

if [ "$AREYOUSURE" != "" ]
then
    exit 0
fi

read -p "Enter the filter name, press enter for default ('no-secrets'):" FILTERNAME
FILTERNAME=${FILTERNAME:="no-secrets"}

read -p "Enter the .gitattributes file mask, pres enter for default ('*.config'):" GITMASK
GITMASK=${GITMASK:="*.config"}

printf "\n"

GITFILTER="$GITMASK filter=$FILTERNAME"
GITREPOBASE=`git rev-parse --show-toplevel`
GITATTRIBUTES="$GITREPOBASE/.gitattributes"
GITIGNORE="$GITREPOBASE/.gitignore"
GITFILTERTEMPLATEJSON="$FILTERNAME.template.json"
GITFILTERJSON="$FILTERNAME.json"
NODE_MODULES=`npm root -g`
NODE_MODULES=${NODE_MODULES//\\/\/}
GLOBAL_BIN=`npm bin -g`
GLOBAL_BIN=${GLOBAL_BIN//\\/\/}

# add filter to .gitattributes if it doesn't already exist
grep -q -F "$GITFILTER" $GITATTRIBUTES > /dev/null 2>&1
if [ $? != "0" ] 
then 
    echo $GITFILTER >> $GITATTRIBUTES 
    printf "$GITFILTER added to .gitattributes\n"
fi

# add filter template json to .gitignore if it doesn't already exist
grep -q -F "$GITFILTERJSON" $GITIGNORE > /dev/null 2>&1
if [ $? != "0" ]
then
    echo $GITFILTERJSON >> $GITIGNORE
    printf "$GITFILTERJSON added to .gitignore\n"
fi

cp ${NODE_MODULES}/no-secrets/no-secrets.template.json $FILTERNAME.template.json
git config --remove-section "filter.$FILTERNAME" > /dev/null 2>&1
git config --add filter.$FILTERNAME.smudge "${GLOBAL_BIN}/no-secrets${CMDSUFFIX} $FILTERNAME.json smudge %f"
git config --add filter.$FILTERNAME.clean "${GLOBAL_BIN}/no-secrets${CMDSUFFIX} $FILTERNAME.json clean %f"

printf "${GREEN}Filter installed.${NC}\n\n"
printf "${RED}** Edit ${YELLOW}$GITFILTERTEMPLATEJSON ${RED}with empty clean and smudge values and then copy the file to ${YELLOW}$GITFILTERJSON${RED} **${NC}\n\n"

read -p "Press a key to continue..." -n1