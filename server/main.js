import { Files } from "/imports/api/collections";
import { Accounts } from "meteor/accounts-base";
import "./login/loginmain.js";
import "./login/loginidfind.js";
import "./login/loginform.js";
import "./login/loginpwfind.js";
import "./studynotifications.js";
import "./init.js";
import "./uploadstudy/uploadStudy.js";
import "./uploadstudy/detailStudy.js";
import "./home.js";
import "./mypage/myProfile.js";
import "./mypage/peopleList.js";

Meteor.publish("allUsers", function () {
  return Meteor.users.find({}, { fields: { emails: 1, profile: 1 } });
});
