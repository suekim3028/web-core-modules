# Web Core Modules

> A personal core modules for web project

This is a repository I put my frequently-used utils, hooks, etc together.

## Getting started

### Add this repository as submodule in new project

The code below names the submodule **web-core-modules**.

`git submodule add https://github.com/suekim3028/suekim3028-web-core-modules.git web-core-modules`

### For easier import, add the submodule to tsconfig paths.

You need to align the relative path value to where you add your submodule to.

```
{
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "paths": {
      "@web-core": ["web-core-modules"],
      "@*": ["src/*"]
    },
    ...
  },
  ...
}
```

## Features

This project makes it easy to:

- import frequently used js utils without repetitive codes in multiple projects.
