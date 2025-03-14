The original creator of the project became inactive and abandoned the package. This fork was not intended for active development but fixes some annoying features and clarifies certain issues.

The project is old and difficult to maintain.

### Whats changed
* Removed banner – it was unnecessary.
* Removed donate button – original project was inactive since 2022.
* Random PIN generation – I want to share the screen with my TV, and while a random PIN provides security, it was more frustrating than useful for me.

### Known issue
* "No Wifi or LAN connection" error – The project works with Node.js versions between v14 and v20. If your system has a higher Node version, this issue may occur.

### Contribute

#### Requirements
* Node.js v14.x
* yarn v1.x
* react-scripts latest

```none
npm i -g yarn react-scripts
```

#### How to start project

```none
yarn install
cd ./app/client; yarn install --frozen-lockfile ; cd ./../../ ; yarn install --frozen-lockfile
```

```
# Dev Mode
yarn dev

# Prod Mode
yarn start
```

### Source
* [pavlobu/deskreen](https://github.com/pavlobu/deskreen)
