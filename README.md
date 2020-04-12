<h1 align="center">
  react-listbox ⚛️📝📦
</h1>

<p align="center">  
  Composable WAI-ARIA compliant listbox React components.
</p>

[![Build Status](https://travis-ci.com/hzhu/react-listbox.svg?token=mHeyvKp5LKkpbHb23RgK&branch=master)](https://travis-ci.com/hzhu/react-listbox)
[![codecov](https://codecov.io/gh/hzhu/react-listbox/branch/master/graph/badge.svg?token=3T4T64ND82)](https://codecov.io/gh/hzhu/react-listbox)

## Usage

```js
<Listbox>
  <ListboxOption value="ford">Ford</ListboxOption>
  <ListboxOption value="honda">Honda</ListboxOption>
  <ListboxOption value="tesla">Tesla</ListboxOption>
  <ListboxOption value="toyota">Toyota</ListboxOption>
</Listbox>
```

## Local Development

The project uses [Storybook](https://storybook.js.org/) to interactively develop components with hot reloading. The `react-listbox` Storybook is [published here](https://react-listbox.netlify.com).

Clone this repository

```
git clone git@github.com:hzhu/react-listbox.git
```

Install dependencies

```
yarn
```

Run Storybook

```
yarn start
```

Navigate to http://localhost:3000.

## Testing

This project uses [Jest](https://github.com/facebook/jest) and [react-testing-library](https://github.com/kentcdodds/react-testing-library) 🐐 for testing.

To run the tests

```
yarn test
```

or to continuously watch

```
yarn test --watch
```
