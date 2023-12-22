For each change made (anything not marked as a "chore"), run the following command:
```
yarn changeset add
```

This will allow you to do the following:

1) Select impacted packages
2) Add a related message
3) Notify what type of package bump is required (major, minor, patch)

-------

# Releasing

When a maintainer is ready to publish, run the following command to generate a changelog:

```
yarn changeset version
```

You should then verify, using your Git CLI or Git GUI, that the CHANGELOG is correct, everything is up-to-date, make a commit, and that you're ready to release!

Then, once you've ran `version`, run the following command to publish to NPM:

```
yarn changeset publish
```
