# vue-electron-starter
> An opinionated starting point for your journey with Electron and Vue. 

## What's included?

- [Electron](https://www.electronjs.org/) 18
- [Vue](https://vuejs.org/) 3.2
- Logging
- I18n

## Project setup
```
npm i --legacy-peer-deps
```
This project still uses vue-cli. However, Vue now uses Vite. In order to be able to use packages that are as up-to-date
as possible, `--legacy-peer-deps` is unfortunately necessary.

## Start your engines
```
npm run electron:serve
```

## Another Logging implementation, am I crazy?
No, not really, but the existing loggers annoyed me so much, but I don't want to name names.

Sorry gals and boys, but there is no fs in the browser, and I don't want to bother with setting up some polyfills only
because you are so lazy to write code that works with Node and the browser.

The logging is simple, but meets all the requirements I have.

- works simple in the browser
- works with Node
- can be written to file
- logs from browser (renderer) are also shown in the backend (Electron)

## Internationalisation

I needed something that would work in the Electron backend, i.e. for menus and trays.
[I18next](https://www.i18next.com/) looked good and was easy to use.

You can simply switch the language at runtime, unless you are using menu accelerators.  
The only way to tell Electron which locale to use seems to be `app.commandLine.appendSwitch('lang', 'en')`, and this
only works at start so a restart would be necessary.  
Sadly they don't seem to change it:
[https://github.com/electron/electron/issues/5649](https://github.com/electron/electron/issues/5649)  
Perhaps at some point in the future, someone will realise that a complete language change without restarting the
application would be a great idea.

I also decided to not use any fs-backend for I18n because it is simply not necessary. One can simply load any JSON file
with TypeScript `import` statement and use it.

For Vue I used [vue-I18n](https://github.com/intlify/vue-i18n-next) in the past.  
This time I decided to leave it out and use something very lightweight. A few lines of my own code.

Yes, I'm doing away with the I18n block in a Vue file, but I'm more of a friend of global configuration in the
corresponding JSON files anyway, and so I don't need to deal with two libraries (and vue-I18n has tons of dependencies
too).
