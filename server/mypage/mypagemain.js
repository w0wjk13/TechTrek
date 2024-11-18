// /imports/api/userProfile.js
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

// 이 부분은 삭제하고, 직접 Meteor.users에서 데이터를 가져오도록 합니다.
export const UserProfile = new Mongo.Collection("userProfile");

if (Meteor.isServer) {
  Meteor.publish("userProfile", function () {
    // 로그인된 유저의 프로필 정보만 반환 (Meteor.users에서 profile을 가져옴)
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, { fields: { profile: 1, email: 1 } });
    }
    return this.ready(); // 로그인되지 않으면 빈 데이터 반환
  });
}
