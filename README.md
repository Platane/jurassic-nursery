![Jurassic Nursery](./doc/images/400x250.png)

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Platane/jurassic-nursery/main.yml?style=flat-square)](https://github.com/Platane/jurassic-nursery/actions/workflows/main.yml) [![Size report](https://img.shields.io/endpoint?url=https://platane.github.io/jurassic-nursery/shieldio_size.json&style=flat-square)](https://platane.github.io/jurassic-nursery/bundle.zip)

Pet and feed adorable triceratops.

If you feed them well they might reproduce. Would you be able to breed a golden one ?

- 🦎 [play](https://platane.github.io/jurassic-nursery/)
- 🏆 or go to the [js13k entry page](https://js13kgames.com/entries/jurassic-nursery)
- 📓 read the [postmortem](./doc/postmortem/index.md)

# Screenshots

[<img src="./doc/postmortem/images/eat.gif" height="200px" title="triceratops eating fruits" >](./doc/postmortem/images/eat.mp4)
[<img src="./doc/postmortem/images/mate.gif" height="200px" title="triceratops reproducing" >](./doc/postmortem/images/mate.mp4)
[<img src="./doc/postmortem/images/pick.gif" height="200px" title="triceratops eating fruits" >](./doc/postmortem/images/pick.mp4)

_Adorable, I know_

# Usage

```sh

bun install


npm run dev


# needs advzip
npm run build

```

# TODO

- [x] color pattern
- [x] triceratops ray collision
- [x] walk to a point
- [x] restrict playground, allows to have a spot for
  - secure food
  - drop triceratops
- [x] collision avoidance
- [x] restrict camera movement (pan only ? two finger on mobile and pan on mouse hover edge on desktop )

- [ ] react to mouse movement, fruit pick up ect ..
- [ ] trees
- [ ] bones on trees
- [ ] ui select triceratops
