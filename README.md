This [fork](#forked-from-deskreen) was not intended for active development but fixes some annoying features and clarifies certain issues. See more [here](#forked-from-deskreen).

The project is old and difficult to maintain.

<h1><img src="./resources/icons/icon_48x48.png" /> EchoScreen</h1>

## Whats changed
### v3.2.0
* New icon and name – for better differentiation from v2
* The video automatically zooms in on click (due to devices that are difficult to navigate with a mouse, e.g., TVs)

### v3.0.0
* Removed banner – it was unnecessary.
* Removed donate button – original project was inactive since 2022.
* Random PIN generation – I want to share the screen with my TV, and while a random PIN provides security, it was more frustrating than useful for me.
* Original name and icon retained if you just want to run a version without distracting elements.

### Known issue
* "No Wifi or LAN connection" error – The project works with Node.js versions between v14 and v20. If your system has a higher Node version, this issue may occur.
* Automatic fullscreen without user interaction does not work due to browser security policies. (See: [#11](https://github.com/rozsazoltan/echoscreen/issues/11))

## Contribute

### Requirements
* Node.js v16.x
* yarn v1.x
* react-scripts latest

```none
# For mise version manager
mise use node@16

# For nvm version manager
nvm use 16.20.2
```

```none
npm i -g yarn react-scripts
```

```none
yarn install
cd ./app/client; yarn install --frozen-lockfile ; cd ./../../ ; yarn install --frozen-lockfile
```

### How to start project

```
# Dev Mode
yarn dev

# Prod Mode
yarn start
```

### How to make build

```
# Win 64bit
yarn package-win

# Win 32bit
yarn package-win-32

# macOS
yarn package-mac

# Linux
yarn package-linux
```

## Forked from Deskreen

This project is a modified version of [Deskreen](https://github.com/pavlobu/deskreen),  
originally created by [pavlobu](https://github.com/pavlobu).

Deskreen is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](https://github.com/pavlobu/deskreen/blob/master/LICENSE).  
AGPL-3.0 License © [Pavlo (Paul) Buidenkov](https://github.com/pavlobu/deskreen)
