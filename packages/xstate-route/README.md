# `route-state` package

This package binds its state's state machine with [`router-slot`](). 

Note that Know that we're not using The native `router-slot` slot package, but an update version of it. This updated version fixes a couple of bugs and allows to user `lit` template render directly in the `Routes`.

## Rationale

We want to be able to use xstate actor machine along with routing of the application. 

## TODO: 
- find a way to update route when the machine enters a `route` state.
- test state routing PR
- add tests