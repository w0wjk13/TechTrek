import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";

Meteor.methods({
  insert: (uploadData) => {
    return Study.insert(uploadData);
  },
});
