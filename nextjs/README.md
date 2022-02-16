# Youke(Next.js)
This is my website including homepage, profile, icloud built by Next.js. The profile builds from `/posts/profile.md`. The icloud supports url navigation and file preview.

## Modules
- next
- typescript
- formidable
- nookies
- jsonwebtoken

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
    |-- other page
|-- posts
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