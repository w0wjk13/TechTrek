import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";

Meteor.methods({
  insert: function (uploadData) {
    if (!this.userId) {
      throw new Meteor.Error("notLogin", "로그인 하세요");
    }

    const data = {
      userId: this.userId,
      ...uploadData,
      createdAt: new Date(),
    };

    return Study.insert(data);
  },
});
