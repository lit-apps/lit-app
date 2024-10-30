# Notes re a11y-form

This repository is meant to be a replacement of @preignition/preignition-forms.

It is also going to be the base for The survey application and the form application.

Two main difficulties are anticipated:

1. The fact that native forms is not working across shadow dom. We would need to write our own form wrapper In order to overcome this.

2. Form logic was previously relying on firebase listeners. We need to find a way to replace this.

This might be a good way to handle data observability: https://javascript.info/proxy

Another option might be to use firestore, only with the cache enabled. This way we can still use the listeners, and not store data in the cloud.

