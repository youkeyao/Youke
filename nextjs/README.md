# Youke(Next.js)
This is my website built by Next.js.

## Contents
- homepage
- profile
   - builds from `/posts/profile.md`
- blog
   - builds from `/posts/blog/`
- icloud
   - support url navigation and file preview
- music
   - use neteasecloud api

## Structure
```
|-- components
|-- iCloud (store icloud files)
|-- pages
    |-- api
        |-- auth (api for icloud)
        |-- login.tsx (api for login)
    |-- icloud
        |-- [[...path]].tsx (icloud page)
    |-- ...
|-- posts
    |-- blog
        |-- ...
    |-- profile.md (profile in markdown)
|-- styles (CSS files for pages)
|-- tmp (temporary dir to save upload files)
|-- next.config.js (config file)
```

## Config
In next.config.js
- **env.root** : root path for icloud
- **env.secret** : secret to generate token
- **env.username** : username for icloud
- **env.password** : password for icloud

## Use
- dev : `npm run dev`
- production : `npm run build && npm run start`