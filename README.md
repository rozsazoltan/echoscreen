<h1><img src="./resources/icons/icon_48x48.png" /> EchoScreen</h1>

> [!IMPORTANT]
> EchoScreen is a forked version of Deskreen from 2025, created with minor modifications. **It was not made for profit or personal fame, but solely for implementing personal fixes for personal use.** The project was published only because of its open-source origins. Regardless, all my respect goes to [Deskreen](#forked-from-deskreen).

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
* "No Wifi or LAN connection" error – This project is compatible only with Node.js versions between v14 and v20. If the build is compiled using a higher Node.js version, this error may occur.
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

## Release

### Conventional commits

We aim to make code changes more transparent by using conventional commits. This convention helps keep commit messages clear and structured, making it easier to understand what kind of changes have been made.

For more details, see the official specification at [conventionalcommits.org](https://conventionalcommits.org).

### Semantic versioning

Version numbers are released semantically to clearly indicate the nature of changes in each version.
* X - major version: changes that are not backward compatible
* Y - minor version: backward-compatible new features
* Z - patch version: backward-compatible bug fixes

For example, version `v2.5.1` means major version `2`, minor version `5`, and patch version `1`.

The official specification for semantic versioning can be found at [semver.org](https://semver.org).

### Prepare PR and Build

To release a new version, we use GitHub Actions. First, a "Prepare PR" (pull request) is created for the new version. This PR automatically updates the necessary files, though some manual edits might still be needed, for example, in the CHANGELOG or other documentation. Once the PR is merged, the release process starts automatically, triggering the build of installers for Windows, macOS, and Linux.

## Forked from Deskreen

This project is a modified version of [Deskreen](https://github.com/pavlobu/deskreen), originally created by [pavlobu](https://github.com/pavlobu).

Deskreen is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](https://github.com/pavlobu/deskreen/blob/master/LICENSE).  
AGPL-3.0 License © [Pavlo (Paul) Buidenkov](https://github.com/pavlobu/deskreen)

## License

This project is a fork of [Deskreen](https://github.com/pavlobu/deskreen),
originally created and licensed by [Pavlo (Paul) Buidenkov](https://github.com/pavlobu) under the [GNU Affero General Public License v3.0 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.html).

Modifications © 2025–present [Zoltán Rózsa](https://github.com/rozsazoltan)

This modified version is also licensed under the AGPL-3.0.  
For full license terms, see the [LICENSE](./LICENSE) file.

## Copyright

**AGPL-3.0 License © [Pavlo (Paul) Buidenkov](https://github.com/pavlobu/deskreen)**<br>
Apache 2.0 © [blueprintjs](https://github.com/palantir/blueprint)<br>
MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)<br>
simple-peer MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org/)<br>
GNU General Public License (GPL) Version 2 © [node-forge](https://github.com/digitalbazaar/forge)<br>
ISC Copyright (c) 2019, Mapbox [pixelmatch](https://github.com/mapbox/pixelmatch)

## Thanks

We express our sincere gratitude to [Pavlo (Paul) Buidenkov](https://github.com/pavlobu) for originally creating [Deskreen](https://github.com/pavlobu/deskreen) and for his long-term, selfless dedication to maintaining it. His work laid the foundation for everything that followed, and we hold his contribution in the highest regard.

We also thank the [Electron React Boilerplate community](https://github.com/electron-react-boilerplate/electron-react-boilerplate) for providing a well-structured starter template that greatly accelerated the early stages of Deskreen's development.

Appreciation goes to [GitHub Actions](https://github.com/features/actions) for enabling a dependable continuous integration system, which has been essential throughout the development process.

Finally, a heartfelt thank you to the broader [open-source](https://github.com/open-source) community and to the maintainers of the libraries used in this project. Your ongoing efforts make projects like this possible.

**Motivation:** Because _together_, nothing is impossible.
