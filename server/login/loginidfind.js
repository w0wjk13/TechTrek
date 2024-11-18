import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'findUserID'(name, phone) {
    if (!name || !phone) {
      throw new Meteor.Error('invalid-input', '이름과 전화번호를 모두 입력해 주세요.');
    }

    const user = Meteor.users.findOne({ 'profile.name': name, 'profile.phone': phone });

    if (user) {
      return user.emails[0].address; // 이메일 주소 반환
    } else {
      throw new Meteor.Error('user-not-found', '해당 정보를 가진 사용자가 없습니다.');
    }
  }
});
