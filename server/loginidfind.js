import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  'findUserID': function (name, phone) {
    // 이름과 전화번호가 문자열인지 확인
    if (typeof name !== 'string' || typeof phone !== 'string') {
      throw new Meteor.Error('invalid-input', '이름과 전화번호는 문자열이어야 합니다.');
    }

    // 이름과 전화번호로 사용자를 찾기
    const user = Accounts.findUserByUsername(name); // 이름으로 사용자를 찾음
    if (user && user.profile && user.profile.phone === phone) {
      return user.email;  // 이메일을 반환
    } else {
      throw new Meteor.Error('user-not-found', '해당 정보로 등록된 아이디가 없습니다.');
    }
  }
});
