# Assemble Editor

An [Electron] based app for creating, editing, saving, and publishing
[Assemble] applications.

This project is based on the wonderful [Spectacle-editor],
created by [Formidable] and [Plotly].

## Getting started with development

Please review the [contributing guidelines] first.

Fork then clone the repo:

```
git clone git@github.com:<USERNAME>/spectacle-editor.git
```

Install dependencies:

```
cd spectacle-editor && yarn install
```

Run Spectacle Editor in dev mode:

```
yarn run dev
```

Running tests/lint:

```
yarn run check
```

## Overview

The initial setup of this project is based on [electron-react-boilerplate].

[MobX] and [seamless-immutable] are used for the store(s).

> Note: Instead of actions,
> components call methods on the store(s) passed down via context.

Assemble Editor leverages [React-Motion] for drag and drop functionality.

### Draggable elements

The elements that can be added to slides and edited include:

* Text
* Image
* Plotly chart
* Table
* Shape (V2)
* MathJax (V2)

Each element will have a corresponding property menu
that is available when an element of that type is selected.

### Canvas

The canvas is the editable area that displays the current slide.
Elements can be dropped on the canvas, repositioned and formatted.

### Slide list

The slide list displays all slides in the presentation
and allows for changing the selected slide and reordering existing slides.

### Property menu

This is where options for the selected element will appear.
The menu will depend on the type of element selected.
If no element is selected a slide menu will appear.

## Creating release packages

To build for Windows on MacOS, you'll need (this may take 30+ mins):

```bash
brew install wine --without-x11
brew install mono
```

To build for Linux on MacOS, you'll need:

```bash
brew install gnu-tar libicns graphicsmagick xz
```

To build and package for all platforms, run:

```bash
yarn run release
```

Other packaging steps are:

```
yarn run package-all
yarn run package-mac
yarn run package-win
yarn run package-linux
```

## Further Attribution

In addition to the license text in [LICENSE.md](LICENSE.md),
much of this code was originally licensed to [Formidable] under the MIT license,
specifically that listed [here][formidable-license]

[Assemble]: http://assembleapp.co
[Electron]: https://github.com/electron/electron
[Spectacle-editor]: https://github.com/FormidableLabs/spectacle-editor
[Formidable]: http://formidable.com
[Plotly]: https://plot.ly
[contributing guidelines]: https://github.com/FormidableLabs/spectacle-editor/blob/master/CONTRIBUTING.md
[electron-react-boilerplate]: https://github.com/chentsulin/electron-react-boilerplate
[MobX]: https://mobxjs.github.io/mobx
[seamless-immutable]: https://github.com/rtfeldman/seamless-immutable
[React-Motion]: https://github.com/chenglou/react-motion
[formidable-license]: https://github.com/FormidableLabs/spectacle-editor/blob/4899faf5a164f6d308a28520d4b861b0aaceff8a/LICENSE
