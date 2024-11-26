import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections';



// Meteor method로 Study 데이터를 가져오는 메서드 정의
if (Meteor.isServer) {
  Meteor.methods({
    'study.get'(id) {
      check(id, String);  // ID는 문자열이어야 함
      return Study.findOne(id);  // 해당 ID로 스터디를 찾음
    }
  });
}