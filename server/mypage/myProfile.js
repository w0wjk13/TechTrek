import { Meteor } from "meteor/meteor";

Meteor.methods({
  //변경한 기술스택 저장
  saveTechStack: function (stackList) {
    return Meteor.users.update(this.userId, {
      $set: { "profile.techStack": stackList },
    });
  },
});
