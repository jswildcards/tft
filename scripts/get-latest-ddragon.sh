url="https://ddragon.leagueoflegends.com/api/versions.json"

# get all versions
target_version=$(curl $url)

# get target version by string substitution
if [[ $target_version =~ \[\" ]]; then
  target_version="${target_version/${BASH_REMATCH[0]}/}"
fi

if [[ $target_version =~ \",(.*) ]]; then
  target_version="${target_version/${BASH_REMATCH[0]}/}"
fi

# check if target version number is valid
if ! [[ $target_version =~ [0-9]*\.[0-9]*\.[0-9]* ]]; then
  echo "Invalid version number"
  exit
fi

target_directory="public/data/data-dragon/${target_version}"
target_tgz="dragontail-${target_version}.tgz"
target_tgz_url="https://ddragon.leagueoflegends.com/cdn/${target_tgz}"

# check if target ddragon directory exists
if [ -d $target_directory ]; then
  echo "DDragon data directory of version ${target_version} exists"
  exit
fi

# create target ddragon directory
mkdir $target_directory
cd $target_directory

# download ddragon data tgz
wget $target_tgz_url
# unzip downloaded data
tar -xzf $target_tgz
# get related tft data files
mv ${target_version}/data/en_US/tft-* ./
# remove unrelated files and directories
find . ! -name "tft-*" -exec rm -rf {} +
