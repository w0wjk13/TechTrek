// imports/api/studyform.js
import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections'; // Study 컬렉션을 가져옵니다.

Meteor.methods({
  // 현재 로그인한 유저가 생성한 스터디 가져오기
  'study.getMyStudies': function () {
    // 로그인하지 않은 경우
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    // 현재 로그인한 사용자가 생성한 스터디를 찾기
    const myStudies = Study.find({ userId: this.userId }).fetch(); // 로그인한 유저가 생성한 스터디 목록을 찾음

    if (myStudies.length === 0) {
      throw new Meteor.Error('no-studies', '생성한 스터디가 없습니다.');
    }

    return myStudies;  // 로그인한 유저가 생성한 스터디 목록 반환
  }
});
