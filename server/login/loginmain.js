import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Study, StudyUsers, Files } from '/imports/api/collections';

Meteor.startup(() => {

  // 사용자 등록시 필수 검증
  Accounts.onCreateUser((options, user) => {


    // 사용자 이메일, 비밀번호, 기술 스택 등 추가 정보 처리
    if (options.profile) {
      user.profile = options.profile;
    }

    // 추가 필수 검증 예시: 이름이 없으면 에러 처리
    if (!user.profile || !user.profile.name) {
      throw new Meteor.Error(403, "이름을 입력해주세요.");
    }

    // 기타 추가 로직 필요 시 여기에 작성
    return user; // 사용자를 반환해야 계정이 생성됨
  });

  // 로그인 후 특정 로직 처리 (예시)
  Meteor.methods({
    'users.checkEmailAvailability'(email) {
      check(email, String);
      return !Meteor.users.findOne({ email });
    }
  });
});
