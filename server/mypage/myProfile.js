import { Meteor } from "meteor/meteor";

Meteor.methods({
  getEmail: (userId) => {
    const user = Meteor.users.findOne(userId);
    if (user) {
      return user.emails[0]?.address;
    }
    throw new Meteor.Error("email 찾을 수 없음");
  },
});
