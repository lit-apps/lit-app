# Notes re a11y-form

This repository is meant to be a replacement of @preignition/preignition-forms.

It is also going to be the base for The survey application and the form application.

## Challenges

Those main difficulties are anticipated:

1. The fact that native forms is not working across shadow dom. We would need to write our own form wrapper In order to overcome this.

2. Form logic was previously relying on firebase listeners. We need to find a way to replace this.

3. realtime ballance with firestore. We don't want to blow up the write quota, but still want to have realtime updates on client side. [See metadata for more info.](https://firebase.google.com/docs/firestore/query-data/listen#events-local-only)

4. respondent data need to be stored on the location chosen by the customer. This means that we need to be able to store data in a location that is not the default firestore location.

This might be a good way to handle data observability: https://javascript.info/proxy

Another option might be to use firestore, only with the cache enabled. This way we can still use the listeners, and not store data in the cloud.

## Scope

This package is meant to replace @preignition/preignition-forms. It should be able to handle all the forms that preignition-forms was able to handle: 

- form rendering (data-entry)
- form validation
- form logic

Form definition will be done in @lit-app/form



