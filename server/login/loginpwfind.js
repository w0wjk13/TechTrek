import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'findUserPassword'(name, email, phone) {
    // 입력 값 검증
    if (!name || !email || !phone) {
      throw new Meteor.Error('invalid-input', '모든 정보를 입력해 주세요.');
    }

    // 사용자 검색
    const user = Meteor.users.findOne({
      'profile.name': name,
      'emails.0.address': email, // 첫 번째 이메일 주소를 확인
      'profile.phone': phone,
    });

    if (user && user.services && user.services.password) {
      // 실제 비밀번호 대신 테스트 환경에서 사용될 알림 반환
      return '해당 비밀번호는 현재 암호화된 상태입니다.';
    } else {
      throw new Meteor.Error('user-not-found', '해당 정보를 가진 사용자가 없습니다.');
    }
  }
});
